// Card 0 — Overture. Establishes the premise: two records of the same streets, one city, one window.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

class OvertureCard extends CardBase {
  render() {
    const h = this.spec;
    const d = data.headline();
    this.classList.add('overture');

    this._nums = [];
    const stat = (value, label, sub) => {
      const num = this.h('span', { class: 'stat__num' });
      num.dataset.to = String(value);
      num.textContent = '0';
      this._nums.push(num);
      return this.h('li', { class: 'stat' },
        num,
        this.h('span', { class: 'stat__label', text: label }),
        this.h('span', { class: 'stat__sub', text: sub }),
      );
    };

    this._header = this.h('div', { class: 'overture__head' },
      this.h('p', { class: 'kicker', text: h.kicker || 'SF Street Conditions' }),
      this.h('h1', { class: 'display', text: h.title || 'Two ways to see a street' }),
    );

    if (h.questions?.length) {
      // v2 layout: QUESTIONS are the primary content, numbers a compact strip below.
      this.classList.add('overture--compact');
      this._questions = this.h('ol', { class: 'overture__questions' },
        ...h.questions.map((q) => this.h('li', { text: q })));
      this._stats = this.h('ul', { class: 'stats', role: 'list' },
        stat(d.scPhotos, 'street photos', 'AI-analyzed'),
        stat(d.reports311, 'public complaints', 'SF 311'),
      );
      this._foot = this.h('p', { class: 'overture__foot', text: h.foot ||
        'The city keeps two records of its own streets.' });
      this._win = this.h('p', { class: 'stat__sub', text: `${d.windowStart} → ${d.windowEnd}` });
      this.append(this._header, this._questions, this._foot, this._stats, this._win);
      return;
    }

    // v1 layout: two big count-ups lead — the piece is about the snapshots.
    // Photos lead — this piece is about the streetconditions snapshots.
    this._stats = this.h('ul', { class: 'stats', role: 'list' },
      stat(d.scPhotos, 'street photos', 'the snapshots — AI-analyzed, every block good or bad'),
      stat(d.reports311, 'public complaints', 'SF 311 — problems the public reported'),
    );

    this._foot = this.h('p', { class: 'overture__foot', text: h.foot ||
      'One logs complaints. The other photographs everything.' });
    this._win = this.h('p', { class: 'stat__sub', text: `${d.windowStart} → ${d.windowEnd}` });

    this.append(this._header, this._stats, this._foot, this._win);
  }

  onEnter() {
    motion.play('fade-up', this._header);
    motion.play('fly-in-stagger', this._stats);
    this._nums.forEach((n) => motion.play('count-up', n, { to: Number(n.dataset.to) }));
    motion.play('fade-up', this._foot);
    if (this._questions) motion.play('fly-in-stagger', this._questions);
  }
}

customElements.define('card-overture', OvertureCard);
