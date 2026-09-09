// Hexbin engine B — real extruded 3D via deck.gl H3HexagonLayer, LAZY-loaded.
// deck.gl (~150KB) + h3-js are imported only when this engine is selected. res-10 cells (~65m) are
// ~2px citywide, so we aggregate res-10 → res-9 (summing severe counts) for visible whole-city
// columns. Height + color both encode severe density (shared scale with the SVG engine).
//
// Passive story hero: rotate+tilt+zoom entrance → gentle idle drift, driven by one programmatic
// loop (no controller / onViewStateChange, so it can't be interrupted). Taps advance the card.
//
// Interface: mount(container, opts) -> { setObserver, destroy }

import { colorRGBA, heightFrac } from './hexbin-scale.js';

// Coverage mode (v2): a clean SAND→GOLD ramp, light throughout. The previous dark-gold start
// (#5d4713) read "blighted" at the low end, and low columns are everywhere — so the whole ramp
// now lives in the light half: pale sand → warm gold. Mids stay separable via lighting + gamma.
const COVERAGE_RAMP = ['#a8874a', '#c2a054', '#d9b968', '#e9cf7f', '#f2df9a'];
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const COVERAGE_RGB = COVERAGE_RAMP.map(hex2rgb);
const coverageAt = (t) => {
  t = Math.max(0, Math.min(1, t));
  const seg = t * (COVERAGE_RGB.length - 1), i = Math.min(COVERAGE_RGB.length - 2, Math.floor(seg)), f = seg - i;
  const a = COVERAGE_RGB[i], b = COVERAGE_RGB[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, 235];
};
const COVERAGE_RGBA = (v, max) => (v <= 0 ? [56, 66, 74, 80] : coverageAt(Math.pow(v / max, 0.5)));

const CITY = { longitude: -122.4194, latitude: 37.7749 };
// Self-hosted ESM bundles (jsDelivr +esm builds, dependency graph vendored + rewritten to
// relative paths — see wrapped/app/vendor/). esm.sh rotted (408s, 2026-09-09) and took both
// decks' WebGL with it; local bundles make the hero offline-capable for the pitch room.
const CORE_URL = '../../vendor/deck.gl-core@9.4.0-+esm.mjs';
const GEO_URL = '../../vendor/deck.gl-geo-layers@9.4.0-+esm.mjs';
const LAYERS_URL = '../../vendor/deck.gl-layers@9.4.0-+esm.mjs';
const H3_URL = '../../vendor/h3-js@4.5.0-+esm.mjs';
const AGG_RES = 9;          // res-10 → res-9 (~175m cells): visible citywide, finer grain
const MAX_ELEV_M = 650;     // metres the tallest column rises
const ease = (t) => 1 - Math.pow(1 - t, 3);

// Warm the CDN module cache during idle so the hero card doesn't pay the ~150KB deck.gl + h3-js
// import cost on first view (the "slide 4 starts slow, but not after reload" delay). Same URLs the
// mount() dynamic-imports, so those resolve instantly once this has run.
export function preload() {
  return Promise.all([import(/* @vite-ignore */ CORE_URL), import(/* @vite-ignore */ GEO_URL), import(/* @vite-ignore */ LAYERS_URL), import(/* @vite-ignore */ H3_URL)]).catch(() => {});
}

