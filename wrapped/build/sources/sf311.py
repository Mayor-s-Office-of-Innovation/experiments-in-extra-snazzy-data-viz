#!/usr/bin/env python3
"""SF311 source pull — the Crowd lens (window-clamped to the SC coverage window).

Adapted from ../sf-neighborhood-concerns cleanliness/build/sources/sf311.py. Two
changes for Streets Wrapped:
  1. Window is LOCKED to the streetconditions coverage window (2026-01-30 .. 2026-06-08),
     not a rolling 6 months, so both lenses cover the same days.
  2. Whitelist broadened from cleanliness-only to the full set of service_names that
     have a plausible crosswalk to an SC category (evidence-based from the in-window
     service_name landscape). Aggregated at (nbhd, service_name, service_subtype) grain
     — service_subtype is what the crosswalk maps to SC categories.

Native `analysis_neighborhood` column = the free join key (same 41 hoods as SC). Every
cell keeps a live Socrata `query_url` (repo provenance discipline). Writes
wrapped/data/sf311.json.

Run:  python3 wrapped/build/sources/sf311.py
"""
import json
import subprocess
import urllib.parse
from collections import defaultdict
from pathlib import Path

DOMAIN = 'data.sfgov.org'
DATASET = 'vw6y-z8j6'
ENDPOINT = f'https://{DOMAIN}/resource/{DATASET}.json'
LIMIT = 50000

WINDOW_START = '2026-01-30T00:00:00'
WINDOW_END = '2026-06-09T00:00:00'   # exclusive — includes through 2026-06-08

# SC-comparable service_names (evidence-based from the in-window landscape). Pure
# noise (Parking Enforcement meters, Muni, Trees, Sewer, Noise, Streetlights) excluded —
# none map to a street-condition SC category. RV/inhabited-vehicle has no clean 311
# equivalent and is left to the crosswalk's "unmapped" bucket (see plan.md).
SERVICE_NAME_WHITELIST = (
    'Street and Sidewalk Cleaning',   # waste, small debris, furniture, human/animal waste, sharps
    'Graffiti Public', 'Graffiti Private',
    'Encampment',                      # -> Unsheltered Presence
    'Blocked Street and Sidewalk', 'Sidewalk and Curb',   # -> Access Obstruction
    'Litter Receptacle Maintenance',   # city cans -> Waste
    'Illegal Postings',                # blight
)

NBHD_ALIAS_MAP = {'Financial District/South Beach': 'Financial District'}

# Non-complaint / admin-churn service_details — carried from the source repo. These
# are internal tasks / seasonal-transient / can-maintenance, NOT resident condition
# reports. Excluded at aggregation so the Crowd lens is complaints, not ops tickets.
DETAILS_BLACKLIST = {
    'bag_and_tag',              # DPW encampment-belongings storage task
    'christmas_tree',           # seasonal (82% Jan)
    'missed_trashrecyclecompost_collection',
    'missed_route_mechanical_sweeping',
}

BUILD = Path(__file__).resolve().parents[1]
DATA = BUILD.parent / 'data'
OUT = DATA / 'sf311.json'


def _lit(s):
    return "'" + s.replace("'", "''") + "'"


def base_where():
    wl = ", ".join(_lit(x) for x in SERVICE_NAME_WHITELIST)
    return (f"requested_datetime >= '{WINDOW_START}' AND requested_datetime < '{WINDOW_END}' "
            f"AND analysis_neighborhood IS NOT NULL AND service_name IN ({wl})")


def coalesce_label(sst, sd):
    """Crosswalk/display grain: prefer service_details, fall back to service_subtype."""
    return (sd or '').strip() or (sst or '').strip()


def fetch():
    where = base_where()
    params = {
        '$select': 'analysis_neighborhood, service_name, service_subtype, service_details, count(*) AS n',
        '$where': where,
        '$group': 'analysis_neighborhood, service_name, service_subtype, service_details',
        '$order': 'n DESC',
        '$limit': str(LIMIT),
    }
    url = f"{ENDPOINT}?{urllib.parse.urlencode(params)}"
    print(f"Fetching aggregated 311 (window {WINDOW_START[:10]}..{WINDOW_END[:10]})...")
    out = subprocess.run(['curl', '-fsSL', '--max-time', '60', '-H', 'Accept: application/json', url],
                         capture_output=True, check=True)
    rows = json.loads(out.stdout)
    print(f"  {len(rows):,} aggregated rows")
    if len(rows) == LIMIT:
        print("  WARN: hit $limit — pagination needed")
    return rows


