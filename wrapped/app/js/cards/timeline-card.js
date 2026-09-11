// Insight 2 — "A denominator changes the picture": ONE BLOCK, both records, one time axis.
// Row 1: every comparable 311 complaint filed inside the block's hex, one dot per case, stacked
// per day. Row 2: every day staff photographed the block, one mark per visit-day colored by the
// worst rating that day (green = nothing wrong, amber = something rated 1, red = rated 2+).
// The empty space between marks IS the denominator 311 doesn't have. All figures come from the
// bake's block_exhibit (build/sources/block.py) — nothing here is illustrative.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

const NS = 'http://www.w3.org/2000/svg';
const DAY = 86400000;
const W = 1000, PAD = 12;                 // strip viewBox width + side padding (units)
const CASE_R = 6, CASE_STEP = 13;         // 311 dots: radius + vertical stack spacing
const VISIT_R = 11, H_VISITS = 46;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LEVEL = ['clean', 'issue', 'severe'];
const LEVEL_TEXT = ['nothing wrong', 'something rated 1', 'something rated 2+'];

const dayIndex = (iso, start) => Math.round((Date.parse(iso + 'T12:00:00Z') - Date.parse(start + 'T12:00:00Z')) / DAY);

class TimelineCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'timeline');
    if (s.align) this.dataset.align = s.align;

    const b = data.block();
    const panel = this.h('div', { class: 'panel timeline__panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || '' }));
    if (!b) {
      panel.append(this.h('p', { class: 'beat__body', text: 'Block exhibit not built (run build/sources/block.py).' }));
      this._panel = panel; this.append(panel); return;
    }
    this._block = b;
    const sum = b.summary;
    const days = dayIndex(b.window.end, b.window.start) + 1;       // 131 days
    const x = (iso) => PAD + (dayIndex(iso, b.window.start) / (days - 1)) * (W - 2 * PAD);

    // where + when, one quiet line
    panel.append(this.h('p', { class: 'timeline__where' },
      this.h('strong', { text: b.label }),
      this.h('span', { text: ` · ${b.hood} · ${fmtDate(b.window.start)} – ${fmtDate(b.window.end)}, 2026` })));

    const grid = this.h('div', { class: 'tl' });

    // ---- row 1: 311 complaints, one dot per case, stacked per day ----
    const perDay = new Map();
    for (const c of b.cases) perDay.set(c.d, (perDay.get(c.d) || 0) + 1);
    const maxStack = Math.max(1, ...perDay.values());
    const H1 = 8 + maxStack * CASE_STEP;
    const strip1 = svg(W, H1, 'tl__strip tl__strip--cases');
    this._caseDots = [];
    const seen = new Map();
    for (const c of b.cases) {
      const k = seen.get(c.d) || 0;
      seen.set(c.d, k + 1);
      const dot = circle(x(c.d), H1 - CASE_R - 1 - k * CASE_STEP, CASE_R, 'tl__case');
      dot.dataset.t = String(dayIndex(c.d, b.window.start));
      strip1.append(dot);
      this._caseDots.push(dot);
    }
    grid.append(this.h('div', { class: 'tl__label tl__label--cases' },
      this.h('strong', { text: sum.cases.toLocaleString() }),
      this.h('span', { text: `311 complaints, on ${sum.case_days} days` })), strip1);

    // ---- row 2: staff visit-days, colored by the worst rating that day ----
    const strip2 = svg(W, H_VISITS, 'tl__strip tl__strip--visits');
    this._visitDots = [];
    for (const v of b.visits) {
      const dot = circle(x(v.d), H_VISITS / 2, VISIT_R, `tl__visit tl__visit--${LEVEL[v.lv] || 'issue'}`);
      dot.dataset.t = String(dayIndex(v.d, b.window.start));
      const t = document.createElementNS(NS, 'title');
      t.textContent = `${fmtDate(v.d)}: ${v.n} photo${v.n === 1 ? '' : 's'}, ${LEVEL_TEXT[v.lv]}`;
      dot.append(t);
      strip2.append(dot);
      this._visitDots.push(dot);
    }
    const cleanNum = this.h('strong', { class: 'tl__num', text: '0' });
    cleanNum.dataset.to = String(sum.clean_days);
    this._cleanNum = cleanNum;
    grid.append(this.h('div', { class: 'tl__label tl__label--visits' },
      this.h('span', { class: 'tl__frac' }, cleanNum, this.h('span', { class: 'tl__of', text: `of ${sum.visit_days}` })),
      this.h('span', { text: 'staff visits found nothing wrong' })), strip2);

    // ---- axis: month ticks ----
    const axis = svg(W, 30, 'tl__axis');
    const start = new Date(b.window.start + 'T12:00:00Z'), end = new Date(b.window.end + 'T12:00:00Z');
    for (let d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1, 12)); d <= end;
         d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1, 12))) {
      const tx = x(d.toISOString().slice(0, 10));
      const tick = document.createElementNS(NS, 'line');
      tick.setAttribute('x1', tx); tick.setAttribute('x2', tx); tick.setAttribute('y1', 0); tick.setAttribute('y2', 8);
      tick.setAttribute('class', 'tl__tick');
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', tx); t.setAttribute('y', 27); t.setAttribute('class', 'tl__month');
      t.textContent = MONTHS[d.getUTCMonth()];
      axis.append(tick, t);
    }
    grid.append(this.h('div'), axis);
    panel.append(grid);

    panel.append(this.h('p', { class: 'tl__legend' },
      key('case', '311 complaint'), key('clean', 'visit: nothing wrong'), key('issue', 'something rated 1'), key('severe', 'rated 2+')));

    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));
    if (s.foot) panel.append(this.h('p', { class: 'timeline__foot', text: s.foot }));
    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    motion.play('fade-up', this._panel);
    const b = this._block;
    if (!b) return;
    // pin the block on the shell map (the camera swing was applied before activate())
    const map = document.querySelector('condition-map');
    data.loadMap().then(() => {
      if (!this.hasAttribute('active')) return;
      const hx = data.mapHexes().find((h) => h.h3 === b.h3);
      if (hx && map) map.pinAt(hx.x, hx.y);
    }).catch(() => {});

    if (motion.prefersReducedMotion()) {
      motion.play('count-up', this._cleanNum, { to: Number(this._cleanNum.dataset.to) });
      return;
    }
    // choreography: complaints pile up in date order (~1.6s), then the visits land on the same
    // clock, then "12 of 15" flips up. Delays scale with the day index — one clock, two rows.
    const CLOCK = 1600 / 130;                                   // ms per day
    const pop = (el, delay, dur = 320) => el.animate(
      [{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'none' }],
      { duration: dur, delay, easing: 'cubic-bezier(.22,1.2,.36,1)', fill: 'backwards' });
    for (const d of this._caseDots) pop(d, 250 + Number(d.dataset.t) * CLOCK);
    const VIS0 = 250 + 1600 + 400;
    for (const d of this._visitDots) pop(d, VIS0 + Number(d.dataset.t) * CLOCK * 0.6, 420);
    this._t = setTimeout(() => {
      this._t = null;
      motion.play('count-up', this._cleanNum, { to: Number(this._cleanNum.dataset.to) });
    }, VIS0 + 1300);
  }

  onExit() {
    if (this._t) { clearTimeout(this._t); this._t = null; }
    return motion.play('fade-out', this);
  }
}

function svg(w, h, cls) {
  const el = document.createElementNS(NS, 'svg');
  el.setAttribute('viewBox', `0 0 ${w} ${h}`);
  el.setAttribute('class', cls);
  el.style.aspectRatio = `${w} / ${h}`;
  el.setAttribute('aria-hidden', 'true');
  return el;
}
function circle(cx, cy, r, cls) {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', cx.toFixed(1)); c.setAttribute('cy', cy); c.setAttribute('r', r);
  c.setAttribute('class', cls);
  return c;
}
function key(kind, text) {
  const k = document.createElement('span');
  k.className = `tl__key tl__key--${kind}`;
  k.textContent = text;
  return k;
}
const fmtDate = (iso) => {
  const d = new Date(iso + 'T12:00:00Z');
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
};

customElements.define('card-timeline', TimelineCard);
