// Client-side state for the demo: cart, favorites, the signed-in user and purchases.
// Everything lives in localStorage; there is no backend.

export type Lic = 'personal' | 'commercial';
export interface CartItem {
  id: string;
  lic: Lic;
}
export interface User {
  name: string;
  email: string;
}
export interface Owned {
  id: string;
  lic: Lic;
  date: string;
  key: string;
}
export interface P {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  category: string;
  kind: string;
  formats: string[];
  rating: number;
  reviews: number;
  downloads: number;
  blurb: string;
  href: string;
}

const KEY = { cart: 'trm.cart', fav: 'trm.fav', user: 'trm.user', owned: 'trm.owned' };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage can be blocked; the page still works for this visit */
  }
  window.dispatchEvent(new CustomEvent('trm:change'));
}

export const base = () => document.querySelector<HTMLMetaElement>('meta[name="trm-base"]')?.content ?? '/';
export const url = (path = '') => `${base().replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

let cache: P[] | null = null;
export const catalog = (): P[] => {
  if (!cache) cache = JSON.parse(document.getElementById('trm-products')?.textContent || '[]');
  return cache!;
};
export const findProduct = (id: string) => catalog().find((p) => p.id === id);

export const money = (n: number) => (n === 0 ? 'Free' : `$${Number.isInteger(n) ? n : n.toFixed(2)}`);
export const unitPrice = (p: P, lic: Lic) => (lic === 'commercial' ? p.price * 2 : p.price);

// Cart
export const getCart = () => read<CartItem[]>(KEY.cart, []);
export const inCart = (id: string) => getCart().some((i) => i.id === id);
export function addToCart(id: string, lic: Lic = 'personal') {
  const cart = getCart().filter((i) => i.id !== id);
  cart.push({ id, lic });
  write(KEY.cart, cart);
}
export function setLicence(id: string, lic: Lic) {
  write(KEY.cart, getCart().map((i) => (i.id === id ? { ...i, lic } : i)));
}
export const removeFromCart = (id: string) => write(KEY.cart, getCart().filter((i) => i.id !== id));
export const clearCart = () => write(KEY.cart, []);

export const PROMO_CODE = 'TR10';
export const getPromo = () => (sessionStorage.getItem('trm.promo') === PROMO_CODE ? PROMO_CODE : '');
export function setPromo(code: string) {
  try {
    if (code) sessionStorage.setItem('trm.promo', code);
    else sessionStorage.removeItem('trm.promo');
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent('trm:change'));
}
export function cartTotals() {
  const lines = getCart()
    .map((i) => ({ item: i, p: findProduct(i.id) }))
    .filter((l): l is { item: CartItem; p: P } => !!l.p);
  const subtotal = lines.reduce((s, l) => s + unitPrice(l.p, l.item.lic), 0);
  const discount = getPromo() ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  return { lines, subtotal, discount, total: subtotal - discount };
}

// Favorites
export const getFav = () => read<string[]>(KEY.fav, []);
export const isFav = (id: string) => getFav().includes(id);
export function toggleFav(id: string) {
  const list = getFav();
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  write(KEY.fav, next);
  return next.includes(id);
}

// User and purchases
export const getUser = () => read<User | null>(KEY.user, null);
export const getOwned = () => read<Owned[]>(KEY.owned, []);
const makeKey = () =>
  Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 6).toUpperCase()).join('-');
const today = (offset = 0) => {
  const d = new Date(Date.now() - offset * 86400000);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
export function login(user: User) {
  write(KEY.user, user);
  if (getOwned().length === 0 && !localStorage.getItem('trm.seeded')) {
    // First sign-in: seed a small library so the account pages are not empty.
    try {
      localStorage.setItem('trm.seeded', '1');
    } catch {
      /* ignore */
    }
    write(KEY.owned, [
      { id: 'aeon-vase-collection', lic: 'personal', date: today(21), key: makeKey() },
      { id: 'pivot-snapper', lic: 'personal', date: today(9), key: makeKey() },
    ]);
  }
}
export const logout = () => write(KEY.user, null);
export const updateUser = (u: User) => write(KEY.user, u);
export function addOwned(items: CartItem[]) {
  const owned = getOwned();
  for (const i of items) {
    if (!owned.some((o) => o.id === i.id)) owned.unshift({ id: i.id, lic: i.lic, date: today(), key: makeKey() });
  }
  write(KEY.owned, owned);
}
