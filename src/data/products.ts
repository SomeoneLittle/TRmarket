export type Category = 'print' | 'game' | 'tool';

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

export interface Product {
  id: string;
  title: string;
  category: Category;
  kind: string;
  blurb: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  downloads: number;
  /** Hours since the product was added. */
  addedHours: number;
  formats: string[];
  spec: string;
  profile: ProfileName;
  /** Index into each mockup's own accent palette (0..3). */
  tone: 0 | 1 | 2 | 3;
}

export const products: Product[] = [
  {
    id: 'aeon-vase-collection',
    title: 'Aeon Vase Collection',
    category: 'print',
    kind: 'Printable set',
    blurb: 'Six spiral-vase silhouettes tuned for 0.4 mm nozzles, no supports needed.',
    price: 14,
    rating: 4.9,
    reviews: 312,
    downloads: 8420,
    addedHours: 170,
    formats: ['STL', '3MF'],
    spec: '6 models · 0.2 mm layers',
    profile: 'vase',
    tone: 0,
  },
  {
    id: 'orbital-pawn-chess',
    title: 'Orbital Chess Set',
    category: 'print',
    kind: 'Printable set',
    blurb: 'A 32-piece lathe-turned chess set with interlocking bases and a folding board.',
    price: 19,
    oldPrice: 25,
    rating: 4.8,
    reviews: 187,
    downloads: 5310,
    addedHours: 96,
    formats: ['STL', 'STEP'],
    spec: '33 models · tolerance tested',
    profile: 'pawn',
    tone: 2,
  },
  {
    id: 'terra-planter-trio',
    title: 'Terra Planter Trio',
    category: 'print',
    kind: 'Free model',
    blurb: 'Three self-watering planters with a hidden reservoir. A gift from the shop.',
    price: 0,
    rating: 4.7,
    reviews: 954,
    downloads: 21300,
    addedHours: 400,
    formats: ['STL'],
    spec: '3 models · PLA friendly',
    profile: 'planter',
    tone: 1,
  },
  {
    id: 'gearbox-desk-organizer',
    title: 'Gearbox Desk Organizer',
    category: 'print',
    kind: 'Printable set',
    blurb: 'Stackable ribbed canisters for pens, bits and cables. Prints in under four hours.',
    price: 9,
    rating: 4.6,
    reviews: 143,
    downloads: 3980,
    addedHours: 5,
    formats: ['STL', '3MF'],
    spec: '4 models · 3 h 40 min',
    profile: 'organizer',
    tone: 3,
  },
  {
    id: 'sentinel-helmet-kit',
    title: 'Sentinel Helmet Kit',
    category: 'game',
    kind: 'Game-ready asset',
    blurb: 'Modular sci-fi helmet with 4K PBR textures, 3 LODs and a clean quad topology.',
    price: 24,
    oldPrice: 32,
    rating: 4.9,
    reviews: 268,
    downloads: 6120,
    addedHours: 26,
    formats: ['FBX', 'GLB', 'BLEND'],
    spec: '12k tris · 4K PBR',
    profile: 'helmet',
    tone: 1,
  },
  {
    id: 'low-poly-pine-pack',
    title: 'Low-Poly Pine Pack',
    category: 'game',
    kind: 'Free asset',
    blurb: 'Twelve stylized pines with wind-ready vertex colors. Fits any forest level.',
    price: 0,
    rating: 4.8,
    reviews: 1204,
    downloads: 34800,
    addedHours: 700,
    formats: ['FBX', 'GLB'],
    spec: '12 models · 300 tris each',
    profile: 'pine',
    tone: 2,
  },
  {
    id: 'mushroom-village-kit',
    title: 'Mushroom Village Kit',
    category: 'game',
    kind: 'Game-ready asset',
    blurb: 'Whimsical houses, bridges and props for cozy builders, with trim-sheet textures.',
    price: 17,
    rating: 4.7,
    reviews: 96,
    downloads: 2210,
    addedHours: 3,
    formats: ['FBX', 'GLB', 'UASSET'],
    spec: '48 props · trim sheet',
    profile: 'mushroom',
    tone: 0,
  },
  {
    id: 'ancient-totem-props',
    title: 'Ancient Totem Props',
    category: 'game',
    kind: 'Game-ready asset',
    blurb: 'Weathered carved totems in six variants with moss and snow material masks.',
    price: 12,
    rating: 4.5,
    reviews: 74,
    downloads: 1760,
    addedHours: 20,
    formats: ['FBX', 'BLEND'],
    spec: '6 models · material masks',
    profile: 'totem',
    tone: 3,
  },
  {
    id: 'claystroke-brush-set',
    title: 'ClayStroke Brush Set',
    category: 'tool',
    kind: 'Sculpting brushes',
    blurb: '48 sculpting brushes: soft clay, chisel cuts, skin pores and fabric folds.',
    price: 15,
    rating: 5.0,
    reviews: 421,
    downloads: 9870,
    addedHours: 60,
    formats: ['Blender', 'ZBrush'],
    spec: '48 brushes · alphas incl.',
    profile: 'brush',
    tone: 2,
  },
  {
    id: 'quad-remesh-pro',
    title: 'Quad Remesh Pro',
    category: 'tool',
    kind: 'Blender add-on',
    blurb: 'One-click clean quad topology with edge-flow guides and symmetry locks.',
    price: 29,
    oldPrice: 39,
    rating: 4.8,
    reviews: 233,
    downloads: 7340,
    addedHours: 140,
    formats: ['Blender 4.2+'],
    spec: 'Add-on · Python 3.11',
    profile: 'gem',
    tone: 1,
  },
  {
    id: 'panelizer-presets',
    title: 'Panelizer Presets',
    category: 'tool',
    kind: 'Hard-surface presets',
    blurb: 'Procedural panel lines, bolts and vents for hard-surface work. Fully non-destructive.',
    price: 22,
    rating: 4.7,
    reviews: 118,
    downloads: 2890,
    addedHours: 8,
    formats: ['Blender 4.2+'],
    spec: '120 presets · Geometry Nodes',
    profile: 'panel',
    tone: 3,
  },
  {
    id: 'pivot-snapper',
    title: 'Pivot Snapper',
    category: 'tool',
    kind: 'Free script',
    blurb: 'A tiny script that snaps origins to the base, center or any custom point.',
    price: 0,
    rating: 4.6,
    reviews: 538,
    downloads: 15900,
    addedHours: 300,
    formats: ['Blender', 'Maya'],
    spec: 'Script · MIT licence',
    profile: 'spool',
    tone: 0,
  },
];

