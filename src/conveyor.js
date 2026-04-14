import { SPREAD_X, CURVE_AMPLITUDE, ZONE_ENTER, ZONE_PEAK, ZONE_FADE, ZONE_EXIT } from "./config.js";

export function getConveyorPos(t) {
  return {
    x: (t - 0.5) * SPREAD_X,
    y: -Math.pow(t - 0.3, 2) * CURVE_AMPLITUDE,
  };
}

export function getConveyorScale(t) {
  return 0.6 + Math.sin(t * Math.PI) * 0.4;
}

export function computePopAmount(t) {
  if (t < ZONE_ENTER || t > ZONE_EXIT) return 0;
  if (t >= ZONE_PEAK && t <= ZONE_FADE) return 1;
  if (t < ZONE_PEAK) return smoothstep(ZONE_ENTER, ZONE_PEAK, t);
  return 1 - smoothstep(ZONE_FADE, ZONE_EXIT, t);
}

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
