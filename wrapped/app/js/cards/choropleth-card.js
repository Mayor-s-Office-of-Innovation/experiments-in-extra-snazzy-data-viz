// The Complaints (311) — a flat choropleth on the shared tilted plane: each of the 41 hoods shaded
// by its complaint volume. The flat public *ledger*, counterpart to the Snapshots' 3D hexbin. Uses a
// perceptual (sqrt) scale because 311 is heavily skewed (Mission ~35k vs a ~2.5k median). Sand→amber
// sequential ramp, dataviz-validated against the green flood. Drives the shell map (Seam #6).
//
// v2 merged card (slides 3+4): `drain: true` adds the "blind spots" beat — after the 167,819
// count-up settles, the amber flood drains to linework while the limitation bullets fly in.
// One card, one argument: the flood fills, then goes dark where nobody calls.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

// sand → amber (light→dark), validated ordinal on the crowd/green flood
export const RAMP = ['#f2e6c4', '#e6c179', '#d29a3b', '#b0741d', '#7c4d12'].map((h) =>
  [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
export const rampAt = (t) => {
  t = Math.max(0, Math.min(1, t));
  const seg = t * (RAMP.length - 1), i = Math.min(RAMP.length - 2, Math.floor(seg)), f = seg - i;
  const a = RAMP[i], b = RAMP[i + 1];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
};

// per-hood 311 totals → fill colors (sqrt scale). Exported so v2's drain card can re-apply
// the same fills independently of slide order (drain needs fills present to fade them).
export function complaintFills() {
  const hoods = data.hoods();
  const totals = Object.fromEntries(Object.entries(hoods).map(([n, v]) => [n, (v.crowd || {}).total || 0]));
  const max = Math.max(1, ...Object.values(totals));
  const fill = {};
  for (const [n, t] of Object.entries(totals)) if (t > 0) fill[n] = rampAt(Math.sqrt(t / max));
  return fill;
}

class ChoroplethCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'choropleth-card');
    if (s.align) this.dataset.align = s.align;
    if (s.drain) this._drain = true;              // v2: merged blind-spots beat (drain on enter)

    // per-hood 311 totals → colors (sqrt scale compresses the Mission outlier)
    this._fill = complaintFills();

    const panel = this.h('div', { class: 'panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    if (s.title) panel.append(this.h('h2', { class: 'display', text: s.title }));

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

    // limitation bullets (v2 merged card): same markup as the beat card — li grid is
    // strictly [counter | content] via one wrapping span (strong + span inside it).
    if (s.items?.length) {
      const ul = this.h('ul', { class: 'beat__items' });
      for (const it of s.items) {
        const li = this.h('li');
        if (typeof it === 'string') {
          li.append(this.h('span', { text: it }));
        } else {
          const content = this.h('span');
          if (it.t) content.append(this.h('strong', { text: it.t }));
          if (it.d) content.append(this.h('span', { text: it.d }));
          li.append(content);
        }
        ul.append(li);
      }
      panel.append(ul);
      this._items = ul;
    }

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    document.querySelector('condition-map')?.setChoropleth(this._fill);
    motion.play('fade-up', this._panel);
    if (this._num) motion.play('count-up', this._num, { to: Number(this._num.dataset.to) });
    if (this._drain) {
      // choreography: the flood fills and the count-up lands FIRST, then the map drains to
      // linework as the limitation bullets fly in — "the map goes dark where nobody calls."
      // The stagger starts NOW with the full drain delay: fill:'backwards' holds the bullets
      // at their start keyframe until then (no visible→hidden blink at drain time).
      // Reduced motion skips the wait: drainChoropleth() snaps straight to the drained state.
      if (reduced.matches) {
        document.querySelector('condition-map')?.drainChoropleth();
        this._panel.classList.add('is-drained');
      } else {
        if (this._items) motion.play('fly-in-stagger', this._panel, { selector: '.beat__items > li', delay: 1150 });
        this._drainTimer = setTimeout(() => {
          this._drainTimer = null;
          document.querySelector('condition-map')?.drainChoropleth();
          this._panel.classList.add('is-drained');   // the ramp legend fades with the map it explains
        }, 1150);
      }
    }
  }

  onExit() {
    if (this._drain) {
      if (this._drainTimer) { clearTimeout(this._drainTimer); this._drainTimer = null; }
      this._panel.classList.remove('is-drained');
      document.querySelector('condition-map')?.undrainChoropleth();
    }
    // don't clear underneath an incoming card that styles the map inline itself — the drain
    // beat re-applies + fades these fills, and the bar-pair sets per-hood colors; both enter
    // BEFORE this exit runs, so clearing here would erase their work.
    const mapStylers = [...document.querySelectorAll('card-beat, card-barpair')]
      .filter((c) => c.hasAttribute('active') && (c._drain || c.tagName === 'CARD-BARPAIR'));
    if (!mapStylers.length) document.querySelector('condition-map')?.clearChoropleth();
    return motion.play('fade-out', this);
  }
}

customElements.define('card-choropleth', ChoroplethCard);
