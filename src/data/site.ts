import { href, marketHref } from './products';

export const mainNav = [
  { label: 'Marketplace', href: href('marketplace/'), id: 'marketplace' },
  { label: 'Blog', href: href('blog/'), id: 'blog' },
];

export const footerColumns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Catalog', href: href('marketplace/') },
      { label: '3D models for printing', href: marketHref({ cat: 'print' }) },
      { label: '3D models for games', href: marketHref({ cat: 'game' }) },
      { label: 'Tools & add-ons', href: marketHref({ cat: 'tool' }) },
      { label: 'Free downloads', href: marketHref({ price: 'free' }) },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Blog', href: href('blog/') },
      { label: 'Contacts', href: href('contacts/') },
      { label: 'Help centre', href: href('help/') },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy policy', href: href('privacy/') },
      { label: 'Terms of sale (offer)', href: href('terms/') },
      { label: 'Licences', href: href('licenses/') },
      { label: 'Refunds & returns', href: href('refunds/') },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My account', href: href('account/') },
      { label: 'My purchases', href: href('account/purchases/') },
      { label: 'Favorites', href: href('account/favorites/') },
      { label: 'Cart', href: href('cart/') },
    ],
  },
];

export const socials = [
  { label: 'YouTube', href: '#' },
  { label: 'Discord', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'X', href: '#' },
];

export const company = {
  legal: 'Sole proprietor Full Name',
  reg: 'Reg. No. 000 000 000',
  tax: 'Tax ID 0000000000',
  address: '00 Placeholder St., City, Country',
  email: 'hello@example.com',
};
