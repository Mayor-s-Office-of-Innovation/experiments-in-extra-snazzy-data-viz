#!/usr/bin/env python3
"""Median household income by SF Analysis Neighborhood, for the Equity card.

Source: Census ACS 2022 5-year — B19013_001E (median household income) and B01003_001E
(population) by census tract for San Francisco County (06075). Tracts are assigned to the 41
Analysis Neighborhoods by centroid point-in-polygon (Gazetteer 2022 centroids) into
neighborhoods.geojson, then each neighborhood's income = the POPULATION-WEIGHTED MEAN of its
tract medians (a sound approximation — a true neighborhood median isn't derivable from tract
medians). Emits data/income.json (committed, so the app + rebuilds need no API key).

Run:  CENSUS_API_KEY=... python3 wrapped/build/sources/income.py
The key is read from the environment and never written to disk.
"""
import csv, io, json, os, subprocess
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent.parent / 'data'
GEOJSON = DATA / 'neighborhoods.geojson'
OUT = DATA / 'income.json'
ACS = ('https://api.census.gov/data/2022/acs/acs5?get=NAME,B19013_001E,B01003_001E'
       '&for=tract:*&in=state:06+county:075&key={key}')
GAZ = 'https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2022_Gazetteer/2022_gaz_tracts_06.txt'


def fetch(url):
    # curl, not urllib — this environment lacks a Python-visible CA bundle for SSL verification
    return subprocess.run(['curl', '-sL', '--max-time', '60', url],
                          capture_output=True, check=True).stdout


def pip(x, y, ring):
    inside = False; n = len(ring); j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]; xj, yj = ring[j][0], ring[j][1]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi):
            inside = not inside
        j = i
    return inside


def main():
    key = os.environ.get('CENSUS_API_KEY')
    if not key:
        raise SystemExit('Set CENSUS_API_KEY (Census ACS API key) in the environment. '
                         'income.json is committed, so this is only needed to regenerate it.')

    acs = json.loads(fetch(ACS.format(key=key)))
    h = acs[0]; iI, iP, iT = h.index('B19013_001E'), h.index('B01003_001E'), h.index('tract')
    tracts = {}
    for r in acs[1:]:
        inc = int(r[iI]) if r[iI] not in (None, '') else None
        if inc is not None and inc < 0:
            inc = None            # -666666666 = ACS "missing"
        tracts['06075' + r[iT]] = {'inc': inc, 'pop': int(r[iP] or 0)}

    cent = {}
    rd = csv.reader(io.StringIO(fetch(GAZ).decode('latin-1')), delimiter='\t')
    hd = [c.strip() for c in next(rd)]
    gi, la, lo = hd.index('GEOID'), hd.index('INTPTLAT'), hd.index('INTPTLONG')
    for row in rd:
        if row and row[gi].strip().startswith('06075'):
            cent[row[gi].strip()] = (float(row[lo].strip()), float(row[la].strip()))

    gj = json.loads(GEOJSON.read_text())
    hoods = [(f['properties']['nhood'],
              [f['geometry']['coordinates']] if f['geometry']['type'] == 'Polygon' else f['geometry']['coordinates'])
             for f in gj['features']]

    def assign(lng, lat):
        for name, polys in hoods:
            for poly in polys:
                if poly and pip(lng, lat, poly[0]):
                    return name
        return None

    agg = {}
    for g, (lng, lat) in cent.items():
        t = tracts.get(g)
        if not t or t['inc'] is None or t['pop'] <= 0:
            continue
        name = assign(lng, lat)
        if not name:
            continue
        a = agg.setdefault(name, {'wsum': 0.0, 'pop': 0, 'n': 0})
        a['wsum'] += t['inc'] * t['pop']; a['pop'] += t['pop']; a['n'] += 1

    neighborhoods = {name: {'median_income': round(a['wsum'] / a['pop']),
                            'population': a['pop'], 'n_tracts': a['n']}
                     for name, a in agg.items() if a['pop'] > 0}

    out = {
        'source': 'US Census ACS 2022 5-year (B19013 median household income · B01003 population) '
                  'by tract → SF Analysis Neighborhoods, population-weighted mean of tract medians; '
                  'tracts assigned by centroid point-in-polygon.',
        'acs_year': 2022,
        'neighborhoods': neighborhoods,
    }
    OUT.write_text(json.dumps(out, indent=0) + '\n')
    print(f'Wrote {OUT.relative_to(DATA.parent.parent)} — {len(neighborhoods)} neighborhoods with income')


if __name__ == '__main__':
    main()
