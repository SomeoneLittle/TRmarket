# TRmarket

A marketplace for 3D models (for printing and for games) and 3D-modeling tools: brushes, add-ons, scripts and presets.
This repository holds the front end, built with [Astro](https://astro.build) and deployed to Cloudflare Workers.
There is no backend yet: cart, favorites, sign-in and purchases are stored in the browser (localStorage) so the whole
flow can be clicked through.

Live: https://trmarket.littlesomeonenotanyone.workers.dev

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: banner slider, free items, categories, popular products, new today |
| `/marketplace/` | Catalog with filters (category, subcategory, price, format, sale, rating), sorting, search, grid/list view. Filters live in the URL, e.g. `?cat=tool&price=free` |
| `/product/<id>/` | Product page: preview modes, licence choice, files, reviews, related products |
| `/cart/`, `/checkout/`, `/checkout/success/` | Cart with licences and promo code `TR10`, demo checkout (no payment), confirmation |
| `/account/` | Sign in / create account (any email and password work), overview |
| `/account/purchases/`, `/account/favorites/`, `/account/settings/` | Library with licence keys, saved items, profile |
| `/blog/`, `/blog/<slug>/` | Articles with table of contents and linked products |
| `/privacy/`, `/terms/`, `/licenses/`, `/refunds/`, `/contacts/`, `/help/` | Service pages |

## Structure

- `src/lib/data/` — **the data layer.** Pages and components read products, categories and posts only through the
  functions in `index.ts` (`getProducts()`, `getProductBySlug()`, `getCategories()`, `getPosts()`, ...). Today they
  read placeholder data from `src/lib/data/fake/`; stage 2 replaces the function bodies with Sanity queries.
- `src/lib/types.ts` — `Product`, `Category`, `Post` and related types.
- `src/lib/` — `format.ts` (price/count formatting), `url.ts` (`href()`, `productHref()`), `seo.ts`, `site.ts`
  (navigation, footer, company details), `lathe.ts` (procedural previews).
- `src/styles/tokens.css` — design tokens (colors, radii, spacing, shadows, motion). Use these variables, not raw values.
  `src/styles/global.css` holds base styles and the shared `.btn` class.
- `src/components/` — reusable blocks: `Button`, `Badge`, `Price`, `ProductCard`, `ProductRow`, `FreeCard`,
  `CategoryTile`, `PostCard`, `CartLine`, `Header`, `Footer`, `Stars`, `Art`, and others.
- `src/layouts/Layout.astro` — page shell with SEO props (`title`, `description`, `image`, `canonical`, `noindex`).
- `src/scripts/` — small client scripts (store, cart, lists). No UI framework.

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321/
npm run build    # outputs dist/client (assets) and dist/server (worker)
```

Requires Node 22.23.4 or newer.

## Deployment

Hosted on Cloudflare Workers (worker name `trmarket`, see `wrangler.jsonc`) through the `@astrojs/cloudflare` adapter.
Pages are prerendered; server routes can opt in later with `export const prerender = false`.

Deploys run from **Cloudflare Workers Builds**, connected to this repository:

- push to `main` — build and deploy to production (`npm run build`, `npx wrangler deploy`);
- push to any other branch or PR — preview build (`npx wrangler preview`), reachable at
  `https://<branch>-trmarket.littlesomeonenotanyone.workers.dev`.

Manual deploy: `npx wrangler login`, then `npm run build && npx wrangler deploy`.

### Tokens and secrets

- The Cloudflare build token (`trmarket build token`) lives in Cloudflare (Worker → Settings → Builds), not in GitHub.
- Build variable `NODE_VERSION=24` is set in the same place, for both Production and Previews Base.
- Future runtime secrets (auth, payments) go in the Worker's variables and secrets, never in the repository.

## Domain

Not connected yet. When a domain is bought, add it as a Custom Domain on the Worker (Settings → Domains & Routes)
and update `site` in `astro.config.mjs`.
