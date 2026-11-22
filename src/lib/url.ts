import type { Product } from './types';

/** Absolute site path. Respects Astro's `base` (empty by default, the site lives at the domain root). */
export const href = (path = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

export const productHref = (p: Pick<Product, 'id'>) => href(`product/${p.id}/`);

export const marketHref = (query: Record<string, string> = {}) => {
  const q = new URLSearchParams(query).toString();
  return href('marketplace/') + (q ? `?${q}` : '');
};
