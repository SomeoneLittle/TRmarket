import type { ProfileName } from './lathe';

export type Category = 'print' | 'game' | 'tool';
export type { ProfileName };

export interface Subcategory {
  id: string;
  name: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  blurb: string;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
  /** Subcategory id, see Subcategory. */
  sub: string;
  kind: string;
  blurb: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  downloads: number;
  /** Hours since the product was added. */
  addedHours: number;
  formats: string[];
  spec: string;
  profile: ProfileName;
  /** Index into each theme's own accent palette (0..3). */
  tone: 0 | 1 | 2 | 3;
}

export type PostTag = 'Tutorials' | 'Releases' | 'Behind the scenes';

export type Block =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  tag: PostTag;
  date: string;
  readMin: number;
  /** Product used as the cover and as the "mentioned" product. */
  productId: string;
  related: string[];
  body: Block[];
}

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