def hood_url(nbhd):
    """Live Socrata link for ALL comparable 311 in a neighborhood (hood-level provenance)."""
    where = f"{base_where()} AND analysis_neighborhood = {_lit(nbhd)}"
    params = {'$where': where, '$order': 'requested_datetime DESC', '$limit': '1000'}
    return f"{ENDPOINT}?{urllib.parse.urlencode(params)}"


def cell_url(nbhd, sn, sst, sd):
    """Live Socrata link reproducing exactly this cell's records."""
    where = (f"{base_where()} AND analysis_neighborhood = {_lit(nbhd)} "
             f"AND service_name = {_lit(sn)}")
    if sst:
        where += f" AND service_subtype = {_lit(sst)}"
    if sd:
        where += f" AND service_details = {_lit(sd)}"
    params = {'$where': where, '$order': 'requested_datetime DESC', '$limit': '1000'}
    return f"{ENDPOINT}?{urllib.parse.urlencode(params)}"


def main():
    rows = fetch()
    neighborhoods = defaultdict(lambda: {'total': 0, 'cells': []})
    citywide = defaultdict(int)   # (service_name, label) -> count
    dropped = defaultdict(int)
    blacklisted = 0
    for r in rows:
        raw_nbhd = (r.get('analysis_neighborhood') or '').strip()
        nbhd = NBHD_ALIAS_MAP.get(raw_nbhd, raw_nbhd)
        sn = (r.get('service_name') or '').strip()
        sst = (r.get('service_subtype') or '').strip()
        sd = (r.get('service_details') or '').strip()
        n = int(r.get('n', 0))
        if sd in DETAILS_BLACKLIST:
            blacklisted += n
            continue
        if not nbhd:
            dropped['no_nbhd'] += n
            continue
        label = coalesce_label(sst, sd)
        neighborhoods[nbhd]['total'] += n
        neighborhoods[nbhd]['cells'].append({
            'service_name': sn, 'service_subtype': sst, 'service_details': sd,
            'label': label, 'count': n, 'query_url': cell_url(nbhd, sn, sst, sd),
        })
        citywide[(sn, label)] += n
    print(f"  Excluded {blacklisted:,} admin-churn events ({', '.join(sorted(DETAILS_BLACKLIST))})")

    # sort cells within each hood by count + attach a hood-level provenance link
    for name, h in neighborhoods.items():
        h['cells'].sort(key=lambda c: -c['count'])
        h['query_url'] = hood_url(name)

    citywide_list = [{'service_name': sn, 'label': label, 'count': c}
                     for (sn, label), c in sorted(citywide.items(), key=lambda kv: -kv[1])]

    out = {
        'schema_version': 1,
        'source': 'sf311',
        'lens': 'crowd',
        'window': {'start': WINDOW_START[:10], 'end': '2026-06-08'},
        'config': {
            'dataset': f'{DOMAIN}/{DATASET}',
            'service_name_whitelist': list(SERVICE_NAME_WHITELIST),
            'grain': '(analysis_neighborhood, service_name, service_subtype)',
            'note': 'The Crowd lens: public 311 reports. A complaint signal, biased by who '
                    'reports and what is reportable. Not ground truth.',
        },
        'citywide': {
            'total': sum(citywide.values()),
            'by_label': citywide_list,
        },
        'neighborhoods': dict(neighborhoods),
    }
    OUT.write_text(json.dumps(out, indent=2) + '\n')
    print(f"Wrote {OUT.relative_to(BUILD.parent.parent)} ({OUT.stat().st_size:,} bytes)")
    print(f"  {len(neighborhoods)} hoods · citywide total {out['citywide']['total']:,}")
    print("  Top 8 labels citywide:")
    for c in citywide_list[:8]:
        print(f"    {c['count']:>7,}  {c['service_name']} / {c['label'] or '(none)'}")


if __name__ == '__main__':
    main()
