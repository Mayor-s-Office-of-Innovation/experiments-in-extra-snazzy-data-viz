// Seam #3 — the card base. Every card is a web component extending this. Uniform lifecycle:
//   render()  — build DOM once (called on first activation)
//   onEnter() — card became active (default: play its data-anim; override to add more)
//   onExit()  — card left (default: no-op)
// Cards compose reusable viz primitives and read data via the selectors (seam #1). They set
// their hue via the `hue` attribute (reflected to data-hue for the token flood).

import * as motion from '../motion.js';

export class CardBase extends HTMLElement {
  static get observedAttributes() { return ['hue']; }

  constructor() {
    super();
    this._rendered = false;
    this.spec = null;          // the manifest entry, injected by the state machine
  }

  attributeChangedCallback(name, _old, val) {
    if (name === 'hue' && val) this.dataset.hue = val;
  }

  connectedCallback() {
    if (this.spec?.hue) this.setAttribute('hue', this.spec.hue);
    if (this.spec?.anim && !this.dataset.anim) this.dataset.anim = this.spec.anim;
    this.setAttribute('role', 'group');
    this.setAttribute('aria-roledescription', 'story card');
  }

  // called by the state machine on navigation.
  // _gen guards against a stale exit's "hide" firing after a fast re-activation.
  activate() {
    this._gen = (this._gen || 0) + 1;
    if (!this._rendered) { this.render(); this._rendered = true; this._addSourceLink(); }
    // clear any lingering enter/exit animations (fill:both) that would hold the card hidden
    this.getAnimations?.({ subtree: true }).forEach((a) => a.cancel());
    // Cards are appended in first-visit order, so DOM order ≠ nav order. Bump z-index on every
    // activation so the incoming card always paints ABOVE the one still fading out — otherwise,
    // navigating BACKWARD leaves the (later-in-DOM) outgoing card on top, blanking the target.
    this.style.zIndex = String((CardBase._z = (CardBase._z || 10) + 1));
    this.setAttribute('active', '');
    this.onEnter();
  }

  deactivate() {
    const gen = this._gen = (this._gen || 0) + 1;
    const a = this.onExit();
    // only hide if this card hasn't been re-activated in the meantime
    const hide = () => { if (this._gen === gen) this.removeAttribute('active'); };
    if (a && a.finished) a.finished.then(hide, hide);
    else hide();
  }

  // ---- overridable lifecycle ----
  render() { /* subclasses build DOM here */ }
  onEnter() { motion.enter(this); }
  onExit() { return motion.play('fade-out', this); }

  // Every card gets a tiny provenance footer: "figures: source & method" → the per-card section
  // of the anchor document (app2/sources.md). The anchor derives from the card's position in the
  // v2 manifest; v1 (no BOOT_MANIFEST) skips it — sources.md documents the v2 deck's slides.
  _addSourceLink() {
    if (this.spec?.noSource) return;
    const manifest = window.BOOT_MANIFEST || [];
    const n = manifest.indexOf(this.spec) + 1;
    if (!n) return;                                     // not a v2 card → no provenance footer
    const a = document.createElement('a');
    a.className = 'card__source';
    a.href = `sources.md#slide-${n}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.dataset.noAdvance = '';
    a.textContent = 'figures: source & method · Jan 30 – Jun 8, 2026';
    this.append(a);
  }

  // ---- small helpers for subclasses ----
  h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('data-') || k === 'role' || k.startsWith('aria-')) el.setAttribute(k, v);
      else el[k] = v;
    }
    for (const c of children) el.append(c);
    return el;
  }
}
