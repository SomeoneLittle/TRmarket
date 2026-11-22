// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  // Public origin, used for canonical and Open Graph URLs. Update when the real URL is known.
  site: 'https://someonelittle.github.io',
  trailingSlash: 'always',
  // Pages are prerendered for now. Routes that need a server (account, cart API, webhooks)
  // opt in later with `export const prerender = false`.
  adapter: cloudflare({ imageService: 'passthrough' }),
  // Sessions will come from Better Auth + D1 (stage 3), so no KV session store is provisioned.
  session: false,
});
