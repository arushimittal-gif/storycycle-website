// ─────────────────────────────────────────────────────────────
// ONE wind signal for the Pacific film.
//
// Governing principle: every moving thing must have a visible
// physical cause — and they must all share one cause when wind
// blows. So foliage sway, dust drift, god-ray shimmer, stream
// ripple, mist creep, AND the camera all read from THIS function.
// Low amplitude: ferns nod, they don't thrash.
// ─────────────────────────────────────────────────────────────

export type Wind = { x: number; z: number; gust: number }

// Slow gust/lull with a wandering direction. `gust` is 0..1 (overall
// strength), `x`/`z` are the unit-ish direction scaled by strength.
export function windAt(t: number): Wind {
  const gust = Math.sin(t * 0.13) * 0.6 + Math.sin(t * 0.37 + 1.3) * 0.4 // -1..1 slow
  const dir = Math.sin(t * 0.05 + 0.7) * 0.6 + Math.cos(t * 0.09) * 0.4  // slow wander (radians-ish)
  const mag = 0.5 + gust * 0.5                                           // 0..1
  return { x: Math.cos(dir) * mag, z: Math.sin(dir) * mag, gust: mag }
}
