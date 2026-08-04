// Seam #4 — motion-preset registry. Cards declare INTENT (data-anim="fade-up"); this maps
// intent → a Web Animations API timeline. Reskin all motion by editing presets here, never
// card markup. Reduced-motion-aware: presets snap to the final state instead of animating.
//
// Built on native WAAPI (zero dependency, per web-dev §1). If orchestration ergonomics ever
// demand it, Motion One can be swapped in behind this same `play()` API — cards won't know.

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

const tok = (name, fallback) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

const ms = (v) => parseFloat(v) * (v.trim().endsWith('ms') ? 1 : 1000);
const dur = () => ms(tok('--dur', '520ms'));
const durSlow = () => ms(tok('--dur-slow', '900ms'));
const durCount = () => ms(tok('--dur-count', '620ms'));
const easeOut = () => tok('--ease-out', 'cubic-bezier(.16,1,.3,1)');
const easeBack = () => tok('--ease-out-back', 'cubic-bezier(.22,1.2,.36,1)');

// Each preset: (el, opts) -> Animation | null. Must leave `el` in its final visual state.
const presets = {
  // Entrances use fill:'none' on purpose: the resting CSS state is already visible, so an entrance
  // that is interrupted, cancelled, or evaluated in its "before" phase (which a fast backward
  // re-activation can land in) falls back to VISIBLE — never stuck at the opacity-0 start keyframe.
  // (fill:'both' held that start keyframe → blank cards when navigating backward.)
  'fade-up'(el) {
    return el.animate(
      [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }],
      { duration: dur(), easing: easeOut(), fill: 'none' }
    );
  },

  // card exit — content lifts and fades while the map camera swings to the next card. fill:'forwards'
  // holds the faded-out state until the state machine removes [active] (display:none).
  'fade-out'(el) {
    return el.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-18px) scale(.98)' }],
      { duration: dur(), easing: easeOut(), fill: 'forwards' }
    );
  },

  // Stagger direct children (chips/pills flying in with a slight overshoot).
  'fly-in-stagger'(el, { selector = ':scope > *', step = 70 } = {}) {
    const kids = [...el.querySelectorAll(selector)];
    kids.forEach((k, i) => k.animate(
      [{ opacity: 0, transform: 'translateY(28px) scale(.96)' }, { opacity: 1, transform: 'none' }],
      { duration: dur(), delay: i * step, easing: easeBack(), fill: 'none' }
    ));
    return null;
  },

  // Count a number up. Exponential ease-out: races toward the value, then settles — reads as
  // a fast "flip" rather than a slow tick. opts.to required; opts.format optional.
  'count-up'(el, { to = 0, from = 0, format = (n) => Math.round(n).toLocaleString() } = {}) {
    const d = durCount();
    const t0 = performance.now();
    const ease = (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));   // expo-out
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / d);
      el.textContent = format(from + (to - from) * ease(p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return null;
  },
};

// Snap helpers for reduced motion — land on the final state with no animation.
const snaps = {
  'count-up'(el, { to = 0, format = (n) => Math.round(n).toLocaleString() } = {}) {
    el.textContent = format(to);
  },
  // default snap: nothing to do (CSS already has the element in its resting state)
};

export function play(name, el, opts = {}) {
  if (!el) return null;
  if (reduced.matches) { (snaps[name] || (() => {}))(el, opts); return null; }
  const fn = presets[name];
  return fn ? fn(el, opts) : null;
}

// Default enter: read the element's own data-anim and play it.
export function enter(el, opts = {}) {
  const name = el?.dataset?.anim;
  return name ? play(name, el, opts) : null;
}

export const prefersReducedMotion = () => reduced.matches;
