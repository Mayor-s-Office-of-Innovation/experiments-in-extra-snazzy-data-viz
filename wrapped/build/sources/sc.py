#!/usr/bin/env python3
"""streetconditions source ingest — the Camera + Algorithm lenses.

Reads the raw export CSV and produces wrapped/data/sc.json: per-neighborhood and
per-hex aggregates of AI-scored staff photos, plus the Tenderloin observer-toggle
exhibit block. Fully local (no network). See plan.md "Data reality" for every
decision baked in here.

Key facts encoded (all verified against the real export):
  - SC = an AI vision model scoring staff photos. NOT human judgment, NOT the public.
  - Score formula: total_score = round(100 * (1 - S/36)), S = sum of 12 category
    ratings (0-3 each). Flat, unweighted. We trust the CSV's total_score directly.
  - 12 categories; Active Drug Use is EXCLUDED from comparison (AI blind spot).
  - matched_district is dead -> assign via point-in-polygon (geo.py).
  - Scrub: drop out-of-SF-bbox coords + the default-centroid "unknown location" rows.
  - Dup photos per block are intentional (different angles) -> NOT deduped.
  - Observers anonymized to u0..uN (u0 = most prolific). Enables the Tenderloin
    exhibit without carrying any PII (never emails/names).

Run:  python3 wrapped/build/sources/sc.py
"""
import csv
import json
import statistics
import sys
from collections import defaultdict, Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import geo  # noqa: E402

csv.field_size_limit(10 ** 7)

# ---- paths & config ---------------------------------------------------------
BUILD = Path(__file__).resolve().parents[1]
DATA = BUILD.parent / 'data'
CSV_PATH = DATA / 'raw' / 'sc_export.csv'
GEOJSON = DATA / 'neighborhoods.geojson'
OUT = DATA / 'sc.json'

WINDOW = {'start': '2026-01-30', 'end': '2026-06-08'}   # LOCKED, matches export coverage

# The 12 canonical categories (order = display order). Active Drug Use is carried
# but flagged excluded_from_comparison — the AI misses hidden/fold drug use.
CATEGORIES = [
    'RV or other inhabited vehicle', 'Waste & Small Debris', 'Furniture & Large Debris',
    'Human and Animal Waste', 'Sharps', 'Unsheltered Presence', 'Fire & Safety Hazards',
    'Access Obstruction', 'Active Drug Use', 'Public Health Need', 'Animals', 'Graffiti',
]
CAT_SET = set(CATEGORIES)
EXCLUDED_CATS = {'Active Drug Use'}

# Tier rules (see plan.md). Tier 1 needs both volume AND enough severe signal to
# support a problems + 311 comparison; Tier 2 = ambient score only; Tier 3 = suppress.
TIER1_MIN_OBS, TIER1_MIN_SEVERE = 200, 30
TIER2_MIN_OBS = 50


def tier_for(obs, severe):
    if obs >= TIER1_MIN_OBS and severe >= TIER1_MIN_SEVERE:
        return 1
    if obs >= TIER2_MIN_OBS:
        return 2
    return 3


def parse_ratings(raw):
    """Return {category: rating} for the 12 canonical cats, or None if unusable
    (empty, or the stray alternate-taxonomy row)."""
    if not raw or raw == '[]':
        return None
    try:
        arr = json.loads(raw)
    except Exception:
        return None
    out = {}
    for o in arr:
        c = o.get('category')
        if c in CAT_SET:
            out[c] = int(o.get('rating', 0) or 0)
    if len(out) != 12:
        return None   # stray taxonomy / incomplete — quarantine
    return out


