// Shared scale for BOTH hexbin engines. Height mapping + domain are identical (fair comparison);
// only the COLOR ramp differs by engine, and for a good reason: the flat SVG columns sit unlit on
// the maroon flood, so mid-orange muddies into the red — they use a higher-contrast GOLD/amber ramp
// (light-end 8.08:1 vs surface). The WebGL columns are 3D-shaded by deck's material, which already
// separates the mids, so they keep the ORANGE ramp. Both ramps are single-hue sequential and pass
// the dataviz ordinal validator against the card's maroon surface. Severity = magnitude → sequential,
// never a green→red rainbow.

// WebGL (lit): orange, dim → hot. Top kept saturated (not pale) so deck's diffuse lighting doesn't
// wash the tallest columns to white.
export const RAMP = ['#7d3a1e', '#a8501b', '#cd6321', '#e2703f', '#f5854a'];
// SVG (flat on maroon): gold/amber, more yellow → more separation from the red flood.
export const RAMP_SVG = ['#6b4a16', '#9c6f1c', '#cf9a24', '#ebc24e', '#ffe38f'];

// Zero-severe cells: a faint cool baseline that reads as "camera looked here, found it calm" —
// the 71% Excellent is the point, so the calm is drawn, not hidden.
export const CALM = '#3a4b57';

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2css = ([r, g, b]) => `rgb(${r | 0},${g | 0},${b | 0})`;
const toRGB = (ramp) => ramp.map(hex2rgb);
const RAMP_RGB = toRGB(RAMP), RAMP_SVG_RGB = toRGB(RAMP_SVG);

// Continuous sample of a ramp at t in [0,1].
function rampAt(rgb, t) {
  t = Math.max(0, Math.min(1, t));
  const seg = t * (rgb.length - 1);
  const i = Math.min(rgb.length - 2, Math.floor(seg));
  const f = seg - i;
  const a = rgb[i], b = rgb[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

// gamma < 1 lifts the low end so the many small-severe cells stay visible against the dominant few.
// Domain max is FIXED (with-observer max) so toggling the observer OFF visibly shrinks the columns.
const shape = (v, max) => Math.pow(v / max, 0.6);

// SVG (flat) — gold ramp, CSS color string.
export function colorForSVG(v, max) {
  return v <= 0 ? CALM : rgb2css(rampAt(RAMP_SVG_RGB, shape(v, max)));
}

// Normalized height in [0,1] for the elevation encoding (engines scale to their own units).
export function heightFrac(v, max) {
  return v <= 0 ? 0 : Math.pow(v / max, 0.75);   // slightly compress the tall end
}

// WebGL (lit) — orange ramp, [r,g,b,a] 0–255.
export function colorRGBA(v, max, alpha = 235) {
  if (v <= 0) { const [r, g, b] = hex2rgb(CALM); return [r, g, b, 90]; }
  const [r, g, b] = rampAt(RAMP_RGB, shape(v, max));
  return [r | 0, g | 0, b | 0, alpha];
}
