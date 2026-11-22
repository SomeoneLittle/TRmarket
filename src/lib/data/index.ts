/**
 * Data access layer. Pages and components read products, categories and posts
 * ONLY through these functions. They currently read placeholder data from ./fake;
 * stage 2 swaps the bodies for Sanity queries without touching any page.
 */
import type { Category, CategoryInfo, Details, Post, Product, Subcategory } from '../types';
import { fakeProducts } from './fake/products';
import { fakePosts } from './fake/posts';
import { fakeDetails } from './fake/details';
import { fakeCategories, subcategories } from './fake/taxonomy';

export async function getProducts(): Promise<Product[]> {
  return fakeProducts;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return fakeProducts.find((p) => p.id === slug);
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  return slugs.map((s) => fakeProducts.find((p) => p.id === s)).filter((p): p is Product => Boolean(p));
}

export async function getFreeProducts(): Promise<Product[]> {
  return fakeProducts.filter((p) => p.price === 0);
}

/** Products ordered by downloads. Paid only unless `includeFree` is set. */
export async function getPopularProducts(limit = 8, { includeFree = false } = {}): Promise<Product[]> {
  return fakeProducts
    .filter((p) => includeFree || p.price > 0)
    .slice().sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}

/** Paid products ordered by rating. */
export async function getTopRatedProducts(limit = 4): Promise<Product[]> {
  return fakeProducts
    .filter((p) => p.price > 0)
    .slice().sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/** Products added within the last `maxHours`, newest first. */
export async function getFreshProducts(maxHours = 30): Promise<Product[]> {
  return fakeProducts.filter((p) => p.addedHours <= maxHours).slice().sort((a, b) => a.addedHours - b.addedHours);
}

/** Same-category products first, then the rest. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const others = fakeProducts.filter((p) => p.id !== product.id);
  return [...others.filter((p) => p.category === product.category), ...others.filter((p) => p.category !== product.category)].slice(0, limit);
}

export async function getCategories(): Promise<CategoryInfo[]> {
  return fakeCategories.map((c) => ({ ...c, count: fakeProducts.filter((p) => p.category === c.id).length }));
}

export async function getSubcategories(category: Category): Promise<Subcategory[]> {
  return subcategories[category];
}

export async function getProductDetails(product: Product): Promise<Details> {
  return fakeDetails(product);
}

/** Posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  return fakePosts;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return fakePosts.find((p) => p.slug === slug);
}
