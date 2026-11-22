import type { Category, CategoryInfo, Subcategory } from '../../types';

export const subcategories: Record<Category, Subcategory[]> = {
  print: [
    { id: 'decor', name: 'Home & decor' },
    { id: 'tabletop', name: 'Tabletop & chess' },
    { id: 'organizers', name: 'Organizers' },
    { id: 'planters', name: 'Planters & vases' },
  ],
  game: [
    { id: 'armor', name: 'Characters & armor' },
    { id: 'environment', name: 'Environment kits' },
    { id: 'props', name: 'Props' },
    { id: 'nature', name: 'Trees & nature' },
  ],
  tool: [
    { id: 'brushes', name: 'Sculpting brushes' },
    { id: 'addons', name: 'Blender add-ons' },
    { id: 'presets', name: 'Hard-surface presets' },
    { id: 'scripts', name: 'Scripts' },
  ],
};

export const fakeCategories: Omit<CategoryInfo, 'count'>[] = [
  { id: 'print', name: '3D models for printing', blurb: 'Tested, tolerance-checked, ready to slice.' },
  { id: 'game', name: '3D models for games', blurb: 'Clean topology, PBR textures and LODs.' },
  { id: 'tool', name: 'Tools', blurb: 'Add-ons, brushes, scripts and presets.' },
];
