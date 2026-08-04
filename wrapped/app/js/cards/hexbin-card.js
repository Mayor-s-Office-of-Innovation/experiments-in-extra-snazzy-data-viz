// The Snapshots hero card — the citywide severe-density hexbin. Two engines live behind the renderer
// seam (Seam #6): WebGL (deck.gl, lazy) is the default, SVG faux-3D at ?hexbin=svg. Passive story
// hero (taps advance). Dev escape hatches only (no on-card buttons): ?hexbin=svg|webgl, ?panel=min.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

const ENGINES = {
  svg:   () => import('../render/hexbin-svg.js'),
  webgl: () => import('../render/hexbin-webgl.js'),
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

class HexbinCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'hexbin-card');
    if (s.align) this.dataset.align = s.align;

    const params = new URL(location.href).searchParams;
    this._engineName = params.get('hexbin') === 'svg' ? 'svg' : 'webgl';   // WebGL default
    this.dataset.panel = params.get('panel') === 'min' || params.get('panel') === 'off' ? 'min' : 'full';

    this._stage = this.h('div', { class: 'hexbin-stage', 'aria-hidden': 'true' });
    this.append(this._stage);

    const panel = this.h('div', { class: 'panel hexbin-panel' });
    const prose = this.h('div', { class: 'hexbin-prose' });
    prose.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    prose.append(this.h('h2', { class: 'display', text: s.title || '' }));
    if (s.chip) prose.append(this.h('p', { class: 'hexbin-chip' }, this.h('strong', { text: s.chip.big || '' }),
      this.h('span', { text: s.chip.label || '' })));
    if (s.body) prose.append(this.h('p', { class: 'beat__body', text: s.body }));
    if (s.caption) prose.append(this.h('p', { class: 'hexbin-caption', text: s.caption }));
    panel.append(prose);

    this._panel = panel;
    this.append(panel);
  }

  async _ensureData() {
    if (this._hexes) return this._hexes.length > 0;
    try { await data.loadMap(); } catch (e) { console.warn('sf_map load failed', e); return false; }
    this._hexes = data.mapHexes();
    this._hoods = data.mapHoods();
    this._outlines = data.mapOutlines();
    this._meta = data.mapMeta();
    return this._hexes.length > 0;
  }

  async _mountEngine() {
    const token = (this._mountToken = (this._mountToken || 0) + 1);
    if (!(await this._ensureData())) return;
    if (this._engine) { try { this._engine.destroy(); } catch {} this._engine = null; }
    this._stage.textContent = '';
    const mod = await ENGINES[this._engineName]();
    if (token !== this._mountToken) return;   // a newer mount superseded this one
    const inst = await mod.mount(this._stage, {
      hexes: this._hexes,
      hoods: this._hoods,
      outlines: this._outlines,
      hexR: this._meta?.hexR || 5,
      viewBox: { w: this._meta?.w || 1000, h: this._meta?.h || 1002 },
      camera: { rotate: this.spec.map?.rotate || 0, tilt: this.spec.map?.tilt || 55 },
      reducedMotion: reduced.matches,
    });
    if (token !== this._mountToken) { try { inst.destroy(); } catch {} return; }
    this._engine = inst;
  }

  onEnter() {
    document.querySelector('condition-map')?.setAttribute('data-hidden', '');   // don't fight the hexbin
    motion.play('fade-up', this._panel);
    this._mountEngine();
  }

  onExit() {
    document.querySelector('condition-map')?.removeAttribute('data-hidden');
    this._mountToken = (this._mountToken || 0) + 1;   // cancel any in-flight mount
    const a = motion.play('fade-out', this);
    const eng = this._engine; this._engine = null;
    const kill = () => { try { eng?.destroy(); } catch {} };
    if (a && a.finished) a.finished.then(kill, kill); else kill();
    return a;
  }
}

customElements.define('card-hexbin', HexbinCard);
