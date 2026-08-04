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

const CITY = { longitude: -122.4194, latitude: 37.7749 };
const DECK_URL = 'https://esm.sh/deck.gl@9';
const H3_URL = 'https://esm.sh/h3-js@4';
const AGG_RES = 9;          // res-10 → res-9 (~175m cells): visible citywide, finer grain
const MAX_ELEV_M = 650;     // metres the tallest column rises
const ease = (t) => 1 - Math.pow(1 - t, 3);

// Warm the CDN module cache during idle so the hero card doesn't pay the ~150KB deck.gl + h3-js
// import cost on first view (the "slide 4 starts slow, but not after reload" delay). Same URLs the
// mount() dynamic-imports, so those resolve instantly once this has run.
export function preload() {
  return Promise.all([import(/* @vite-ignore */ DECK_URL), import(/* @vite-ignore */ H3_URL)]).catch(() => {});
}

export async function mount(container, { hexes, outlines = [], camera = {}, reducedMotion = false }) {
  let Deck, MapView, H3HexagonLayer, PathLayer, cellToParent, deck = null;
  try {
    ({ Deck, MapView, H3HexagonLayer, PathLayer } = await import(/* @vite-ignore */ DECK_URL));
    ({ cellToParent } = await import(/* @vite-ignore */ H3_URL));
  } catch (err) {
    const msg = document.createElement('p');
    msg.className = 'hexbin-fallback';
    msg.textContent = 'The 3D (WebGL) view needs a network connection to load deck.gl. Switch to the SVG view.';
    container.append(msg);
    return { setObserver() {}, destroy() { msg.remove(); } };
  }

  // aggregate res-10 → res-9, summing severe counts
  const agg = new Map();
  for (const h of hexes) {
    const key = cellToParent(h.h3, AGG_RES);
    let a = agg.get(key);
    if (!a) agg.set(key, (a = { h3: key, n_severe: 0 }));
    a.n_severe += h.n_severe || 0;
  }
  const cells = [...agg.values()];
  const max = Math.max(1, ...cells.map((c) => c.n_severe));

  const canvas = document.createElement('canvas');
  canvas.className = 'hexbin-webgl';
  container.append(canvas);

  const hexLayer = () => new H3HexagonLayer({
    id: 'severe-hexbin', data: cells, getHexagon: (c) => c.h3,
    extruded: true, stroked: false, elevationScale: 1,
    getElevation: (c) => MAX_ELEV_M * heightFrac(c.n_severe, max),
    getFillColor: (c) => colorRGBA(c.n_severe, max),
    material: { ambient: 0.72, diffuse: 0.5, shininess: 0, specularColor: [0, 0, 0] },   // no specular → no white blow-out
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
