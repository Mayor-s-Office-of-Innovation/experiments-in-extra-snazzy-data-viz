// Seam #1 — data access. Cards NEVER fetch or reach into the raw JSON; they call these
// selectors. That keeps "what data we present" changeable here, and lets us swap the
// backing store (one big file now → per-hood chunks / templated query_urls later — the
// 3.3 MB payload task) without touching a single card.

let _d = null;

export async function load(url = '../data/conditions.json') {
  if (_d) return _d;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`conditions.json ${res.status}`);
  _d = await res.json();
  return _d;
}

const db = () => {
  if (!_d) throw new Error('data.load() must be awaited before selectors are used');
  return _d;
};

// Map artifact (projected hoods + the projected hex grid for the SVG hexbin engine). Kept
// separate from conditions.json so the heavy geometry loads only when a map-bearing card needs it.
let _map = null;
export async function loadMap(url = '../data/sf_map.json') {
  if (_map) return _map;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`sf_map.json ${res.status}`);
  _map = await res.json();
  return _map;
}
// Median household income by neighborhood (ACS 2022 → analysis neighborhoods; see build/sources/income.py)
let _income = null;
export async function loadIncome(url = '../data/income.json') {
  if (_income) return _income;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`income.json ${res.status}`);
  _income = await res.json();
  return _income;
}
export const income = (name) => _income?.neighborhoods?.[name]?.median_income ?? null;

export const mapHexes = () => _map?.hexes || [];
export const mapHoods = () => _map?.hoods || {};
export const mapOutlines = () => _map?.outlines || [];   // lng/lat rings for the WebGL PathLayer
export const mapMeta = () => (_map ? { w: _map.width, h: _map.height, hexR: _map.hex_r } : null);

// ---- selectors ----
export const window_ = () => db().window;
export const thesis = () => db().thesis;

export const citywide = () => ({
  camera: db().citywide.camera_algorithm,   // {obs, mean_score, status_dist, category_totals, night_share, ...}
  crowd: db().citywide.crowd,                // {total, by_label}
});

export const coverage = () => db().coverage_alignment;
export const crosswalk = () => db().crosswalk;
export const hexes = () => db().hexes;
export const tenderloinExhibit = () => db().tenderloin_exhibit;

export const hood = (name) => db().neighborhoods[name] || null;
export const hoods = () => db().neighborhoods;

export const byTier = (t) =>
  Object.entries(db().neighborhoods)
    .filter(([, v]) => v.tier === t)
    .map(([name]) => name);

// Divergence: share-of-citywide comparison (both sum to 100%, so unit-free).
// complaintShare = % of all comparable 311; severeShare = % of all Sweep-severe obs.
export const divergence = (name) => {
  const N = db().neighborhoods;
  let totSev = 0, tot311 = 0;
  for (const v of Object.values(N)) {
    totSev += v.camera_algorithm?.obs_with_severe || 0;
    tot311 += v.crowd?.total || 0;
  }
  const v = N[name];
  const sev = v?.camera_algorithm?.obs_with_severe || 0;
  const comp = v?.crowd?.total || 0;
  return {
    hood: name,
    complaints: comp,
    complaintShare: tot311 ? 100 * comp / tot311 : 0,
    severeShare: totSev ? 100 * sev / totSev : 0,
    queryUrl: v?.crowd?.query_url || v?.crowd?.cells?.[0]?.query_url || null,
  };
};

// Convenience for headline copy on overview cards.
export const headline = () => {
  const c = citywide();
  return {
    scPhotos: c.camera.obs,
    reports311: c.crowd.total,
    meanScore: c.camera.mean_score,
    excellentShare: Math.round(100 * (c.camera.status_dist.Excellent || 0) / c.camera.obs),
    observers: c.camera.distinct_observers,
    windowStart: window_().start,
    windowEnd: window_().end,
  };
};