def main():
    hoods = geo.load_neighborhoods(GEOJSON)
    rows = list(csv.DictReader(open(CSV_PATH, newline='')))
    print(f"Loaded {len(rows):,} raw rows from {CSV_PATH.name}")

    # --- anonymize observers: u0..uN by total (post-scrub) volume ---------------
    # First pass counts per user_id so we can rank -> opaque ids.
    scrub = {'oob': 0, 'default_centroid': 0, 'unassigned': 0, 'no_ratings': 0}

    # Pre-scrub each row once; keep the usable ones with derived fields.
    clean = []
    for r in rows:
        try:
            lat, lng = float(r['location_lat']), float(r['location_lng'])
        except (ValueError, KeyError):
            scrub['oob'] += 1
            continue
        if geo.is_default_centroid(lat, lng):
            scrub['default_centroid'] += 1
            continue
        if not geo.in_sf_bbox(lat, lng):
            scrub['oob'] += 1
            continue
        hood = geo.assign(lat, lng, hoods)
        if hood is None:
            scrub['unassigned'] += 1
            continue
        ratings = parse_ratings(r.get('ratings_details', ''))
        try:
            score = float(r['total_score'])
        except (ValueError, KeyError):
            continue
        clean.append({
            'lat': lat, 'lng': lng, 'hood': hood, 'ratings': ratings, 'score': score,
            'user': r.get('user_id', 'anonymous'), 'h3': r.get('h3_index', ''),
            'status': r.get('status_label', ''), 'date': r.get('date', ''),
        })
    print(f"After scrub: {len(clean):,} usable obs  (dropped {scrub})")

    # Rank observers by volume -> opaque ids (u0 = most prolific).
    user_counts = Counter(o['user'] for o in clean)
    order = [u for u, _ in user_counts.most_common()]
    uid = {u: f"u{i}" for i, u in enumerate(order)}
    for o in clean:
        o['uid'] = uid[o['user']]

    # --- per-neighborhood aggregation ------------------------------------------
    hood_obs = defaultdict(list)
    for o in clean:
        hood_obs[o['hood']].append(o)

    def signal(o):   # any non-excluded category rated >= 1
        return o['ratings'] and any(v >= 1 for c, v in o['ratings'].items() if c not in EXCLUDED_CATS)

    def severe(o):   # any non-excluded category rated >= 2
        return o['ratings'] and any(v >= 2 for c, v in o['ratings'].items() if c not in EXCLUDED_CATS)

    neighborhoods = {}
    for hood, obs in hood_obs.items():
        scores = [o['score'] for o in obs]
        n_sig = sum(1 for o in obs if signal(o))
        n_sev = sum(1 for o in obs if severe(o))
        # per-category tallies
        cats = {}
        for c in CATEGORIES:
            present = sev = ssum = 0
            for o in obs:
                if not o['ratings']:
                    continue
                v = o['ratings'].get(c, 0)
                ssum += v
                if v >= 1:
                    present += 1
                if v >= 2:
                    sev += 1
            cats[c] = {'present': present, 'severe': sev, 'sum_rating': ssum,
                       'excluded': c in EXCLUDED_CATS}
        # dominant observer (for the exhibit / honesty)
        obs_by_uid = Counter(o['uid'] for o in obs)
        top_uid, top_n = obs_by_uid.most_common(1)[0]
        top_sev = sum(1 for o in obs if o['uid'] == top_uid and severe(o))
        neighborhoods[hood] = {
            'tier': tier_for(len(obs), n_sev),
            'obs': len(obs),
            'obs_with_signal': n_sig,
            'obs_with_severe': n_sev,
            'mean_score': round(statistics.mean(scores), 1),
            'median_score': round(statistics.median(scores), 1),
            'status_dist': dict(Counter(o['status'] for o in obs)),
            'categories': cats,
            'dominant_observer': {'uid': top_uid, 'obs': top_n,
                                  'severe': top_sev, 'share': round(top_n / len(obs), 3)},
        }

    # --- per-hex aggregation (for the hero density map) ------------------------
    # Carry BOTH obs count (density = "where the camera looked") and severe count
    # (the honest condition signal). Mean score is near-useless for coloring — 71%
    # of photos are pristine 100s, so it washes out to uniform green.
    # by_uid[uid] = [n, sum_score, severe]
    hex_agg = defaultdict(lambda: {'n': 0, 'sev': 0, 'sum_score': 0.0, 'lat': 0.0, 'lng': 0.0,
                                   'by_uid': defaultdict(lambda: [0, 0.0, 0])})
    for o in clean:
        if not o['h3']:
            continue
        h = hex_agg[o['h3']]
        h['n'] += 1
        is_sev = 1 if severe(o) else 0
        h['sev'] += is_sev
        h['sum_score'] += o['score']
        h['lat'] += o['lat']
        h['lng'] += o['lng']
        bu = h['by_uid'][o['uid']]
        bu[0] += 1
        bu[1] += o['score']
        bu[2] += is_sev
    hexes = []
    for h3, h in hex_agg.items():
        top_uid, (tn, tss, tsev) = max(h['by_uid'].items(), key=lambda kv: kv[1][0])
        hexes.append({
            'h3': h3, 'n': h['n'], 'n_severe': h['sev'],
            'mean_score': round(h['sum_score'] / h['n'], 1),
            'lat': round(h['lat'] / h['n'], 6), 'lng': round(h['lng'] / h['n'], 6),
            'top_uid': top_uid, 'top_uid_n': tn, 'top_uid_severe': tsev,
        })
    hexes.sort(key=lambda x: -x['n'])

    # --- Tenderloin exhibit: hex-level with/without the dominant observer -------
    tl = [o for o in clean if o['hood'] == 'Tenderloin']
    tl_dom = neighborhoods.get('Tenderloin', {}).get('dominant_observer', {}).get('uid')
    # Track severe counts (not score) — that's what re-colors when the sergeant is removed.
    tl_hex = defaultdict(lambda: {'all': [0, 0], 'others': [0, 0]})   # [n, severe]
    for o in tl:
        cell = tl_hex[o['h3']]
        is_sev = 1 if severe(o) else 0
        cell['all'][0] += 1
        cell['all'][1] += is_sev
        if o['uid'] != tl_dom:
            cell['others'][0] += 1
            cell['others'][1] += is_sev
    others = [o for o in tl if o['uid'] != tl_dom]
    tl_exhibit = {
        'dominant_observer': tl_dom,
        'note': 'One city-staff observer (a police sergeant logging the app on his rounds) is '
                '71% of TL obs and 82% of its severe flags. Toggle removes their obs; the map '
                're-colors on SEVERE-obs density (mean score is flat — 71% of photos are 100s).',
        'with': {'obs': len(tl), 'severe': sum(1 for o in tl if severe(o)),
                 'mean_score': round(statistics.mean([o['score'] for o in tl]), 1)},
        'without': ({'obs': len(others), 'severe': sum(1 for o in others if severe(o)),
                     'mean_score': round(statistics.mean([o['score'] for o in others]), 1)}
                    if others else None),
        'hexes': [],
    }
    for h3, c in tl_hex.items():
        tl_exhibit['hexes'].append({
            'h3': h3, 'n_all': c['all'][0], 'sev_all': c['all'][1],
            'n_others': c['others'][0], 'sev_others': c['others'][1],
        })

    # --- citywide --------------------------------------------------------------
    all_scores = [o['score'] for o in clean]
    cat_totals = {}
    for c in CATEGORIES:
        present = sum(1 for o in clean if o['ratings'] and o['ratings'].get(c, 0) >= 1)
        sev = sum(1 for o in clean if o['ratings'] and o['ratings'].get(c, 0) >= 2)
        cat_totals[c] = {'present': present, 'severe': sev, 'excluded': c in EXCLUDED_CATS}
    # night share (Card 6, at-risk): hour of `date` in 22:00-06:00
    def hour(o):
        d = o['date']
        return int(d[11:13]) if len(d) >= 13 and d[11:13].isdigit() else None
    hours = [hour(o) for o in clean]
    night = sum(1 for h in hours if h is not None and (h < 6 or h >= 22))

    citywide = {
        'obs': len(clean),
        'mean_score': round(statistics.mean(all_scores), 1),
        'status_dist': dict(Counter(o['status'] for o in clean)),
        'category_totals': cat_totals,
        'night_obs': night, 'night_share': round(night / len(clean), 3),
        'distinct_observers': len(order),
        'top_observer_share': round(user_counts.most_common(1)[0][1] / len(clean), 3),
    }

    out = {
        'schema_version': 1,
        'source': 'streetconditions',
        'lens': 'camera+algorithm',
        'window': WINDOW,
        'config': {
            'score_formula': 'round(100 * (1 - S/36)), S = sum of 12 category ratings (0-3)',
            'categories': CATEGORIES,
            'excluded_from_comparison': sorted(EXCLUDED_CATS),
            'tier_rules': {'tier1_min_obs': TIER1_MIN_OBS, 'tier1_min_severe': TIER1_MIN_SEVERE,
                           'tier2_min_obs': TIER2_MIN_OBS},
            'scrub': scrub,
            'honesty': 'AI-scored staff photos; not human judgment; not the public. '
                       'Coverage is citywide but downtown-dense; confidence uneven.',
        },
        'citywide': citywide,
        'neighborhoods': neighborhoods,
        'hexes': hexes,
        'tenderloin_exhibit': tl_exhibit,
    }
    OUT.write_text(json.dumps(out, indent=2) + '\n')
    print(f"Wrote {OUT.relative_to(BUILD.parent.parent)} ({OUT.stat().st_size:,} bytes)")
    print(f"  {len(neighborhoods)} hoods · {len(hexes)} hexes · citywide mean score {citywide['mean_score']}")
    t1 = sorted([h for h, v in neighborhoods.items() if v['tier'] == 1], key=lambda h: -neighborhoods[h]['obs'])
    print(f"  Tier 1 ({len(t1)}): {', '.join(t1)}")
    print(f"  Excellent share citywide: "
          f"{100 * citywide['status_dist'].get('Excellent', 0) / citywide['obs']:.0f}%")


if __name__ == '__main__':
    main()
