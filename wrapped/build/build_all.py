#!/usr/bin/env python3
"""Rebuild the whole data layer in order. Run: python3 wrapped/build/build_all.py

  sources/sc.py     -> data/sc.json         (Camera + Algorithm, local)
  sources/sf311.py  -> data/sf311.json      (Crowd, network pull)
  crosswalk.py      -> data/crosswalk.json  (SC category -> 311 mapping + coverage)
  aggregate.py      -> data/conditions.json (the superset the front-end selects from)
  make_map.py       -> data/sf_map.json (+ data/sf_streets.json when raw/streets.geojson exists)
  slice_v2.py       -> data/v2/conditions.json (the v2 deck's trimmed payload)
  compress.py       -> sibling .gz for every served text asset

Optional, outputs committed (run by hand when they need refreshing):
  sources/block.py   -> data/block.json      (one-block exhibit; needs `pip install h3` + network)
  sources/streets.py -> data/raw/streets.geojson (street centerlines; network, git-ignored)
  sources/income.py  -> data/income.json     (needs CENSUS_API_KEY)
"""
import subprocess
import sys
from pathlib import Path

BUILD = Path(__file__).resolve().parent
STEPS = ['sources/sc.py', 'sources/sf311.py', 'crosswalk.py', 'aggregate.py', 'make_map.py',
         'slice_v2.py', 'compress.py']

for step in STEPS:
    print(f"\n{'=' * 70}\n▶ {step}\n{'=' * 70}")
    r = subprocess.run([sys.executable, str(BUILD / step)])
    if r.returncode != 0:
        print(f"✗ {step} failed (exit {r.returncode})", file=sys.stderr)
        sys.exit(r.returncode)
print("\n✓ data layer rebuilt")
