// Divergence follow-up beat — "exactly how they disagree," one direction per card.
// mode 'loud'  → complaints ≫ observed severe (public over-reports here). Shows both shares.
// mode 'quiet' → low complaint share despite genuinely-bad conditions (311 UNDER-reports here).
//   Framed as complaint bias, NOT "the Sweep proved it" (Sweep-severe is observer-confounded).
// Each card carries the hood's live 311 query link (built-in provenance / go-deeper).
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

class DivergenceCard extends CardBase {
  render() {
    const s = this.spec;
    const d = data.divergence(s.hood);
    this._d = d;
    this.classList.add('beat');
    if (s.align) this.dataset.align = s.align;

    const panel = this.h('div', { class: 'panel divergence' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || 'Where they disagree' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || d.hood }));

    // the numbers, as labeled rows (count-up on enter)
    this._nums = [];
    const row = (pct, label, tone) => {
      const num = this.h('span', { class: 'stat__num divergence__pct' });
      num.dataset.to = String(pct);
      num.textContent = '0%';
      this._nums.push(num);
      return this.h('p', { class: `divergence__row divergence__row--${tone}` },
        num, this.h('span', { class: 'stat__label', text: label }));
    };

    if (s.mode === 'loud') {
      panel.append(row(d.complaintShare, 'of all 311 complaints', 'crowd'));
      panel.append(row(d.severeShare, 'of what the snapshots flagged', 'camera'));
    } else {
      // quiet: lead with the low complaint share; the contrast is with reality, not our Sweep count
      panel.append(row(d.complaintShare, 'of all 311 complaints — among the lowest', 'crowd'));
    }

    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));

    if (d.queryUrl) {
      panel.append(this.h('a', { class: 'divergence__link', href: d.queryUrl,
        target: '_blank', rel: 'noopener', 'data-no-advance': '',
        text: (s.linkText || `See ${d.hood}’s 311 reports`) + ' ↗' }));
    }

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    motion.play('fade-up', this._panel);
    this._nums.forEach((n) => motion.play('count-up', n, {
      to: Number(n.dataset.to),
      format: (v) => `${v.toFixed(1)}%`,
    }));
  }
}

customElements.define('card-divergence', DivergenceCard);
