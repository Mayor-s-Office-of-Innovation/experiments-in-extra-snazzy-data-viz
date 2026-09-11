#!/usr/bin/env python3
"""Street centerlines — the basemap under the v2 "streets are clean" slide (Insight 3).

Downloads DataSF's San Francisco Basemap Street Centerlines (dataset 3psu-pn9h) as GeoJSON
into wrapped/data/raw/streets.geojson (~16 MB, git-ignored — a build input, never served).
make_map.py projects + simplifies it into wrapped/data/sf_streets.json (committed, ~lean),
so this step is OPTIONAL at rebuild time: skip it and make_map.py reuses the committed output.

Run:  python3 wrapped/build/sources/streets.py
"""
import subprocess
from pathlib import Path

DOMAIN = 'data.sf.gov'
DATASET = '3psu-pn9h'
URL = f'https://{DOMAIN}/resource/{DATASET}.geojson?$limit=60000'   # dataset is ~17k segments

BUILD = Path(__file__).resolve().parents[1]
RAW = BUILD.parent / 'data' / 'raw' / 'streets.geojson'


def main():
    RAW.parent.mkdir(parents=True, exist_ok=True)
    print(f"Fetching street centerlines ({DOMAIN}/{DATASET})...")
    subprocess.run(['curl', '-fsSL', '--max-time', '180', '-o', str(RAW), URL], check=True)
    print(f"Wrote {RAW.relative_to(BUILD.parent.parent)} ({RAW.stat().st_size:,} bytes)")


if __name__ == '__main__':
    main()
