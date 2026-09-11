// Insight 1 — Bayview vs Mission bar-pair. Two labeled rows (severe observations, 311 cases),
// each row two proportional bars (Bayview vs Mission). Both rows are raw counts on equivalent
// axes — no percent-vs-count mixing. The visual asymmetry IS the argument: one near-identical
// row (conditions), one catastrophically lopsided (complaints).
// The visual asymmetry IS the argument: three near-identical rows, one catastrophically lopsided.
// Numbers come from the bake via data.hood() — never hardcoded.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

const HOOD_A = 'Bayview Hunters Point';
const HOOD_B = 'Mission';
const HOOD_A_SHORT = 'Bayview';
const HOOD_B_SHORT = 'Mission';

class BarPairCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'barpair');
    if (s.align) this.dataset.align = s.align;

    const a = data.hood(HOOD_A)?.camera_algorithm || {};
    const b = data.hood(HOOD_B)?.camera_algorithm || {};
    const a311 = data.hood(HOOD_A)?.crowd?.total || 0;
    const b311 = data.hood(HOOD_B)?.crowd?.total || 0;

    const rows = [
      { label: 'severe observations',         a: a.obs_with_severe, b: b.obs_with_severe },
      { label: '311 complaints',              a: a311,              b: b311, ratio: true },
    ];

    const panel = this.h('div', { class: 'panel barpair__panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || '' }));

    // legend chips once, above the rows
    const legend = this.h('div', { class: 'barpair__legend' },
      this.h('span', { class: 'barpair__chip barpair__chip--a', text: HOOD_A }),
      this.h('span', { class: 'barpair__chip barpair__chip--b', text: HOOD_B }));
    panel.append(legend);

    this._rows = [];
    this._nums = [];
    const max = {
      sev: Math.max(a.obs_with_severe || 0, b.obs_with_severe || 0),
      c311: Math.max(a311, b311),
    };
    for (const [ri, r] of rows.entries()) {
      // the 311 row is the argument — mark it so CSS can grow it and dim the "same" row
      const hero = r.ratio ? ' barpair__row--hero' : ' barpair__row--same';
      const m = r.ratio ? max.c311 : max.sev;
      const row = this.h('div', { class: `barpair__row${hero}` });
      row.append(this.h('p', { class: 'barpair__label', text: r.label }));
      const bars = this.h('div', { class: 'barpair__bars' });
      for (const [i, v] of [r.a, r.b].entries()) {
        // plot zone is a fixed 100ch grid column, so fill width % is exact: 85 vs 93 renders
        // 91% vs 100%, and flex can't shrink the bar to make room for the count/tag (they
        // live in their own column — width is proportional, never space-starved).
        const zone = this.h('div', { class: 'barpair__zone' });
        const fill = this.h('div', { class: 'barpair__fill' });
        fill.dataset.w = String(Math.max(2, 100 * (v || 0) / m));   // min 2% so tiny bars stay visible
        const num = this.h('span', { class: 'barpair__num' });
        num.dataset.to = String(v || 0);
        num.textContent = '0';
        this._nums.push({ num, fmt: r.fmt });
        // hood tag on every bar — never make the viewer deduce which color is which district
        const tag = this.h('span', { class: `barpair__tag barpair__tag--${i ? 'b' : 'a'}`, text: i ? HOOD_B_SHORT : HOOD_A_SHORT });
        zone.append(fill);
        bars.append(this.h('div', { class: `barpair__track barpair__track--${i ? 'b' : 'a'}` }, zone, num, tag));
      }
      row.append(bars);
      panel.append(row);
      this._rows.push(row);
    }

    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));
    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    motion.play('fade-up', this._panel);
    // the two map highlights take the SAME colors as the two bar series below — concrete
    // rgba components (no var()/color-mix in inline SVG styles; some browsers drop those)
    const map = document.querySelector('condition-map');
    if (map) {
      const accent = parseColor(getComputedStyle(this).getPropertyValue('--card-accent'), [224, 165, 38]);
      const fg = parseColor(getComputedStyle(this).getPropertyValue('--card-fg'), [242, 244, 243]);
      // Mission's bar is fg at 72% over the panel — bake that mix here so the map gets one
      // flat rgba (no nested color-mix, which some mobile browsers ignore)
      const b = fg.map((v, i) => Math.round(v * 0.72 + 20 * 0.28 * (i === 3 ? 1 : 0)));
      map.setHoodColors({ [HOOD_A]: { r: accent[0], g: accent[1], b: accent[2] },
        [HOOD_B]: { r: b[0], g: b[1], b: b[2] } });
    }
    // bars grow staggered, then the numbers count up
    this._rows.forEach((row, i) => {
      const fills = row.querySelectorAll('.barpair__fill');
      fills.forEach((f, j) => {
        f.animate([{ width: '0%' }, { width: f.dataset.w + '%' }],
          { duration: 700, delay: 150 + i * 180 + j * 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
      });
    });
    this._nums.forEach(({ num, fmt }, i) => motion.play('count-up', num, {
      to: Number(num.dataset.to), format: fmt ? () => fmt(Number(num.dataset.to)) : undefined,
    }));
  }

  onExit() {
    document.querySelector('condition-map')?.clearHoodColors();
    return motion.play('fade-out', this);
  }
}

// parse any css color string to [r,g,b] components (fallback on failure)
function parseColor(css, fallback) {
  const el = document.createElement('i');
  el.style.color = css.trim();
  document.body.append(el);
  const m = getComputedStyle(el).color.match(/[\d.]+/g) || [];
  el.remove();
  const [r, g, b] = m.slice(0, 3).map(Number);
  return m.length >= 3 && [r, g, b].every(Number.isFinite) ? [r, g, b] : fallback;
}

customElements.define('card-barpair', BarPairCard);