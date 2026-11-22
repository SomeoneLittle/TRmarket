import { getFav, getOwned, money, findProduct } from './store';
import { toast } from './ui';

/** Shows the server-rendered purchase rows that match what the user owns, in purchase order. */
export function mountPurchases(root: HTMLElement) {
  const rows = [...root.querySelectorAll<HTMLElement>('[data-own]')];
  const render = () => {
    const owned = getOwned();
    rows.forEach((li) => {
      const idx = owned.findIndex((o) => o.id === li.dataset.own);
      li.hidden = idx === -1;
      if (idx === -1) return;
      const o = owned[idx];
      li.style.order = String(idx);
      li.querySelector('[data-own-date]')!.textContent = o.date;
      li.querySelector('[data-own-lic]')!.textContent = o.lic === 'commercial' ? 'Commercial' : 'Personal';
      li.querySelector('[data-own-key]')!.textContent = o.key;
    });
    root.querySelectorAll<HTMLElement>('[data-empty]').forEach((el) => (el.hidden = owned.length > 0));
    root.querySelectorAll<HTMLElement>('[data-filled]').forEach((el) => (el.hidden = owned.length === 0));
    root.querySelectorAll<HTMLElement>('[data-own-count]').forEach((el) => (el.textContent = String(owned.length)));
  };
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const dl = t.closest<HTMLElement>('[data-download]');
    if (dl) toast(`Download started: ${dl.dataset.title} (demo)`);
    const copy = t.closest<HTMLElement>('[data-copy-key]');
    if (copy) {
      const code = copy.parentElement!.querySelector('code')!.textContent!;
      navigator.clipboard?.writeText(code).catch(() => {});
      toast('Licence key copied');
    }
  });
  window.addEventListener('trm:change', render);
  render();
}

/** Shows items whose data-id is in the favorites list. */
export function mountFavorites(root: HTMLElement) {
  const items = [...root.querySelectorAll<HTMLElement>('[data-fav-item]')];
  const render = () => {
    const fav = getFav();
    items.forEach((li) => {
      const idx = fav.indexOf(li.dataset.favItem!);
      li.hidden = idx === -1;
      li.style.order = String(-idx);
    });
    root.querySelectorAll<HTMLElement>('[data-empty]').forEach((el) => (el.hidden = fav.length > 0));
    root.querySelectorAll<HTMLElement>('[data-filled]').forEach((el) => (el.hidden = fav.length === 0));
    root.querySelectorAll<HTMLElement>('[data-fav-total]').forEach((el) => (el.textContent = String(fav.length)));
    const worth = fav.reduce((s, id) => s + (findProduct(id)?.price ?? 0), 0);
    root.querySelectorAll<HTMLElement>('[data-fav-worth]').forEach((el) => (el.textContent = money(worth)));
  };
  window.addEventListener('trm:change', render);
  render();
}
