// Insight 2 — "a denominator changes the picture." Two stacked fractions, side by side:
// LEFT: 4/8 = 50% — the app can state a rate (real baked hex: 8 visits, 4 found waste).
// RIGHT: 34,714/? — 311's naked count; the ? breathes where a denominator would be.
// The unresolved fraction IS the argument. Labels via manifest leftLabel/rightLabel.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

// the worked example: one real hex from the bake (verified: n=8, n_severe=4)
const HEX_ID = '8a28308284affff';

class DenominatorCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'denominator');
    if (s.align) this.dataset.align = s.align;

    const hex = data.hexes?.().find((h) => h.h3 === HEX_ID) || {};
    const VISITS = hex.n || 8;
    const FOUND = hex.n_severe || 4;
    const b311 = data.hood('Mission')?.crowd?.total || 0;

    const panel = this.h('div', { class: 'panel denominator__panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || '' }));

    const row = this.h('div', { class: 'denominator__fraction' });

    // left: the app's resolvable fraction
    const left = this.h('div', { class: 'denominator__frac' });
    const topA = this.h('span', { class: 'denominator__num', text: '0' });
    topA.dataset.to = String(FOUND);
    const botA = this.h('span', { class: 'denominator__den', text: '0' });
    botA.dataset.to = String(VISITS);
    left.append(topA, this.h('span', { class: 'denominator__rule' }), botA);
    this._topA = topA; this._botA = botA;
    const result = this.h('span', { class: 'denominator__result', text: `= ${Math.round(100 * FOUND / VISITS)}%` });
    this._result = result;
    left.append(result);
    row.append(left);
    row.append(this.h('p', { class: 'denominator__label', text: s.leftLabel || 'the app can state a rate' }));

    // right: 311's naked count over a breathing ?
    const right = this.h('div', { class: 'denominator__frac' });
    const topB = this.h('span', { class: 'denominator__num', text: '0' });
    topB.dataset.to = String(b311);
    this._topB = topB;
    right.append(topB, this.h('span', { class: 'denominator__rule' }),
      this.h('span', { class: 'denominator__qmark', text: '?' }));
    row.append(right);
    row.append(this.h('p', { class: 'denominator__label', text: s.rightLabel || '311 can’t — no denominator' }));

    panel.append(row);
    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    motion.play('fade-up', this._panel);
    this._topA && motion.play('count-up', this._topA, { to: Number(this._topA.dataset.to) });
    this._botA && motion.play('count-up', this._botA, { to: Number(this._botA.dataset.to) });
    this._topB && motion.play('count-up', this._topB, { to: Number(this._topB.dataset.to) });
    // the result lands once the fraction settles
    if (this._result) {
      const a = this._result.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 500, delay: 1200, easing: 'ease-out', fill: 'forwards' });
      a.finished?.catch(() => {});
    }
  }
}

customElements.define('card-denominator', DenominatorCard);