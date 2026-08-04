// The thin, stable core. Walks the manifest, mounts cards, drives navigation, progress,
// the live-region announcement, hue crossfade, and deep-link hash. Knows nothing about any
// specific card — it only calls activate()/deactivate().

export class StoryMachine {
  constructor({ manifest, tagFor, mount, progress, announcer, controls, map }) {
    this.manifest = manifest;
    this.tagFor = tagFor;           // (type) -> custom element tag name
    this.mount = mount;
    this.map = map || null;         // the persistent tilted plane (seam #6)
    this.progressEl = progress;
    this.announcer = announcer;
    this.controls = controls;       // {prev, next, autoplay}
    this.index = -1;
    this.cards = [];                // lazily-created elements, one per manifest entry
    this.autoplay = false;
    this.autoplayMs = 7000;
    this._timer = null;

    this._buildProgress();
    this._wireControls();
    this._wireKeys();
    this._wireStageAdvance();

    const start = this._indexFromHash();
    this.go(start >= 0 ? start : 0, { announce: false });
  }

  _buildProgress() {
    this.manifest.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = 'progress__seg';
      li.dataset.index = i;
      li.setAttribute('aria-label', `${c.title || c.id} (${i + 1} of ${this.manifest.length})`);
      this.progressEl.append(li);
    });
  }

  _ensureCard(i) {
    if (this.cards[i]) return this.cards[i];
    const spec = this.manifest[i];
    const el = document.createElement(this.tagFor(spec.type));
    el.spec = spec;
    el.id = `card-${spec.id}`;
    this.mount.append(el);
    this.cards[i] = el;
    return el;
  }

  go(i, { announce = true } = {}) {
    i = Math.max(0, Math.min(this.manifest.length - 1, i));
    if (i === this.index) return;
    const prev = this.index >= 0 ? this.cards[this.index] : null;

    this.index = i;
    this._syncHue();          // body data-hue → flood + accent (map inherits the new accent)
    this._applyMap();         // camera swings to this card — the "between" animation
    const el = this._ensureCard(i);
    el.activate();            // content animates in on its own timeline, over the moving map
    if (prev) prev.deactivate();

    this._syncProgress();
    this._syncHash();
    if (announce) this._announce();
    this._syncControls();
    if (this.autoplay) this._restartTimer();
  }

  _applyMap() {
    if (!this.map) return;
    const m = this.manifest[this.index].map || {};
    this.map.apply({
      hood: m.hood ?? null,
      rotate: m.rotate ?? 0,
      tilt: m.tilt ?? 54,
      frame: m.frame || 'city',
      style: m.style || 'outline',
      zoom: m.zoom,
      lean: m.lean,
      panY: m.panY ?? 0,                                  // was dropped here — the pin-clearing lift
      duration: m.duration || 750,                       // snappier; the move is the show
      easing: m.easing || 'cubic-bezier(.45,0,.15,1)',   // quick out, settled landing
    });
  }

  next() { if (this.index < this.manifest.length - 1) this.go(this.index + 1); else this.setAutoplay(false); }
  prev() { this.go(this.index - 1); }

  setAutoplay(on) {
    this.autoplay = on;
    this.controls.autoplay.setAttribute('aria-pressed', String(on));
    this.controls.autoplay.textContent = on ? '❚❚ Pause' : '▶ Auto';
    if (on) this._restartTimer(); else this._clearTimer();
  }

  _restartTimer() { this._clearTimer(); this._timer = setTimeout(() => this.next(), this.autoplayMs); }
  _clearTimer() { if (this._timer) { clearTimeout(this._timer); this._timer = null; } }

  _syncProgress() {
    [...this.progressEl.children].forEach((seg, i) => {
      seg.removeAttribute('aria-current');
      seg.dataset.done = String(i < this.index);
      if (i === this.index) seg.setAttribute('aria-current', 'step');
    });
  }

  _syncHue() {
    const hue = this.manifest[this.index].hue;
    if (hue) document.body.dataset.hue = hue;      // body tracks active hue → CSS crossfade
  }

  _syncHash() { history.replaceState(null, '', `#${this.manifest[this.index].id}`); }

  _announce() {
    const c = this.manifest[this.index];
    this.announcer.textContent = `${c.title || c.id}. Card ${this.index + 1} of ${this.manifest.length}.`;
    // move focus to the stage so SR users land on the new card
    this.mount.closest('.stage')?.focus?.();
  }

  _syncControls() {
    this.controls.prev.disabled = this.index === 0;
    this.controls.next.disabled = this.index === this.manifest.length - 1;
  }

  _indexFromHash() {
    const id = location.hash.slice(1);
    return this.manifest.findIndex((c) => c.id === id);
  }

  _wireControls() {
    this.controls.prev.addEventListener('click', () => this.prev());
    this.controls.next.addEventListener('click', () => this.next());
    this.controls.autoplay.addEventListener('click', () => this.setAutoplay(!this.autoplay));
  }

  _wireKeys() {
    addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
      else if (e.key === ' ') { e.preventDefault(); this.setAutoplay(!this.autoplay); }
    });
  }

  // Tap-to-skip: click the stage advances, UNLESS the click hit something interactive.
  _wireStageAdvance() {
    this.mount.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, select, textarea, [data-no-advance]')) return;
      this.next();
    });
  }
}
