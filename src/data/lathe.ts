import { PROFILES, type ProfileName } from './products';

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
