#!/usr/bin/env python3
"""Per-story data slice for the v2 deck (wrapped/app2/): conditions.json minus everything the
v2 cards never read. The full bake stays the v1 payload; this trims 3.3 MB → ~0.35 MB.

Dropped: provenance query_urls + per-category cells (v2 carries provenance via app2/sources.md),
the crosswalk, coverage alignment, the Tenderloin exhibit, per-hood tiers/categories, and the
citywide 311 label breakdown. Kept: window, citywide totals, per-hood obs/signal/severe + 311
totals, hexes, and the one-block exhibit (block_exhibit).

Run:  python3 wrapped/build/slice_v2.py   (after aggregate.py)
"""
import json
from pathlib import Path

BUILD = Path(__file__).resolve().parent
DATA = BUILD.parent / 'data'
SRC = DATA / 'conditions.json'
OUT = DATA / 'v2' / 'conditions.json'


def main():
    d = json.loads(SRC.read_text())
    hoods = {}
    for name, v in d['neighborhoods'].items():
        cam = v.get('camera_algorithm')
        if cam:
            cam = {k: x for k, x in cam.items() if k not in ('tier', 'categories')}
        crowd = v.get('crowd')
        if crowd:
            crowd = {'total': crowd.get('total', 0)}
        hoods[name] = {'tier': v.get('tier'), 'camera_algorithm': cam, 'crowd': crowd}
    citywide = dict(d['citywide'])
    citywide['crowd'] = {'total': d['citywide']['crowd']['total']}
    out = {
        'schema_version': d['schema_version'],
        'window': d['window'],
        'citywide': citywide,
        'hexes': d['hexes'],
        'block_exhibit': d.get('block_exhibit'),
        'neighborhoods': hoods,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out) + '\n')
    print(f"Wrote {OUT.relative_to(BUILD.parent.parent)} ({OUT.stat().st_size:,} bytes; full bake {SRC.stat().st_size:,})")


if __name__ == '__main__':
    main()
