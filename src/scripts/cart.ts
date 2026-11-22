import { PROMO_CODE, cartTotals, getPromo, money, removeFromCart, setLicence, setPromo, type Lic } from './store';
import { toast } from './ui';

/**
 * Shows the cart lines that are in the cart (all lines are server-rendered and hidden),
 * fills in prices and totals, and wires up licence, remove and promo controls.
 */
export function mountCart(root: HTMLElement) {
  const lines = [...root.querySelectorAll<HTMLElement>('[data-line]')];
  const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s);

  const render = () => {
    const t = cartTotals();
    const ids = t.lines.map((l) => l.p.id);
    lines.forEach((li) => {
      const idx = ids.indexOf(li.dataset.line!);
      li.hidden = idx === -1;
      if (idx === -1) return;
      const { item, p } = t.lines[idx];
      li.style.order = String(idx);
      const price = li.querySelector<HTMLElement>('[data-line-price]');
      if (price) price.textContent = money(p.price === 0 ? 0 : item.lic === 'commercial' ? p.price * 2 : p.price);
      const sel = li.querySelector<HTMLSelectElement>('[data-lic-select]');
      if (sel) sel.value = item.lic;
      const name = li.querySelector<HTMLElement>('[data-lic-name]');
      if (name && p.price !== 0) name.textContent = item.lic === 'commercial' ? 'Commercial licence' : 'Personal licence';
    });
    root.querySelectorAll<HTMLElement>('[data-filled]').forEach((el) => (el.hidden = ids.length === 0));
    root.querySelectorAll<HTMLElement>('[data-empty]').forEach((el) => (el.hidden = ids.length > 0));
    root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => (el.textContent = `${ids.length} ${ids.length === 1 ? 'item' : 'items'}`));
    const sub = q('[data-subtotal]');
    if (sub) sub.textContent = money(t.subtotal);
    const row = q('[data-discount-row]');
    if (row) {
      row.hidden = t.discount === 0;
      q('[data-discount]')!.textContent = `−$${t.discount.toFixed(2)}`;
    }
    const total = q('[data-total]');
    if (total) total.textContent = t.total === 0 ? 'Free' : `$${Number.isInteger(t.total) ? t.total : t.total.toFixed(2)}`;
    root.querySelectorAll<HTMLElement>('[data-needs-items]').forEach((el) => {
      el.toggleAttribute('disabled', ids.length === 0);
      el.setAttribute('aria-disabled', String(ids.length === 0));
    });
    const msg = q('[data-promo-msg]');
    if (msg && getPromo()) {
      msg.textContent = `Code ${PROMO_CODE} applied: 10% off`;
      msg.className = 'pmsg ok';
    }
  };

  root.addEventListener('change', (e) => {
    const sel = (e.target as HTMLElement).closest<HTMLSelectElement>('[data-lic-select]');
    if (sel) setLicence(sel.closest<HTMLElement>('[data-line]')!.dataset.line!, sel.value as Lic);
  });
  root.addEventListener('click', (e) => {
    const rm = (e.target as HTMLElement).closest('[data-remove]');
    if (rm) {
      removeFromCart(rm.closest<HTMLElement>('[data-line]')!.dataset.line!);
      toast('Removed from cart');
    }
  });
  q<HTMLFormElement>('[data-promo-form]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = q<HTMLInputElement>('input[name="promo"]')!;
    const msg = q('[data-promo-msg]')!;
    const code = input.value.trim().toUpperCase();
    if (!code) {
      msg.textContent = 'Enter a promo code first.';
      msg.className = 'pmsg err';
    } else if (code === PROMO_CODE) {
      setPromo(code);
      input.value = '';
    } else {
      setPromo('');
      msg.textContent = 'This code is not valid.';
      msg.className = 'pmsg err';
    }
  });

  window.addEventListener('trm:change', render);
  render();
}
