import { seeded } from './lathe';
import type { Product } from './products';

export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

export interface Details {
  long: string[];
  features: string[];
  files: { name: string; size: string; kind: string }[];
  reviews: Review[];
  distribution: number[]; // share of 5,4,3,2,1 star reviews, in percent
  updated: string;
  version: string;
}

const names = ['Alex M.', 'Priya S.', 'Jonas K.', 'Mia T.', 'Diego R.', 'Hana O.', 'Lucas B.', 'Sofia V.'];
const reviewText = {
  print: [
    'Printed first try on a stock Ender and the surface came out clean. The supports-free orientation saved a lot of time.',
    'Tolerances are spot on. Parts snapped together without any sanding.',
    'Great set, and the 3MF profiles are a nice touch. Would love a few more colour variants.',
    'Looks far better than it has any right to at 0.2 mm layers. Friends keep asking where I got it.',
  ],
  game: [
    'Topology is clean and the LODs are actually usable. Dropped straight into Unreal with no fixes.',
    'The trim sheet is a lifesaver. Textures look great at 1080p and 4K.',
    'Good value. The Blender file has tidy collections and sensible names.',
    'Pivot points are right where I expected them. Saved me an afternoon.',
  ],
  tool: [
    'Works exactly as described. The defaults are good and the options are easy to find.',
    'Cut my retopo time in half. Worth every dollar, and updates arrive fast.',
    'Simple, quick and does not clutter the UI. The author answered my question within a day.',
    'Solid tool. I would like a few more presets, but I use it every single day.',
  ],
};

export function getDetails(p: Product): Details {
  const rnd = seeded(p.id);
  const kindWord = p.category === 'print' ? 'printable' : p.category === 'game' ? 'game-ready' : 'production-ready';

  const long =
    p.category === 'tool'
      ? [
          `${p.title} is a ${p.kind.toLowerCase()} built from my own daily workflow. ${p.blurb}`,
          'Everything ships with a short PDF guide and a set of example scenes, so you can see the settings in context before you use them on your own work. The tool does not touch your files unless you ask it to, and it never phones home.',
          'Updates are free for life. If something does not work in your setup, write to me and I will look at it personally.',
        ]
      : [
          `${p.title} is a ${kindWord} ${p.kind.toLowerCase()}. ${p.blurb}`,
          p.category === 'print'
            ? 'Every model was test-printed on a 0.4 mm nozzle in PLA and PETG. Wall thickness, overhang angles and tolerances are checked before release, and the pack includes ready-to-slice 3MF profiles for the most common printers.'
            : 'Every asset was imported into Blender, Unreal Engine and Unity before release. Naming, pivots and scale are consistent, and the texture sets follow a standard PBR workflow so they behave the same in any engine.',
          'You get the source files too, so you can remix, kitbash or re-texture. Updates are free for life.',
        ];

  const features =
    p.category === 'print'
      ? ['Supports-free orientation', 'Test-printed in PLA and PETG', 'Ready-to-slice 3MF profiles', 'Watertight, manifold meshes']
      : p.category === 'game'
        ? ['Clean quad topology', '4K PBR textures (albedo, normal, ORM)', 'LOD0–LOD2 included', 'Blender source file']
        : ['Works offline, no account needed', 'PDF guide and example scenes', 'Free updates for life', 'Tested on the last two major versions'];

  const sizeMb = (n: number) => `${n.toFixed(1)} MB`;
  const files = [
    ...p.formats.map((f) => ({ name: `${p.id}-${f.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.zip`, size: sizeMb(2 + rnd() * 60), kind: `${f} files` })),
    { name: 'guide.pdf', size: sizeMb(1 + rnd() * 6), kind: 'Documentation' },
    { name: 'licence.txt', size: '4 KB', kind: 'Licence' },
  ];

  const texts = reviewText[p.category];
  const reviews: Review[] = Array.from({ length: 4 }, (_, i) => ({
    name: names[Math.floor(rnd() * names.length)],
    rating: i === 3 ? 4 : 5,
    date: ['2 weeks ago', '1 month ago', '2 months ago', '3 months ago'][i],
    text: texts[i],
  }));

  const five = Math.round(40 + (p.rating - 4.4) * 100);
  const four = Math.round((100 - five) * 0.65);
  const three = Math.round((100 - five - four) * 0.6);
  const two = Math.round((100 - five - four - three) * 0.6);
  const distribution = [five, four, three, two, 100 - five - four - three - two];

  const months = ['Sep', 'Oct', 'Nov'];
  return {
    long,
    features,
    files,
    reviews,
    distribution,
    updated: `${1 + Math.floor(rnd() * 27)} ${months[Math.floor(rnd() * 3)]} 2026`,
    version: `1.${Math.floor(rnd() * 9)}.${Math.floor(rnd() * 5)}`,
  };
}
