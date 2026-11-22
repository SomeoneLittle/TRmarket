/** Lathe profiles: 14 radii (0..1) from the bottom of an object to its top. */
export const PROFILES = {
  vase: [0.35, 0.5, 0.62, 0.7, 0.72, 0.66, 0.5, 0.36, 0.28, 0.26, 0.3, 0.4, 0.5, 0.55],
  pawn: [0.6, 0.58, 0.42, 0.3, 0.24, 0.2, 0.22, 0.34, 0.4, 0.36, 0.3, 0.22, 0.12, 0.02],
  planter: [0.45, 0.55, 0.65, 0.72, 0.78, 0.8, 0.8, 0.78, 0.74, 0.7, 0.68, 0.68, 0.7, 0.72],
  organizer: [0.7, 0.7, 0.62, 0.7, 0.7, 0.62, 0.7, 0.7, 0.62, 0.7, 0.7, 0.62, 0.7, 0.7],
  helmet: [0.5, 0.62, 0.7, 0.74, 0.76, 0.76, 0.74, 0.7, 0.62, 0.5, 0.36, 0.22, 0.1, 0.02],
  pine: [0.12, 0.12, 0.55, 0.42, 0.3, 0.5, 0.38, 0.26, 0.42, 0.3, 0.18, 0.3, 0.16, 0.02],
  mushroom: [0.3, 0.28, 0.24, 0.22, 0.22, 0.24, 0.5, 0.74, 0.84, 0.82, 0.7, 0.5, 0.28, 0.04],
  totem: [0.5, 0.5, 0.4, 0.4, 0.52, 0.5, 0.4, 0.4, 0.52, 0.5, 0.4, 0.4, 0.46, 0.3],
  brush: [0.18, 0.22, 0.26, 0.3, 0.32, 0.34, 0.3, 0.4, 0.4, 0.34, 0.28, 0.18, 0.08, 0.01],
  gem: [0.02, 0.18, 0.34, 0.5, 0.64, 0.76, 0.8, 0.72, 0.58, 0.42, 0.28, 0.16, 0.07, 0.01],
  panel: [0.8, 0.8, 0.66, 0.66, 0.54, 0.54, 0.42, 0.42, 0.3, 0.3, 0.2, 0.2, 0.1, 0.1],
  spool: [0.7, 0.7, 0.7, 0.3, 0.26, 0.26, 0.26, 0.26, 0.26, 0.3, 0.7, 0.7, 0.7, 0.66],
} as const;

export type ProfileName = keyof typeof PROFILES;

export interface LatheBand {
  d: string;
  /** Brightness factor from the surface slope (0..1.1). */
  light: number;
}

export interface Lathe {
  bands: LatheBand[];
  top: { cx: number; cy: number; rx: number; ry: number } | null;
  base: { cx: number; cy: number; rx: number; ry: number };
}

interface Options {
  cx?: number;
  base?: number;
  height?: number;
  radius?: number;
  tilt?: number;
}

/**
 * Turns a lathe profile into shaded, stacked ring bands that read as a studio render
 * of a 3D object seen slightly from above.
 */
export function lathe(profile: ProfileName, o: Options = {}): Lathe {
  const { cx = 120, base = 202, height = 150, radius = 84, tilt = 0.28 } = o;
  const prof = PROFILES[profile];
  const n = prof.length;
  const pts = prof.map((r, i) => ({ r: Math.max(r, 0.02) * radius, y: base - (i * height) / (n - 1) }));
  const dh = height / (n - 1);
  const f = (v: number) => v.toFixed(1);

  const bands: LatheBand[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const d =
      `M${f(cx + a.r)} ${f(a.y)}` +
      `A${f(a.r)} ${f(a.r * tilt)} 0 0 1 ${f(cx - a.r)} ${f(a.y)}` +
      `L${f(cx - b.r)} ${f(b.y)}` +
      `A${f(b.r)} ${f(b.r * tilt)} 0 0 0 ${f(cx + b.r)} ${f(b.y)}Z`;
    const dr = b.r - a.r;
    const len = Math.hypot(dh, dr);
    const nr = dh / len;
    const ny = -dr / len;
    const light = Math.min(1.1, 0.3 + 0.95 * Math.max(0, nr * 0.62 + ny * 0.66));
    bands.push({ d, light });
  }

  const t = pts[n - 1];
  return {
    bands,
    top: t.r > 7 ? { cx, cy: t.y, rx: t.r, ry: t.r * tilt } : null,
    base: { cx, cy: pts[0].y, rx: pts[0].r, ry: pts[0].r * tilt },
  };
}

/** Scales a #rrggbb colour by a brightness factor. */
export function shade(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c((n >> 16) & 255)} ${c((n >> 8) & 255)} ${c(n & 255)})`;
}

/** Small deterministic pseudo-random sequence for procedural previews. */
export function seeded(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
