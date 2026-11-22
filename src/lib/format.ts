import type { Category } from './types';

export const formatPrice = (price: number) => (price === 0 ? 'Free' : `$${price}`);

export const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export const formatAdded = (hours: number) =>
  hours < 24 ? `${hours} h ago` : hours < 48 ? 'Yesterday' : `${Math.round(hours / 24)} days ago`;

export const categoryName = (c: Category) => (c === 'print' ? 'Print' : c === 'game' ? 'Game' : 'Tool');
