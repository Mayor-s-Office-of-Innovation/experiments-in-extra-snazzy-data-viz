#!/usr/bin/env python3
"""geojson -> lightweight SVG paths for the tilted ground plane.

The raw neighborhoods.geojson is 1.4 MB — far too heavy to inline behind every card.
This projects it to a flat SVG viewBox, simplifies each ring (Douglas-Peucker), and emits
wrapped/data/sf_map.json = { viewBox, hoods: {name: {d, cx, cy}} } where d is an SVG path
and (cx,cy) is the projected centroid the map camera centers on for that hood.

Run: python3 wrapped/build/make_map.py
"""
import json
import math
from pathlib import Path

BUILD = Path(__file__).resolve().parent
DATA = BUILD.parent / 'data'
GEOJSON = DATA / 'neighborhoods.geojson'
CONDITIONS = DATA / 'conditions.json'
OUT = DATA / 'sf_map.json'

VIEW_W = 1000.0        # viewBox width; height derived from aspect
EPSILON = 0.35         # DP simplify tolerance in projected units (higher = fewer points)


def dp(pts, eps):
    """Douglas-Peucker on a list of (x,y). Keeps endpoints."""
    if len(pts) < 3:
        return pts
    ax, ay = pts[0]
    bx, by = pts[-1]
    dx, dy = bx - ax, by - ay
    dlen = math.hypot(dx, dy) or 1e-9
    idx, dmax = 0, 0.0
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        # perpendicular distance to segment a-b
        dist = abs((px - ax) * dy - (py - ay) * dx) / dlen
        if dist > dmax:
            idx, dmax = i, dist
    if dmax > eps:
        left = dp(pts[:idx + 1], eps)
        right = dp(pts[idx:], eps)
        return left[:-1] + right
    return [pts[0], pts[-1]]


