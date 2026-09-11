#!/usr/bin/env python3
"""One-block exhibit — the v2 "denominator" slide (Insight 2).

Both records of ONE H3 res-10 block over the locked window, on a shared time axis:
  - staff visits (raw export, local; grouped by LOCAL calendar day, worst rating that day)
  - 311 complaints filed inside the same hex polygon (Socrata, network; same service_name
    whitelist + admin-churn blacklist as sources/sf311.py so the two lenses stay comparable)

Writes wrapped/data/block.json. aggregate.py folds it into conditions.json as `block_exhibit`
(and the v2 slice carries it). Output is committed, so this step is OPTIONAL at rebuild time
— it needs the `h3` package (pip install h3) for the exact cell boundary, plus network.

Block choice (2026-09-11): 8a28308280e7fff, Van Ness Ave & Market St. Chosen from the blocks
with >= 10 visit-days by MULTIPLE observers (no single-observer story), with a clean/issue mix
worth showing. Alternates considered: 8a283082862ffff (418 Larkin: 20 visit-days, 9 clean,
but 33/35 photos by one observer), 8a2830828677fff (555 Larkin: 39 visit-days, 143/154 by one).

Run:  python3 wrapped/build/sources/block.py
"""
import csv
import json
import subprocess
import sys
import urllib.parse
from collections import defaultdict, Counter
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import geo  # noqa: E402
from sc import parse_ratings, EXCLUDED_CATS  # noqa: E402
from sf311 import (ENDPOINT, SERVICE_NAME_WHITELIST, DETAILS_BLACKLIST,  # noqa: E402
                   WINDOW_START, WINDOW_END, coalesce_label, _lit)

try:
    import h3
except ImportError:
    sys.exit("block.py needs the h3 package for the exact cell boundary: pip install h3")

BUILD = Path(__file__).resolve().parents[1]
DATA = BUILD.parent / 'data'
CSV_PATH = DATA / 'raw' / 'sc_export.csv'
GEOJSON = DATA / 'neighborhoods.geojson'
OUT = DATA / 'block.json'
csv.field_size_limit(10 ** 7)

HEX = '8a28308280e7fff'
LABEL = 'Van Ness Ave & Market St'
LOCAL = ZoneInfo('America/Los_Angeles')


def local_day(iso_utc):
    """SC export dates are UTC ISO strings; bucket by San Francisco calendar day."""
    s = iso_utc.strip().strip('"').replace('Z', '+00:00')
    try:
        dt = datetime.fromisoformat(s)
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(LOCAL).strftime('%Y-%m-%d')


def visits():
    days = defaultdict(lambda: {'n': 0, 'worst': 0, 'users': set()})
    photos = 0
    for r in csv.DictReader(open(CSV_PATH, newline='')):
        if r.get('h3_index') != HEX:
            continue
        ratings = parse_ratings(r.get('ratings_details', ''))
        if not ratings:
            continue
        d = local_day(r.get('date', ''))
        if not d:
            continue
        # same definitions as sc.py: signal = any non-excluded category >= 1, severe = >= 2
        lv = max((v for c, v in ratings.items() if c not in EXCLUDED_CATS), default=0)
        cell = days[d]
        cell['n'] += 1
        cell['worst'] = max(cell['worst'], min(2, lv))
        cell['users'].add(r.get('user_id', ''))
        photos += 1
    out = [{'d': d, 'n': c['n'], 'lv': c['worst']} for d, c in sorted(days.items())]
    observers = len(set().union(*(c['users'] for c in days.values())) if days else set())
    return out, photos, observers


def cases():
    b = h3.cell_to_boundary(HEX)                       # ((lat, lng), ...)
    ring = ', '.join(f"{lng:.6f} {lat:.6f}" for lat, lng in b) + f", {b[0][1]:.6f} {b[0][0]:.6f}"
    wl = ', '.join(_lit(x) for x in SERVICE_NAME_WHITELIST)
    where = (f"requested_datetime >= '{WINDOW_START}' AND requested_datetime < '{WINDOW_END}' "
             f"AND service_name IN ({wl}) AND within_polygon(point, 'MULTIPOLYGON ((({ring})))')")
    params = {'$select': 'service_request_id, requested_datetime, service_name, service_subtype, service_details',
              '$where': where, '$order': 'requested_datetime ASC', '$limit': '5000'}
    url = f"{ENDPOINT}?{urllib.parse.urlencode(params)}"
    print(f"Fetching 311 inside {HEX} ({LABEL})...")
    out = subprocess.run(['curl', '-fsSL', '--max-time', '60', '-H', 'Accept: application/json', url],
                         capture_output=True, check=True)
    rows = json.loads(out.stdout)
    kept = []
    for r in rows:
        sd = (r.get('service_details') or '').strip()
        if sd in DETAILS_BLACKLIST:
            continue
        kept.append({'d': r['requested_datetime'][:10],          # Socrata datetimes are local
                     'label': coalesce_label(r.get('service_subtype'), sd),
                     'service_name': r.get('service_name', '')})
    # provenance link: the same query, browsable
    view = {'$where': where, '$order': 'requested_datetime DESC', '$limit': '1000'}
    return kept, f"{ENDPOINT}?{urllib.parse.urlencode(view)}", [[lat, lng] for lat, lng in b]


def main():
    hoods = geo.load_neighborhoods(GEOJSON)
    lat, lng = h3.cell_to_latlng(HEX)
    hood = geo.assign(lat, lng, hoods)
    v, photos, observers = visits()
    c, query_url, boundary = cases()
    case_days = sorted(set(x['d'] for x in c))
    summary = {
        'photos': photos, 'visit_days': len(v), 'observers': observers,
        'clean_days': sum(1 for x in v if x['lv'] == 0),
        'issue_days': sum(1 for x in v if x['lv'] == 1),
        'severe_days': sum(1 for x in v if x['lv'] == 2),
        'cases': len(c), 'case_days': len(case_days),
        'top_labels': [{'label': l, 'count': n} for l, n in Counter(x['label'] for x in c).most_common(5)],
    }
    out = {
        'schema_version': 1,
        'h3': HEX, 'label': LABEL, 'hood': hood, 'lat': round(lat, 6), 'lng': round(lng, 6),
        'boundary': boundary,
        'window': {'start': WINDOW_START[:10], 'end': '2026-06-08'},
        'pulled_at': datetime.now(timezone.utc).strftime('%Y-%m-%d'),
        'note': ('Staff visits grouped by San Francisco calendar day; lv = worst rating that day '
                 '(0 nothing wrong, 1 something rated 1, 2 something rated >= 2), Active Drug Use '
                 'excluded as everywhere in the deck. 311 = comparable service_names filed inside '
                 'the hex polygon, admin-churn details excluded (same rules as sf311.py).'),
        'visits': v,
        'cases': c,
        'summary': summary,
        'query_url': query_url,
    }
    OUT.write_text(json.dumps(out, indent=1) + '\n')
    print(f"Wrote {OUT.relative_to(BUILD.parent.parent)} ({OUT.stat().st_size:,} bytes)")
    print(f"  {LABEL} ({hood}): {photos} photos on {len(v)} days by {observers} observers — "
          f"{summary['clean_days']} clean / {summary['issue_days']} issue / {summary['severe_days']} severe days; "
          f"311: {len(c)} cases on {len(case_days)} days")


if __name__ == '__main__':
    main()