export async function mount(container, { hexes, outlines = [], camera = {}, mode = 'severe', reducedMotion = false }) {
  let Deck, MapView, H3HexagonLayer, PathLayer, cellToParent, deck = null;
  try {
    // vendored subpackage bundles (see ../../vendor/): Deck/MapView live in core;
    // H3HexagonLayer in geo-layers; PathLayer in layers; cellToParent in h3-js
    ({ Deck, MapView } = await import(/* @vite-ignore */ CORE_URL));
    ({ H3HexagonLayer } = await import(/* @vite-ignore */ GEO_URL));
    ({ PathLayer } = await import(/* @vite-ignore */ LAYERS_URL));
    ({ cellToParent } = await import(/* @vite-ignore */ H3_URL));
  } catch (err) {
    const msg = document.createElement('p');
    msg.className = 'hexbin-fallback';
    msg.textContent = 'The 3D (WebGL) view failed to load. Switch to the SVG view.';
    container.append(msg);
    return { setObserver() {}, destroy() { msg.remove(); } };
  }

  // aggregate res-10 → res-9. Value keyed by mode: 'severe' (v1 hero — sum of severe flags)
  // or 'coverage' (v2 — visit counts, "where the camera looked", neutral color by design).
  const coverage = mode === 'coverage';
  const agg = new Map();
  for (const h of hexes) {
    const key = cellToParent(h.h3, AGG_RES);
    let a = agg.get(key);
    if (!a) agg.set(key, (a = { h3: key, n_severe: 0, n: 0 }));
    a.n_severe += h.n_severe || 0;
    a.n += h.n || 0;
  }
  const cells = [...agg.values()];
  const valueOf = (c) => (coverage ? c.n : c.n_severe);
  const max = Math.max(1, ...cells.map(valueOf));

  const canvas = document.createElement('canvas');
  canvas.className = 'hexbin-webgl';
  container.append(canvas);
  // a lost WebGL context (sleep/wake, GPU hiccup, long-lived tab) blanks the canvas forever —
  // surface it loudly instead of a silent dark slide.
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.warn('[hexbin-webgl] WebGL context lost — reload the page to restore the 3D view.');
    const note = document.createElement('p');
    note.className = 'hexbin-fallback';
    note.textContent = 'The 3D view lost its graphics context. Reload the page to restore it.';
    container.append(note);
  });

  const hexLayer = () => new H3HexagonLayer({
    id: coverage ? 'coverage-hexbin' : 'severe-hexbin', data: cells, getHexagon: (c) => c.h3,
    extruded: true, stroked: false, elevationScale: 1,
    getElevation: (c) => MAX_ELEV_M * heightFrac(valueOf(c), max),
    getFillColor: coverage
      ? (c) => COVERAGE_RGBA(valueOf(c), max)
      : (c) => colorRGBA(c.n_severe, max),
    material: { ambient: 0.8, diffuse: 0.6, shininess: 0, specularColor: [0, 0, 0] },   // no specular → no white blow-out; brighter ambient lifts the mids
  });
  const outlineLayer = () => new PathLayer({
    id: 'hood-outlines', data: outlines, getPath: (d) => d,
    getColor: [235, 240, 245, 70], widthUnits: 'pixels', getWidth: 1.3, widthMinPixels: 1,
    jointRounded: true, capRounded: true,
  });

  // camera — bottom padding lifts the focal centre up so downtown/the spike clears the panel
  const padBottom = Math.round((container.clientHeight || 800) * 0.42);
  const target = {
    ...CITY, zoom: 12.65,
    pitch: Math.min(58, camera.tilt || 55),
    bearing: -(camera.rotate || 0),
    padding: { top: 0, right: 0, bottom: padBottom, left: 0 },
  };
  const from = { ...target, zoom: target.zoom - 1.15, pitch: Math.max(0, target.pitch - 26), bearing: target.bearing - 26 };
  let viewState = reducedMotion ? { ...target } : { ...from };
  let destroyed = false;

  deck = new Deck({
    canvas,
    views: new MapView({ repeat: false }),
    viewState,
    controller: false,                       // passive story hero — taps advance the card (tap-to-skip)
    parameters: { clearColor: [0, 0, 0, 0] },
    layers: [outlineLayer(), hexLayer()],
  });

  if (!reducedMotion) {
    const t0 = performance.now(), ENTRANCE = 1100;
    const loop = (now) => {
      if (destroyed) return;
      const dt = now - t0;
      if (dt < ENTRANCE) {
        const e = ease(dt / ENTRANCE);
        viewState = { ...target,
          zoom: from.zoom + (target.zoom - from.zoom) * e,
          pitch: from.pitch + (target.pitch - from.pitch) * e,
          bearing: from.bearing + (target.bearing - from.bearing) * e };
      } else {
        const t = (dt - ENTRANCE) / 1000;
        viewState = { ...target,
          bearing: target.bearing + Math.sin(t * 0.42) * 3.5,
          pitch: Math.max(0, Math.min(60, target.pitch + Math.sin(t * 0.3) * 1.6)) };
      }
      deck.setProps({ viewState });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  return {
    setObserver() {},
    destroy() { destroyed = true; try { deck.finalize(); } catch {} canvas.remove(); },
  };
}
