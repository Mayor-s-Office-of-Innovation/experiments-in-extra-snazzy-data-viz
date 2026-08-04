// Seam #6 — the persistent tilted ground plane, isolated behind a component boundary.
// Lives BEHIND every card (shell-level), never per-card. The state machine drives its camera
// (rotate/tilt/zoom/pan-to-hood), representation (outline|filled|pins|dots), and hue on each
// transition — that camera move IS the between-card animation. A slow idle drift keeps it alive.
//
// Renderer note: this is the flat CSS-3D + SVG version (zero-dep). The WebGL extruded-hexbin
// variant, when we prototype it, slots in behind this same camera()/setStyle() API (plan.md).

const SVGNS = 'http://www.w3.org/2000/svg';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

class ConditionMap extends HTMLElement {
  async ready(mapUrl = '../data/sf_map.json') {
    if (this._ready) return;
    this._map = await (await fetch(mapUrl)).json();
    this._build();
    this._ready = true;
  }

  _build() {
    const { viewBox, hoods } = this._map;
    this.innerHTML = '';
    this._tilt = document.createElement('div'); this._tilt.className = 'map-tilt';
    this._cam = document.createElement('div');  this._cam.className = 'map-camera';
    this._drift = document.createElement('div'); this._drift.className = 'map-drift';

    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');            // decorative; cards carry the text alternative

    this._paths = {};
    for (const [name, h] of Object.entries(hoods)) {
      const p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', h.d);
      p.setAttribute('class', 'hood');
      this._paths[name] = p;
      svg.append(p);
    }
    // pinpoint marker (pins mode) + a group for dot-density (dots mode)
    this._pin = document.createElementNS(SVGNS, 'circle');
    this._pin.setAttribute('r', '7'); this._pin.setAttribute('class', 'map-pin');
    this._dots = document.createElementNS(SVGNS, 'g'); this._dots.setAttribute('class', 'map-dots');
    svg.append(this._dots, this._pin);

    this._svg = svg;
    this._drift.append(svg);
    this._cam.append(this._drift);
    this._tilt.append(this._cam);
    this.append(this._tilt);
    if (!reduced.matches) this._drift.classList.add('is-drifting');
  }

  // Apply a full per-card state in one call (camera + style + hue + active hood).
  // frame: 'city' keeps SF's whole silhouette on screen and only LEANS toward the active hood
  // (our signature — not 311wrapped's zoom-into-a-polygon). 'hood' allows a rare dramatic
  // close-up (e.g., the Tenderloin exhibit).
  apply({ hood = null, rotate = 0, tilt = 55, zoom = null, frame = 'city', lean = 0.4,
          panY = 0, style = 'outline', hue = null,
          duration = 900, easing = 'cubic-bezier(.5,0,.2,1)' } = {}) {
    if (!this._ready) return;
    const h = hood && this._map.hoods[hood];
    // full-centering offset for the hood, then scale it down by `lean` in city frame so the
    // whole city stays visible and just drifts toward the hood.
    const fullTx = h ? (50 - h.cx / this._map.width * 100) : 0;
    const fullTy = h ? (50 - h.cy / this._map.height * 100) : 0;
    const k = frame === 'hood' ? 1 : lean;
    const tx = fullTx * k;
    const ty = fullTy * k;
    if (zoom == null) zoom = frame === 'hood' ? 2.2 : 1.05;   // city frame ≈ whole city visible

    this._cam.style.transition = reduced.matches ? 'none' : `transform ${duration}ms ${easing}`;
    this._tilt.style.transition = reduced.matches ? 'none' : `transform ${duration}ms ${easing}`;
    this._tilt.style.setProperty('--tilt', `${tilt}deg`);
    // screen-space vertical pan of the whole plane — lifts a marker clear of a low panel
    this._tilt.style.setProperty('--pan-y', typeof panY === 'number' ? `${panY}%` : panY);
    this._cam.style.setProperty('--rot', `${rotate}deg`);
    this._cam.style.setProperty('--zoom', String(zoom));
    this._cam.style.setProperty('--tx', `${tx}%`);
    this._cam.style.setProperty('--ty', `${ty}%`);

    if (hue) this.style.setProperty('--map-hue', hue);
    this.setStyle(style, hood, h);
  }

  setStyle(mode, hoodName = null, h = null) {
    this.dataset.style = mode;
    // leaving choropleth → drop the inline per-hood fills so the default faint linework returns
    if (mode !== 'choropleth') this.clearChoropleth();
    for (const [name, p] of Object.entries(this._paths)) {
      p.classList.toggle('is-active', name === hoodName);
    }
    // pin
    if (mode === 'pins' && h) {
      this._pin.setAttribute('cx', h.cx); this._pin.setAttribute('cy', h.cy);
      this._pin.style.display = '';
    } else {
      this._pin.style.display = 'none';
    }
    // dots (2-color density stipple inside active hood) — populated by a card via setDots()
    this._dots.style.display = mode === 'dots' ? '' : 'none';
  }

  // Choropleth: fill each hood by a precomputed CSS color (the card owns the data→color scale, so
  // this stays a generic renderer). Inline styles override the .hood CSS. Missing hoods stay faint.
  setChoropleth(fillByName = {}) {
    this.dataset.style = 'choropleth';
    for (const [name, p] of Object.entries(this._paths)) {
      const c = fillByName[name];
      if (c) { p.style.fill = c; p.style.stroke = `color-mix(in srgb, ${c} 70%, black)`; }
      else { p.style.fill = ''; p.style.stroke = ''; }
    }
  }
  clearChoropleth() {
    for (const p of Object.values(this._paths)) { p.style.fill = ''; p.style.stroke = ''; }
  }

  // Scatter n dots for the dot-density / turf-war style. points: [{x,y,c}] in viewBox units.
  setDots(points = []) {
    this._dots.innerHTML = '';
    for (const pt of points) {
      const c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
      c.setAttribute('r', pt.r || 3);
      c.setAttribute('fill', pt.c || 'currentColor');
      this._dots.append(c);
    }
  }

  // centroid of a hood in viewBox units (for cards that place their own markers)
  centroid(hood) { const h = this._map?.hoods[hood]; return h ? { x: h.cx, y: h.cy } : null; }
}

customElements.define('condition-map', ConditionMap);
export { ConditionMap };
