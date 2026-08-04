#!/usr/bin/env python3
"""Aggregate both lenses into conditions.json — the superset the front-end selects from.

Merges wrapped/data/sc.json (Camera + Algorithm) and wrapped/data/sf311.json (Crowd)
onto the shared 41-hood key, aligning them per neighborhood over the same locked window.
Does NOT do the crosswalk (Phase 4) — that mapping (SC category -> 311 details) is added
later as `crosswalk` and is what makes head-to-head comparison valid.

This is the analytical superset (full detail). Front-end payload trimming/splitting is a
Phase 2 concern (plan.md seam #1) — cards select from this; we can slim/chunk it then.

Run:  python3 wrapped/build/aggregate.py   (after the two source scripts)
"""
import json
from pathlib import Path

sys_path = Path(__file__).resolve().parents[0]
import sys
sys.path.insert(0, str(sys_path))
import geo  # noqa: E402

BUILD = Path(__file__).resolve().parent
DATA = BUILD.parent / 'data'
SC = DATA / 'sc.json'
SF311 = DATA / 'sf311.json'
CROSSWALK = DATA / 'crosswalk.json'
GEOJSON = DATA / 'neighborhoods.geojson'
OUT = DATA / 'conditions.json'


def main():
    sc = json.loads(SC.read_text())
    sf = json.loads(SF311.read_text())
    canonical = geo.canonical_names(GEOJSON)   # all 41
    N = len(canonical)

    sc_hoods = sc['neighborhoods']
    sf_hoods = sf['neighborhoods']

    neighborhoods = {}
    both = camera_only = crowd_only = neither = 0
    for name in canonical:
        c = sc_hoods.get(name)
        w = sf_hoods.get(name)
        if c and w:
            both += 1
        elif c:
            camera_only += 1
        elif w:
            crowd_only += 1
        else:
            neither += 1
        neighborhoods[name] = {
            # tier is defined by the Camera+Algorithm lens (obs/severe); default 3 (suppress)
            # if the camera never visited.
            'tier': c['tier'] if c else 3,
            'camera_algorithm': c,   # obs, signal, severe, mean_score, categories, dominant_observer
            'crowd': w,              # total, cells[{service_name, label, count, query_url}]
        }

    out = {
        'schema_version': 1,
        'generated_at': sc['generated_at'] if 'generated_at' in sc else None,
        'window': sc['window'],
        'thesis': 'Camera / Algorithm / Crowd — three imperfect instruments on the same streets.',
        'lenses': {
            'camera_algorithm': {
                'source': 'streetconditions',
                'what': 'AI vision model scoring city-staff photos. NOT human judgment, NOT public.',
                'config': sc['config'],
            },
            'crowd': {
                'source': 'sf311',
                'what': 'Public 311 reports. A complaint signal, biased by who reports what.',
                'config': sf['config'],
            },
        },
        # SC category -> 311 (service_name, label) mapping + coverage. Comparison-gating.
        'crosswalk': json.loads(CROSSWALK.read_text()) if CROSSWALK.exists() else None,
        'citywide': {
            'camera_algorithm': sc['citywide'],
            'crowd': sf['citywide'],
        },
        'coverage_alignment': {
            'canonical_neighborhoods': N,
            'both_lenses': both, 'camera_only': camera_only,
            'crowd_only': crowd_only, 'neither': neither,
        },
        'hexes': sc['hexes'],                        # hero Camera map (color by n_severe, size by n)
        'tenderloin_exhibit': sc['tenderloin_exhibit'],
        'neighborhoods': neighborhoods,
    }
    OUT.write_text(json.dumps(out) + '\n')   # compact (no indent) — this is a data artifact
    size = OUT.stat().st_size
    print(f"Wrote {OUT.relative_to(BUILD.parent.parent)} ({size:,} bytes / {size/1e6:.1f} MB)")
    print(f"  Coverage: {both} hoods both lenses, {camera_only} camera-only, "
          f"{crowd_only} crowd-only, {neither} neither (of {N})")
    # tier summary
    tiers = {1: [], 2: [], 3: []}
    for name, v in neighborhoods.items():
        tiers[v['tier']].append(name)
    for t in (1, 2, 3):
        print(f"  Tier {t}: {len(tiers[t])} hoods" + (f" — {', '.join(sorted(tiers[t]))}" if t == 1 else ""))


if __name__ == '__main__':
    main()
