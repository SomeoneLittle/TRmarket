/** Site-wide SEO defaults and URL helpers used by Layout. */
export const site = {
  name: 'TRmarket',
  description: '3D models for printing and games, plus tools for modeling and sculpting.',
  /** Default social preview image, relative to the site root. */
  ogImage: '/og-default.svg',
};

interface Ctx {
  url: URL;
  site?: URL;
}

/** Resolves canonical and image URLs to absolute ones using the configured `site`. */
export function seoMeta(Astro: Ctx, o: { title: string; description: string; image: string; canonical?: string }) {
  const origin = Astro.site ?? Astro.url;
  const abs = (p: string) => (p.startsWith('http://') || p.startsWith('https://') ? p : new URL(p, origin).href);
  return {
    canonical: abs(o.canonical ?? Astro.url.pathname),
    image: abs(o.image),
  };
}
