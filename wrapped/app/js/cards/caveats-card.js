// Caveats — the honesty card. A quiet, light "bone" breather (no dark panel; dark text straight on
// the flood, like the Overture) after the saturated map cards. Folds in the creator's research
// questions by naming what the data can and can't answer (over-time / time-of-day = no; 311-vs-photos
// = yes, that's the divergence cards). Every claim here mirrors plan.md's honesty rules.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

class CaveatsCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('caveats');
    const d = data.headline();

    this._head = this.h('div', { class: 'caveats__head' },
      this.h('p', { class: 'kicker', text: s.kicker || 'Before you go' }),
      this.h('h2', { class: 'display', text: s.title || 'What this can and can’t tell you' }));

    const ITEMS = [
      ['One window', `Both records cover the same span — ${d.windowStart} to ${d.windowEnd}.`],
      ['An AI, not a person', 'The Snapshots are photos scored by a model. Never “staff think X” — only “the model scored X.”'],
      ['Coverage isn’t conditions', 'The photos are downtown-dense and uneven. A tall column means where the camera looked, not where it’s worst.'],
      ['Complaints measure who complains', '311 over-counts the neighborhoods that call and under-counts the under-resourced ones.'],
      ['What it can’t answer', 'A block over time, or by time of day — the photo timing drifts with batch uploads and is too sparse to trust.'],
      ['Both are partial', 'Two reporting instruments, not ground truth. Where they disagree is the story.'],
    ];
    this._list = this.h('ul', { class: 'caveats__list', role: 'list' });
    for (const [lead, text] of ITEMS) {
      this._list.append(this.h('li', { class: 'caveats__item' },
        this.h('strong', { text: lead + '. ' }), this.h('span', { text })));
    }

    this.append(this._head, this._list);
  }

  onEnter() {
    motion.play('fade-up', this._head);
    motion.play('fly-in-stagger', this._list);
  }
}

customElements.define('card-caveats', CaveatsCard);
