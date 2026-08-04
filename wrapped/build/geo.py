#!/usr/bin/env python3
"""Shared geo helper — assign a lat/lng to one of SF's 41 Analysis Neighborhoods.

The streetconditions export's `matched_district` field is unusable (100% "BAYVIEW",
verified wrong), so we assign neighborhoods ourselves by point-in-polygon against the
canonical `neighborhoods.geojson` (name in property `nhood`). Pure stdlib, no shapely.
"""
import json
from pathlib import Path

# SF bounding box — anything outside is a bad/garbage coordinate (one export row is
# literally in China). Used to scrub before the (more expensive) polygon test.
SF_BBOX = (37.70, 37.84, -122.52, -122.35)   # (lat_min, lat_max, lng_min, lng_max)
# The app's "location unknown" fallback — a cluster of rows sit on the exact SF centroid.
DEFAULT_CENTROID = (37.7749, -122.4194)


def in_sf_bbox(lat, lng):
    a, b, c, d = SF_BBOX
    return a <= lat <= b and c <= lng <= d


def is_default_centroid(lat, lng):
    return lat == DEFAULT_CENTROID[0] and lng == DEFAULT_CENTROID[1]


def _in_ring(x, y, ring):
    """Even-odd ray cast. ring = list of [lng, lat]."""
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside


def _in_poly(x, y, poly):
    """poly = [outer_ring, hole1, ...]."""
    if not _in_ring(x, y, poly[0]):
        return False
    return not any(_in_ring(x, y, h) for h in poly[1:])


def load_neighborhoods(geojson_path):
    """Return a list of (name, polygons, bbox) for fast assignment."""
    gj = json.loads(Path(geojson_path).read_text())
    hoods = []
    for feat in gj['features']:
        name = feat['properties'].get('nhood') or feat['properties'].get('name')
        g = feat['geometry']
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        xs = [p[0] for poly in polys for ring in poly for p in ring]
        ys = [p[1] for poly in polys for ring in poly for p in ring]
        hoods.append((name, polys, (min(xs), min(ys), max(xs), max(ys))))
    return hoods


def assign(lat, lng, hoods):
    """Return the nhood name containing (lat, lng), or None."""
    x, y = lng, lat
    for name, polys, (minx, miny, maxx, maxy) in hoods:
        if x < minx or x > maxx or y < miny or y > maxy:
            continue
        if any(_in_poly(x, y, poly) for poly in polys):
            return name
    return None


def canonical_names(geojson_path):
    gj = json.loads(Path(geojson_path).read_text())
    return sorted(f['properties']['nhood'] for f in gj['features'])