def simplify_ring(ring, eps):
    """DP on a CLOSED ring. Splitting at the farthest-from-start point avoids the
    zero-length-anchor degeneracy you get running DP on a loop (start == end)."""
    pts = ring[:-1] if ring and ring[0] == ring[-1] else list(ring)
    if len(pts) < 4:
        return pts
    far = max(range(len(pts)), key=lambda i: (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2)
    chain1 = pts[:far + 1]
    chain2 = pts[far:] + [pts[0]]
    s1 = dp(chain1, eps)
    s2 = dp(chain2, eps)
    return s1[:-1] + s2[:-1]   # recombine; SVG 'Z' re-closes the path


def main():
    gj = json.loads(GEOJSON.read_text())

    # bounds across all coordinates
    xs, ys = [], []
    for f in gj['features']:
        g = f['geometry']
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        for poly in polys:
            for ring in poly:
                for lng, lat in ring:
                    xs.append(lng); ys.append(lat)
    lng0, lng1 = min(xs), max(xs)
    lat0, lat1 = min(ys), max(ys)
    midlat = math.radians((lat0 + lat1) / 2)
    kx = math.cos(midlat)                      # lng compression at this latitude
    span_x = (lng1 - lng0) * kx
    span_y = (lat1 - lat0)
    scale = VIEW_W / span_x
    view_h = round(span_y * scale, 1)

    def project(lng, lat):
        x = (lng - lng0) * kx * scale
        y = (lat1 - lat) * scale               # flip: north up
        return (round(x, 1), round(y, 1))

    # inverse of project() — the projection is linear, so simplified projected rings invert back to
    # lng/lat exactly. Lets the WebGL engine draw real geographic hood outlines (deck PathLayer)
    # without shipping the 1.4 MB geojson.
    def unproject(x, y):
        return [round(lng0 + x / (kx * scale), 5), round(lat1 - y / scale, 5)]

    hoods = {}
    outlines = []          # [[ [lng,lat], ... ], ...] simplified rings for deck.gl PathLayer
    total_pts_in = total_pts_out = 0
    for f in gj['features']:
        name = f['properties']['nhood']
        g = f['geometry']
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        subpaths = []
        cxs = cys = area2 = 0.0
        for poly in polys:
            for ri, ring in enumerate(poly):
                proj = [project(lng, lat) for lng, lat in ring]
                total_pts_in += len(proj)
                simp = simplify_ring(proj, EPSILON)
                total_pts_out += len(simp)
                if len(simp) < 3:
                    continue
                d = 'M' + ' L'.join(f'{x},{y}' for x, y in simp) + 'Z'
                subpaths.append(d)
                ring_ll = [unproject(x, y) for x, y in simp]
                ring_ll.append(ring_ll[0])          # close the ring for PathLayer
                outlines.append(ring_ll)
                # shoelace centroid contribution (outer rings only). simp is an OPEN ring,
                # so wrap the last->first edge or the sum omits it (breaks small hoods).
                if ri == 0:
                    m = len(simp)
                    for i in range(m):
                        x0, y0 = simp[i]; x1, y1 = simp[(i + 1) % m]
                        cross = x0 * y1 - x1 * y0
                        area2 += cross
                        cxs += (x0 + x1) * cross
                        cys += (y0 + y1) * cross
        if area2 != 0:
            cx = round(cxs / (3 * area2), 1)
            cy = round(cys / (3 * area2), 1)
        else:
            cx = cy = 0.0
        # centroid in lng/lat too (deck.gl focuses/places the sergeant light by geo-coords)
        cll = unproject(cx, cy) if area2 != 0 else [lng0, lat1]
        hoods[name] = {'d': ' '.join(subpaths), 'cx': cx, 'cy': cy, 'cll': cll}

    # Hexes: project the H3 severe-density grid into the SAME viewBox so the SVG hexbin
    # engine never has to know the projection (WebGL engine keeps raw lat/lng instead).
    # Only the fields the renderer needs — keep sf_map.json lean.
    hexes = []
    hex_r = 0.0
    if CONDITIONS.exists():
        raw = json.loads(CONDITIONS.read_text()).get('hexes', [])
        for h in raw:
            x, y = project(h['lng'], h['lat'])
            hexes.append({
                'h3': h['h3'], 'x': x, 'y': y,
                'n_severe': h.get('n_severe', 0),
                'top_uid_severe': h.get('top_uid_severe', 0),
            })
        # Flat-top hexagon radius (center→vertex) so cells tessellate: for a hex grid the
        # centroid spacing of adjacent cells = r·√3, so r = median-nearest-neighbour / √3.
        pts = sorted((hx['x'], hx['y']) for hx in hexes)
        nn = []
        for i, (x0, y0) in enumerate(pts):          # x-sorted sweep; stop once dx alone exceeds best
            best = math.inf
            for x1, y1 in pts[i + 1:]:
                if (x1 - x0) >= best:
                    break
                d = math.hypot(x1 - x0, y1 - y0)
                if d < best:
                    best = d
            if best < math.inf:
                nn.append(best)
        nn.sort()
        if nn:
            hex_r = round(nn[len(nn) // 2] / math.sqrt(3), 2)

    out = {
        'viewBox': f'0 0 {VIEW_W:.0f} {view_h:.0f}',
        'width': VIEW_W, 'height': view_h,
        'hoods': hoods,
        'outlines': outlines,
        'hexes': hexes,
        'hex_r': hex_r,
    }
    OUT.write_text(json.dumps(out) + '\n')
    print(f"Wrote {OUT.relative_to(BUILD.parent.parent)} ({OUT.stat().st_size:,} bytes)")
    print(f"  {len(hoods)} hoods · {len(hexes)} hexes (r={hex_r}) · viewBox {out['viewBox']} · "
          f"points {total_pts_in:,} → {total_pts_out:,} ({100*total_pts_out/total_pts_in:.0f}%)")


if __name__ == '__main__':
    main()
