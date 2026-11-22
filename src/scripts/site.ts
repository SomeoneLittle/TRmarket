import {
  addToCart,
  catalog,
  findProduct,
  getCart,
  getFav,
  getUser,
  isFav,
  logout,
  money,
  toggleFav,
  url,
  type Lic,
} from './store';
import { toast } from './ui';
import { enhanceSelects } from './select';

enhanceSelects();

// --- Counters, favorites and the account link ---------------------------------------------------
function sync() {
  const cart = getCart().length;
  const fav = getFav().length;
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    el.textContent = String(cart);
    el.hidden = cart === 0;
  });
  document.querySelectorAll<HTMLElement>('[data-fav-count]').forEach((el) => {
    el.textContent = String(fav);
    el.hidden = fav === 0;
  });
  document.querySelectorAll<HTMLElement>('[data-fav]').forEach((el) => {
    el.setAttribute('aria-pressed', String(isFav(el.dataset.id!)));
  });
  const user = getUser();
  document.querySelectorAll<HTMLElement>('[data-user-name]').forEach((el) => {
    el.textContent = user ? user.name.split(' ')[0] : 'Account';
  });
}
const bump = (selector: string) =>
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  });

window.addEventListener('trm:change', sync);
window.addEventListener('storage', sync);
sync();

// --- Delegated clicks ----------------------------------------------------------------------------
document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;

  const add = t.closest<HTMLElement>('[data-add]');
  if (add) {
    e.preventDefault();
    const p = findProduct(add.dataset.id!);
    if (!p) return;
    const lic = (add.dataset.lic as Lic) || 'personal';
    addToCart(p.id, lic);
    bump('[data-cart-count]');
    toast(`${p.title} added to cart`, { label: 'View cart', href: url('cart/') });
    if (add.dataset.go) location.href = add.dataset.go.startsWith('http') ? add.dataset.go : url(add.dataset.go);
    return;
  }

  const fav = t.closest<HTMLElement>('[data-fav]');
  if (fav) {
    e.preventDefault();
    const on = toggleFav(fav.dataset.id!);
    const p = findProduct(fav.dataset.id!);
    toast(on ? `${p?.title ?? 'Item'} saved to favorites` : 'Removed from favorites', on ? { label: 'View favorites', href: url('account/favorites/') } : undefined);
    return;
  }

  const quick = t.closest<HTMLElement>('[data-quick]');
  if (quick) {
    e.preventDefault();
    openQuick(quick);
    return;
  }

  if (t.closest('[data-signout]')) {
    e.preventDefault();
    logout();
    toast('You have been signed out');
    setTimeout(() => (location.href = url('account/')), 500);
    return;
  }

  const copy = t.closest<HTMLElement>('[data-copy]');
  if (copy) {
    e.preventDefault();
    navigator.clipboard?.writeText(location.href).catch(() => {});
    toast('Link copied to clipboard');
  }
});

// --- Quick view dialog -----------------------------------------------------------------------------
const dialog = document.getElementById('quick') as HTMLDialogElement | null;
function openQuick(trigger: HTMLElement) {
  if (!dialog) return;
  const p = findProduct(trigger.dataset.id!);
  if (!p) return;
  const q = (s: string) => dialog.querySelector<HTMLElement>(s)!;
  q('[data-q-title]').textContent = p.title;
  q('[data-q-cat]').textContent = `${p.kind} · ${p.formats.join(', ')}`;
  q('[data-q-blurb]').textContent = p.blurb;
  q('[data-q-rating]').textContent = `${p.rating.toFixed(1)} (${p.reviews} reviews)`;
  q('[data-q-price]').textContent = money(p.price);
  q('[data-q-old]').textContent = p.oldPrice ? `$${p.oldPrice}` : '';
  (q('[data-q-link]') as HTMLAnchorElement).href = p.href;
  const add = q('[data-q-add]');
  add.dataset.id = p.id;
  q('[data-q-add-label]').textContent = p.price === 0 ? 'Get for free' : 'Add to cart';
  const art = trigger.closest('.card')?.querySelector('.thumb svg');
  q('[data-q-art]').replaceChildren(...(art ? [art.cloneNode(true)] : []));
  dialog.showModal();
}
dialog?.addEventListener('click', (e) => {
  if (e.target === dialog || (e.target as HTMLElement).closest('[data-q-close]')) dialog.close();
});
dialog?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('[data-q-add]')) dialog.close();
});

// --- Search suggestions ----------------------------------------------------------------------------
const search = document.querySelector<HTMLFormElement>('.search');
const input = search?.querySelector<HTMLInputElement>('input[name="q"]');
const list = document.getElementById('suggest');
if (search && input && list) {
  const render = () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 1) {
      list.hidden = true;
      return;
    }
    const hits = catalog()
      .filter((p) => `${p.title} ${p.kind} ${p.formats.join(' ')}`.toLowerCase().includes(q))
      .slice(0, 5);
    list.replaceChildren();
    for (const p of hits) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = p.href;
      const b = document.createElement('b');
      b.textContent = p.title;
      const s = document.createElement('span');
      s.textContent = `${p.kind} · ${money(p.price)}`;
      a.append(b, s);
      li.append(a);
      list.append(li);
    }
    const all = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'all';
    link.href = `${url('marketplace/')}?q=${encodeURIComponent(input.value.trim())}`;
    link.textContent = hits.length ? `See all results for “${input.value.trim()}”` : `No matches. Search the catalog for “${input.value.trim()}”`;
    all.append(link);
    list.append(all);
    list.hidden = false;
  };
  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  document.addEventListener('click', (e) => {
    if (!search.contains(e.target as Node)) list.hidden = true;
  });
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') list.hidden = true;
  });
}

// --- Newsletter forms --------------------------------------------------------------------------------
document.querySelectorAll<HTMLFormElement>('[data-newsletter]').forEach((form) =>
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const field = form.querySelector<HTMLInputElement>('input[type="email"]')!;
    if (!field.checkValidity()) {
      field.reportValidity();
      return;
    }
    toast(`Thanks! A confirmation was sent to ${field.value} (demo)`);
    form.reset();
  }),
);

// --- Reveal on scroll ------------------------------------------------------------------------------
document.documentElement.classList.add('js');
const items = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('in'));
}
