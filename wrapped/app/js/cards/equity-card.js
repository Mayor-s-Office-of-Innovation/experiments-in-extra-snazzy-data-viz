// The Equity read — Bayview ↔ Mission ↔ income. Two Tier-1 neighborhoods with nearly the same
// number of observed-severe photos, but the Mission files ~5× the 311 complaints — and earns ~2×
// the income. The honest point: 311 counts who calls, not what's on the street, and who calls
// tracks income. (Citywide: income ↔ severe r≈−0.4, income ↔ 311/capita r≈−0.4 — noisy, so the
// concrete two-hood contrast is the hero, with the correlation as a supporting line.)
// Highlights both hoods on the shell map via setChoropleth (2 colors).
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

const BAYVIEW = 'Bayview Hunters Point', MISSION = 'Mission';
const TEAL = 'var(--sf-bay-teal)', GOLD = 'var(--sf-golden-hills)';
const fmt = (n) => (n ?? 0).toLocaleString();
const money = (n) => (n ? `$${Math.round(n / 1000)}k` : '—');

class EquityCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'equity-card');
    this.dataset.align = 'end';

    const b = data.hood(BAYVIEW) || {}, m = data.hood(MISSION) || {};
    this._b = {
      sev: (b.camera_algorithm || {}).obs_with_severe || 0, c311: (b.crowd || {}).total || 0,
      inc: data.income(BAYVIEW),
    };
    this._m = {
      sev: (m.camera_algorithm || {}).obs_with_severe || 0, c311: (m.crowd || {}).total || 0,
      inc: data.income(MISSION),
    };

    const panel = this.h('div', { class: 'panel equity-panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || 'The equity read' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || 'Same street, different voice' }));

    // legend
    const legend = this.h('p', { class: 'equity-legend' },
      this.h('span', { class: 'equity-key equity-key--b', text: 'Bayview' }),
      this.h('span', { class: 'equity-key equity-key--m', text: 'the Mission' }));
    panel.append(legend);

    // three grouped-bar rows
    this._rows = [];
    const metric = (label, bval, mval, fmtFn) => {
      const max = Math.max(bval, mval, 1);
      const row = this.h('div', { class: 'equity-metric' });
      row.append(this.h('p', { class: 'equity-metric__label', text: label }));
      const bars = this.h('div', { class: 'equity-bars' });
      for (const [val, cls, color] of [[bval, 'b', TEAL], [mval, 'm', GOLD]]) {
        const track = this.h('div', { class: 'equity-bar' });
        const fill = this.h('span', { class: `equity-bar__fill equity-bar__fill--${cls}` });
        fill.style.background = color;
        fill.dataset.w = (100 * val / max).toFixed(1);
        fill.style.width = '0%';
        this._rows.push(fill);
        track.append(fill, this.h('span', { class: 'equity-bar__val', text: fmtFn(val) }));
        bars.append(track);
      }
      row.append(bars);
      return row;
    };
    panel.append(metric('Observed problems (severe photos)', this._b.sev, this._m.sev, fmt));
    panel.append(metric('311 complaints', this._b.c311, this._m.c311, fmt));
    panel.append(metric('Median household income', this._b.inc, this._m.inc, money));

    const mult = this._b.c311 ? (this._m.c311 / this._b.c311) : 0;
    panel.append(this.h('p', { class: 'beat__body equity-take' },
      `Nearly the same problems on the street — but the Mission files ${mult.toFixed(1)}× the complaints, on nearly twice the income. 311 counts who calls, not what’s there.`));

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    // NB the card floods teal, so a teal Bayview would vanish — lighten it to read on the flood.
    document.querySelector('condition-map')?.setChoropleth({
      [BAYVIEW]: 'color-mix(in srgb, var(--sf-bay-teal) 45%, white)',
      [MISSION]: 'color-mix(in srgb, var(--sf-golden-hills) 72%, white)',
    });
    motion.play('fade-up', this._panel);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._rows.forEach((f, i) => {
      const to = `${f.dataset.w}%`;
      if (reduced) { f.style.width = to; return; }
      f.animate([{ width: '0%' }, { width: to }],
        { duration: 750, delay: 150 + i * 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
      f.style.width = to;
    });
  }

  onExit() {
    document.querySelector('condition-map')?.clearChoropleth();
    return motion.play('fade-out', this);
  }
}

customElements.define('card-equity', EquityCard);