export const categories: {
  id: Category;
  name: string;
  blurb: string;
  count: number;
}[] = [
  {
    id: 'print',
    name: '3D models for printing',
    blurb: 'Tested, tolerance-checked, ready to slice.',
    count: products.filter((p) => p.category === 'print').length,
  },
  {
    id: 'game',
    name: '3D models for games',
    blurb: 'Clean topology, PBR textures and LODs.',
    count: products.filter((p) => p.category === 'game').length,
  },
  {
    id: 'tool',
    name: 'Tools',
    blurb: 'Add-ons, brushes, scripts and presets.',
    count: products.filter((p) => p.category === 'tool').length,
  },
];

export const freeProducts = products.filter((p) => p.price === 0);
export const popularProducts = [...products]
  .filter((p) => p.price > 0)
  .sort((a, b) => b.downloads - a.downloads)
  .slice(0, 6);
export const freshProducts = [...products]
  .filter((p) => p.addedHours <= 30)
  .sort((a, b) => a.addedHours - b.addedHours);

export const formatPrice = (price: number) => (price === 0 ? 'Free' : `$${price}`);

export const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export const formatAdded = (hours: number) =>
  hours < 24 ? `${hours} h ago` : hours < 48 ? 'Yesterday' : `${Math.round(hours / 24)} days ago`;

export const categoryName = (c: Category) =>
  c === 'print' ? 'Print' : c === 'game' ? 'Game' : 'Tool';

/** Builds an absolute path that respects the configured base path. */
export const href = (path = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
