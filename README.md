# TRmarket

A marketplace for 3D models (for printing and for games) and 3D-modeling tools: brushes, add-ons, scripts and presets.
This repository holds the front end, built with [Astro](https://astro.build) and deployed to GitHub Pages.
There is no backend yet: cart, favorites, sign-in and purchases are stored in the browser (localStorage) so the whole
flow can be clicked through.

Live: https://someonelittle.github.io/TRmarket/

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

- `src/data/` — products, blog posts, site navigation. Single source of truth for all content.
- `src/components/` — reusable blocks used in several places: `ProductCard`, `ProductRow`, `FreeCard`, `CategoryTile`,
  `PostCard`, `CartLine`, `PurchaseRow`, `OrderSummary`, `SectionHead`, `Breadcrumbs`, `Stars`, `Art` (procedural previews).
- `src/layouts/Layout.astro` — page shell with header, footer, toast and quick-view dialog.
- `src/scripts/` — small client scripts (store, cart, lists). No UI framework.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321/TRmarket/
npm run build
```

Internal links are built with `import.meta.env.BASE_URL`, so the site works under the `/TRmarket` base path.
