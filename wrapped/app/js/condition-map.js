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
  apply({ hood = null, hoods = null, rotate = 0, tilt = 55, zoom = null, frame = 'city', lean = 0.4,
          panY = 0, style = 'outline', hue = null, leanX = null, settle = 0,
          duration = 900, easing = 'cubic-bezier(.5,0,.2,1)' } = {}) {
    if (!this._ready) return;
    // settle: ms after which the idle motion (drift + rock) PAUSES in place — for slides that
    // should come to rest (e.g. the opening questions). Any later apply() resumes it.
    clearTimeout(this._settleTimer);
    this._drift.classList.remove('is-paused');
    if (settle > 0) {
      this._settleTimer = setTimeout(() => {
        this._drift.classList.add('is-paused');
        this._rock?.pause();
      }, settle);
    }
    // `hoods` (array) lights several neighborhoods; `hood` (string) is the legacy single form.
    const list = hoods || (hood ? [hood] : []);
    // lean toward the centroid of the active hoods (or stay put)
    const cx = list.length ? list.reduce((s, n) => s + (this._map.hoods[n]?.cx || 0), 0) / list.length : null;
    const cy = list.length ? list.reduce((s, n) => s + (this._map.hoods[n]?.cy || 0), 0) / list.length : null;
    const h = cx != null ? { cx, cy } : null;
    // full-centering offset for the hood, then scale it down by `lean` in city frame so the
    // whole city stays visible and just drifts toward the hood.
    const fullTx = h ? (50 - h.cx / this._map.width * 100) : 0;
    const fullTy = h ? (50 - h.cy / this._map.height * 100) : 0;
    const k = frame === 'hood' ? 1 : lean;
    // leanX: override the horizontal lean only (e.g. push the map west so east-side hoods
    // clear a bottom-docked card). null = use the computed tx.
    const tx = leanX != null ? leanX : fullTx * k;
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
    this._idleRock(reduced.matches ? 0 : 1.1, Math.max(2400, duration + 600));

    if (hue) this.style.setProperty('--map-hue', hue);
    this.setStyle(style, list.length ? list : null, h);
  }

  // After the camera lands, keep the plane alive: a slow ±deg rotateZ rock on the camera
  // around its new resting angle. Adds motion between transitions without fighting them.
  // amplitude 0 = off (reduced motion). The CSS transition above must be cleared once done
  // or it would ease the rock too — so the rock is a WAAPI animation on the camera element
  // around rotate(var(--rot)), composited via a wrapper keyframe on --rot... but CSS custom
  // properties don't animate in WAAPI keyframes cross-browser, so we rock a WRAPPER instead:
  // the drift layer already pan/rotates; we give the TILT layer a gentle rotateZ wobble.
  _idleRock(amp, dur) {
    this._rock?.cancel();
    if (!amp) return;
    const el = this._cam;
    // cancelable idle rock around the current --rot: animate a separate transform property
    // by nudging rotateZ through a composite 'add' animation (adds to the existing transform).
    this._rock = el.animate(
      [{ transform: 'rotateZ(0deg)' }, { transform: `rotateZ(${amp}deg)` }, { transform: 'rotateZ(0deg)' },
       { transform: `rotateZ(-${amp}deg)` }, { transform: 'rotateZ(0deg)' }],
      { duration: dur * 4, iterations: Infinity, easing: 'ease-in-out', composite: 'add' });
  }

  setStyle(mode, hoodNames = null, h = null) {
    this.dataset.style = mode;
    // leaving choropleth → drop the inline per-hood fills so the default faint linework returns.
    // 'drain' is exempt: it FADES the existing fills (never cleared — else there's nothing to drain).
    if (mode !== 'choropleth' && mode !== 'drain') this.clearChoropleth();
    const active = Array.isArray(hoodNames) ? hoodNames : (hoodNames ? [hoodNames] : []);
    for (const [name, p] of Object.entries(this._paths)) {
      p.classList.toggle('is-active', active.includes(name));
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

  // Per-hood highlight colors on the FILLED style (e.g. match a card's bar colors 1:1).
  // Values are CONCRETE css colors (rgb/rgba strings) — no var()/nested color-mix, which some
  // browsers drop (leaving the default gold on every active hood). Keeps is-active glow logic.
  setHoodColors(colorsByName = {}) {
    for (const [name, p] of Object.entries(this._paths)) {
      const c = colorsByName[name];
      if (c && p.classList.contains('is-active')) {
        p.style.fill = `rgba(${c.r},${c.g},${c.b},0.46)`;
        p.style.stroke = `rgb(${c.r},${c.g},${c.b})`;
        p.style.filter = `drop-shadow(0 0 14px rgba(${c.r},${c.g},${c.b},0.7))`;
      }
    }
  }
  clearHoodColors() {
    for (const p of Object.values(this._paths)) { p.style.fill = ''; p.style.stroke = ''; p.style.filter = ''; }
  }

  // Drain: fade the current choropleth fills toward transparent, keeping faint linework —
  // "the map goes dark where nobody calls." Reduced motion snaps straight to the drained state.
  drainChoropleth() {
    this.dataset.style = 'drain';
    for (const p of Object.values(this._paths)) {
      if (!p.style.fill) continue;
      if (reduced.matches) { p.style.fillOpacity = '0.12'; p.style.strokeOpacity = '0.3'; continue; }
      p.animate([{ fillOpacity: 1, strokeOpacity: 1 }, { fillOpacity: 0.12, strokeOpacity: 0.3 }],
        { duration: 1400, delay: 300, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
    }
  }
  undrainChoropleth() {
    for (const p of Object.values(this._paths)) {
      p.getAnimations?.().forEach((a) => a.cancel());
      // restore full opacity but KEEP the fill — the choropleth card owns clearing it
      p.style.fillOpacity = ''; p.style.strokeOpacity = '';
    }
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

  // ---- v2 streets basemap (Insight 3): three <path>s by road class (local / major / fwy),
  // drawn ABOVE the faint hood fills and BELOW dots + pin. Built once from sf_streets.json
  // (data.loadStreets()); shown/hidden by class so re-entering the slide costs nothing.
  setStreets(classes = {}) {
    if (!this._streets) {
      this._streets = document.createElementNS(SVGNS, 'g');
      this._streets.setAttribute('class', 'map-streets');
      this._svg.insertBefore(this._streets, this._dots);
      for (const k of ['local', 'major', 'fwy']) {
        if (!classes[k]) continue;
        const p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('d', classes[k]);
        p.setAttribute('class', `map-street map-street--${k}`);
        this._streets.append(p);
      }
    }
    this._streets.classList.add('is-on');
  }
  clearStreets() { this._streets?.classList.remove('is-on'); }

  // ---- v2 photo dots (Insight 3): ONE DOT PER PHOTO, scattered deterministically inside its
  // hex (seeded by the hex id, so the picture is stable across visits). The first `n_clean`
  // dots of each hex carry is-clean. Dots pop in on a per-dot delay (--d); litDots() then
  // turns the clean ones green on a second stagger (--g) while the 43% counts up — the
  // picture and the number are the same measure: photos with nothing wrong at all.
  setPhotoDots(hexes = [], hexR = 5) {
    if (!this._photoDots) {
      this._photoDots = document.createElementNS(SVGNS, 'g');
      this._photoDots.setAttribute('class', 'map-photodots');
      this._svg.insertBefore(this._photoDots, this._dots);
    }
    const g = this._photoDots;
    g.innerHTML = '';
    g.classList.remove('is-lit', 'no-trans');
    const frag = document.createDocumentFragment();
    const R = hexR * 0.86;
    let total = 0;
    for (const hx of hexes) {
      const n = hx.n || 0, clean = Math.min(n, hx.n_clean || 0);
      if (!n) continue;
      let seed = fnv(hx.h3);
      const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      for (let i = 0; i < n; i++) {
        const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * R;     // uniform in the disc
        const c = document.createElementNS(SVGNS, 'circle');
        c.setAttribute('cx', (hx.x + r * Math.cos(a)).toFixed(1));
        c.setAttribute('cy', (hx.y + r * Math.sin(a)).toFixed(1));
        c.setAttribute('r', '1.3');
        c.setAttribute('class', i < clean ? 'map-photodot is-clean' : 'map-photodot');
        c.style.setProperty('--d', `${Math.round(rnd() * 1500)}ms`);
        if (i < clean) c.style.setProperty('--g', `${Math.round(rnd() * 1200)}ms`);
        frag.append(c);
        total++;
      }
    }
    g.append(frag);
    g.classList.add('is-on');
    return total;
  }
  litDots({ instant = false } = {}) {
    if (!this._photoDots) return;
    if (instant) this._photoDots.classList.add('no-trans');
    requestAnimationFrame(() => this._photoDots?.classList.add('is-lit'));
  }
  clearPhotoDots() {
    if (this._photoDots) { this._photoDots.classList.remove('is-on', 'is-lit', 'no-trans'); this._photoDots.innerHTML = ''; }
  }

  // ---- pin at an arbitrary projected point (v2 Insight 2: the one block). The next
  // apply()/setStyle() hides the pin again, so cards call this AFTER the camera lands.
  pinAt(x, y) {
    this._pin.setAttribute('cx', x); this._pin.setAttribute('cy', y);
    this._pin.style.display = '';
  }
}

// FNV-1a over a string → 32-bit seed for the per-hex dot scatter
function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h || 1;
}

customElements.define('condition-map', ConditionMap);
export { ConditionMap };
