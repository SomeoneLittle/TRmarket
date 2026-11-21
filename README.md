# TRmarket

Design mockups for the TRmarket homepage: a personal marketplace for 3D models and 3D-modeling tools.
Built with [Astro](https://astro.build), deployed to GitHub Pages.

Live: https://someonelittle.github.io/TRmarket/

| Page | Concept |
| --- | --- |
| `/` | Neutral hub linking to the mockups |
| `/mockup-1/` | Slicer: brutalist print shop, hero printed layer by layer |
| `/mockup-2/` | Viewport: dark 3D-editor UI with wireframes and axis colors |
| `/mockup-3/` | Clay: warm tactile studio, soft materials, products on shelves |

Only `src/data/products.ts` and the hub are shared. Each mockup keeps its own components and styles in
`src/components/mockup-N/`.

## Commands

```sh
npm install
npm run dev      # http://localhost:4321/TRmarket/
npm run build
```
