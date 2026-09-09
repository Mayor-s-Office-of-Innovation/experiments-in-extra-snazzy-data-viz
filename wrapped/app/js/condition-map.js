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
          panY = 0, style = 'outline', hue = null, leanX = null,
          duration = 900, easing = 'cubic-bezier(.5,0,.2,1)' } = {}) {
    if (!this._ready) return;
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
  // Unlike setChoropleth this keeps the is-active glow logic — only fill/stroke are overridden.
  setHoodColors(colorsByName = {}) {
    for (const [name, p] of Object.entries(this._paths)) {
      const c = colorsByName[name];
      if (c && p.classList.contains('is-active')) {
        p.style.fill = `color-mix(in srgb, ${c} 46%, transparent)`;
        p.style.stroke = c;
        p.style.filter = `drop-shadow(0 0 14px color-mix(in srgb, ${c} 70%, transparent))`;
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

  // ---- v2 pale-out stipple: one layer above the hoods; dots carry data-calm → CSS pales them ----
  setStipple(points = []) {
    if (!this._stipple) {
      this._stipple = document.createElementNS(SVGNS, 'g');
      this._stipple.setAttribute('class', 'map-stipple');
      this._svg.insertBefore(this._stipple, this._dots);   // above hoods, below pin
    }
    this._stipple.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const pt of points) {
      const c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1));
      c.setAttribute('r', '1.6');
      if (pt.calm) c.dataset.calm = '';
      c.setAttribute('class', 'map-stipple__dot' + (pt.calm ? ' is-calm' : ''));
      frag.append(c);
    }
    this._stipple.append(frag);
    this._stipple.classList.add('is-on');   // CSS base hides the layer; this class shows it
  }
  // pale the calm dots (CSS transition animates fill/opacity from the lit base state)
  paleStipple() {
    requestAnimationFrame(() => this._stipple?.classList.add('is-paled'));
  }
  paleStippleNow() { this._stipple?.classList.add('is-paled', 'no-trans'); }
  clearStipple() {
    if (this._stipple) { this._stipple.classList.remove('is-paled', 'no-trans', 'is-on'); this._stipple.innerHTML = ''; }
  }

  // ---- v2 "dawn sweep" (Insight 3 option 1): the plane starts near-black, then hoods light
  // up west→east as the count-up runs. Nightfall on enter, dawn sweep mid-card, clearDawn on exit.
  // Keyframes must use CONCRETE colors — color-mix()/var() pairs inside WAAPI keyframes don't
  // interpolate reliably, so we resolve the tokens to rgb here.
  nightfall() {
    this.dataset.style = 'dawn';                     // stops generic fill-clearing
    const ink = this._resolveColor('var(--ink)', '#0c1014');
    for (const p of Object.values(this._paths)) {
      p.style.fill = ink;
      p.style.stroke = 'rgba(235, 240, 245, 0.14)';
    }
  }
  _resolveColor(token, fallback) {
    try { return getComputedStyle(this).getPropertyValue(token.replace(/^var\(|\)$/g, '').trim()).trim() || fallback; }
    catch { return fallback; }
  }
  dawnSweep() {
    if (this.dataset.style !== 'dawn') return;
    const from = getComputedStyle(this).getPropertyValue('--ink').trim() || '#0c1014';
    const accent = getComputedStyle(this).getPropertyValue('--map-hue').trim() || '#e0a526';
    // alpha-blend the accent over the night color ourselves (accent 34% over ink ≈ readable glow)
    const DURATION = 2600;                            // total sweep window (ms)
    for (const [name, hd] of Object.entries(this._map.hoods)) {
      const p = this._paths[name];
      if (!p) continue;
      const westness = hd.cx != null ? hd.cx / this._map.width : 0.5;
      const delay = Math.round(westness * DURATION);
      p.animate(
        [{ fill: from }, { fill: accent }],
        { duration: 900, delay, easing: 'ease-out', fill: 'forwards' })
        .finished.then(() => {
          // the glow is MOMENTARY — wash out to a whisper so the green hexes own the frame
          p.animate(
            [{ fill: accent, opacity: 0.82 }, { fill: from, opacity: 0.55 }],
            { duration: 1400, easing: 'ease-in-out', fill: 'forwards' });
        })
        .catch(() => {});
    }
  }
  clearDawn() {
    for (const p of Object.values(this._paths)) {
      p.getAnimations?.().forEach((a) => a.cancel());
      p.style.fill = ''; p.style.stroke = ''; p.style.opacity = '';
    }
    if (this.dataset.style === 'dawn') this.dataset.style = 'outline';
  }

  // ---- v2 dawn hex-leaves: as the sweep wave passes, CALM hexes (n_severe === 0) pop in as
  // small flat green hexes — "where the app looked and found clean streets." Severe hexes stay
  // dark. Delay ∝ hex x (same west→east wave as the hood glow). One SVG group, WAAPI scale/fade.
  dawnHexes(hexes = []) {
    if (this.dataset.style !== 'dawn' || !hexes.length) return;
    const NS = SVGNS;
    if (!this._dawnHexes) {
      this._dawnHexes = document.createElementNS(NS, 'g');
      this._dawnHexes.setAttribute('class', 'map-dawn-hexes');
      this._svg.insertBefore(this._dawnHexes, this._dots);
    }
    this._dawnHexes.innerHTML = '';
    const meta = this._map.hex_r || 5;
    const r = meta * 0.72;                       // slightly undersized → grout lines between hexes
    const ANG = [0, 60, 120, 180, 240, 300].map((d) => d * Math.PI / 180);
    const width = this._map.width;
    const DURATION = 2600;
    const frag = document.createDocumentFragment();
    for (const hx of hexes) {
      if (hx.n_severe > 0) continue;             // severe hexes stay dark — the point
      const westness = hx.x != null ? hx.x / width : 0.5;
      const delay = Math.round(westness * DURATION);
      const pts = ANG.map((a) => `${(hx.x + r * Math.cos(a)).toFixed(1)},${(hx.y + r * Math.sin(a)).toFixed(1)}`).join(' ');
      const poly = document.createElementNS(NS, 'polygon');
      poly.setAttribute('points', pts);
      poly.setAttribute('class', 'map-dawn-hex');
      poly.style.setProperty('--d', `${delay}ms`);
      frag.append(poly);
    }
    this._dawnHexes.append(frag);
    this._dawnHexes.classList.add('is-on');
  }
  clearDawnHexes() {
    if (this._dawnHexes) { this._dawnHexes.classList.remove('is-on'); this._dawnHexes.innerHTML = ''; }
  }
}

customElements.define('condition-map', ConditionMap);
export { ConditionMap };
