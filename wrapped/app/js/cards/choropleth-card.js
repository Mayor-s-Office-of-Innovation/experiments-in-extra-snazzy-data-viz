// The Complaints (311) — a flat choropleth on the shared tilted plane: each of the 41 hoods shaded
// by its complaint volume. The flat public *ledger*, counterpart to the Snapshots' 3D hexbin. Uses a
// perceptual (sqrt) scale because 311 is heavily skewed (Mission ~35k vs a ~2.5k median). Sand→amber
// sequential ramp, dataviz-validated against the green flood. Drives the shell map (Seam #6).
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

// sand → amber (light→dark), validated ordinal on the crowd/green flood
const RAMP = ['#f2e6c4', '#e6c179', '#d29a3b', '#b0741d', '#7c4d12'].map((h) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
const rampAt = (t) => {
  t = Math.max(0, Math.min(1, t));
  const seg = t * (RAMP.length - 1), i = Math.min(RAMP.length - 2, Math.floor(seg)), f = seg - i;
  const a = RAMP[i], b = RAMP[i + 1];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
};

class ChoroplethCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'choropleth-card');
    if (s.align) this.dataset.align = s.align;

    // per-hood 311 totals → colors (sqrt scale compresses the Mission outlier)
    const hoods = data.hoods();
    const totals = Object.fromEntries(Object.entries(hoods).map(([n, v]) => [n, (v.crowd || {}).total || 0]));
    const max = Math.max(1, ...Object.values(totals));
    this._fill = {};
    for (const [n, t] of Object.entries(totals)) if (t > 0) this._fill[n] = rampAt(Math.sqrt(t / max));

    const panel = this.h('div', { class: 'panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || '' }));

    const hl = data.headline();
    const num = this.h('span', { class: 'stat__num' });
    num.dataset.to = String(hl.reports311 || 0);
    num.textContent = '0';
    this._num = num;
    panel.append(this.h('p', { class: 'beat__stat' }, num,
      this.h('span', { class: 'stat__label', text: s.stat?.label || 'reports filed to SF 311' })));

    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));

    // legend: fewer → more, as the ramp
    const legend = this.h('div', { class: 'choro-legend' });
    legend.append(this.h('span', { class: 'choro-legend__label', text: 'fewer' }));
    legend.append(this.h('span', { class: 'choro-legend__bar' }));
    legend.append(this.h('span', { class: 'choro-legend__label', text: 'more' }));
    panel.append(legend);

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    document.querySelector('condition-map')?.setChoropleth(this._fill);
    motion.play('fade-up', this._panel);
    if (this._num) motion.play('count-up', this._num, { to: Number(this._num.dataset.to) });
  }

  onExit() {
    document.querySelector('condition-map')?.clearChoropleth();
    return motion.play('fade-out', this);
  }
}

customElements.define('card-choropleth', ChoroplethCard);
