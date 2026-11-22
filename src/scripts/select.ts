// Replaces native <select> controls with a dropdown that matches the site style.
// The native select stays in the DOM (hidden) so forms, validation and change events keep working.

const CHEVRON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const CHECK =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';

let uid = 0;
const open: { close: () => void; wrap: HTMLElement }[] = [];

function enhance(select: HTMLSelectElement) {
  if (select.dataset.dd) return;
  select.dataset.dd = '1';
  const id = `dd${++uid}`;

  const wrap = document.createElement('div');
  wrap.className = 'dd' + (select.hasAttribute('data-lic-select') ? ' sm' : '');
  select.before(wrap);
  wrap.append(select);
  select.classList.add('dd-native');
  select.tabIndex = -1;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'dd-btn';
  btn.setAttribute('aria-haspopup', 'listbox');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', `${id}-list`);
  const labelText =
    select.getAttribute('aria-label') ||
    (select.id ? document.querySelector(`label[for="${select.id}"]`)?.textContent?.trim() : '') ||
    select.closest('label')?.textContent?.trim() ||
    '';
  if (labelText) btn.setAttribute('aria-label', labelText);
  const value = document.createElement('span');
  value.className = 'dd-val';
  btn.append(value);
  btn.insertAdjacentHTML('beforeend', CHEVRON);

  const list = document.createElement('ul');
  list.className = 'dd-list';
  list.id = `${id}-list`;
  list.setAttribute('role', 'listbox');
  list.hidden = true;

  const items = [...select.options].map((o, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.dataset.index = String(i);
    li.innerHTML = `<span></span>${CHECK}`;
    li.firstElementChild!.textContent = o.text;
    if (o.disabled) li.setAttribute('aria-disabled', 'true');
    list.append(li);
    return li;
  });
  wrap.append(btn, list);

  let active = select.selectedIndex;
  const refresh = () => {
    const o = select.options[select.selectedIndex];
    value.textContent = o ? o.text : '';
    value.classList.toggle('placeholder', !!o && o.value === '' && select.required);
    items.forEach((li, i) => li.setAttribute('aria-selected', String(i === select.selectedIndex)));
  };
  const setActive = (i: number) => {
    active = Math.max(0, Math.min(items.length - 1, i));
    items.forEach((li, k) => li.classList.toggle('active', k === active));
    items[active]?.scrollIntoView({ block: 'nearest' });
    btn.setAttribute('aria-activedescendant', `${id}-o${active}`);
  };
  items.forEach((li, i) => (li.id = `${id}-o${i}`));

  const close = (focus = false) => {
    list.hidden = true;
    wrap.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    const idx = open.findIndex((o) => o.wrap === wrap);
    if (idx > -1) open.splice(idx, 1);
    if (focus) btn.focus();
  };
  const show = () => {
    open.slice().forEach((o) => o.close());
    list.hidden = false;
    wrap.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    // Open upwards when there is no room below.
    const r = btn.getBoundingClientRect();
    wrap.classList.toggle('up', window.innerHeight - r.bottom < 260 && r.top > 260);
    setActive(select.selectedIndex);
    open.push({ close, wrap });
  };
  const choose = (i: number) => {
    if (select.options[i]?.disabled) return;
    select.selectedIndex = i;
    refresh();
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
    close(true);
  };

  btn.addEventListener('click', () => (list.hidden ? show() : close()));
  list.addEventListener('click', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('li');
    if (li) choose(Number(li.dataset.index));
  });
  list.addEventListener('mousemove', (e) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('li');
    if (li) setActive(Number(li.dataset.index));
  });
  btn.addEventListener('keydown', (e) => {
    const isOpen = !list.hidden;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) show();
        else setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
        break;
      case 'Home':
        if (isOpen) (e.preventDefault(), setActive(0));
        break;
      case 'End':
        if (isOpen) (e.preventDefault(), setActive(items.length - 1));
        break;
      case 'Enter':
      case ' ':
        if (isOpen) (e.preventDefault(), choose(active));
        break;
      case 'Escape':
        if (isOpen) (e.preventDefault(), e.stopPropagation(), close(true));
        break;
      case 'Tab':
        if (isOpen) close();
        break;
      default:
        if (e.key.length === 1) {
          const k = e.key.toLowerCase();
          const next = select.options.length
            ? [...select.options].findIndex((o, i) => i > active && o.text.toLowerCase().startsWith(k))
            : -1;
          const hit = next > -1 ? next : [...select.options].findIndex((o) => o.text.toLowerCase().startsWith(k));
          if (hit > -1) (isOpen ? setActive(hit) : choose(hit));
        }
    }
  });

  // Labels that point at the native select should focus the button instead.
  if (select.id) {
    document.querySelector<HTMLElement>(`label[for="${select.id}"]`)?.addEventListener('click', (e) => {
      e.preventDefault();
      btn.focus();
    });
  }
  // Invalid required select: focus the visible button.
  select.addEventListener('invalid', () => btn.focus());
  select.addEventListener('change', refresh);
  select.form?.addEventListener('reset', () => setTimeout(refresh));

  // Keep the label in sync when scripts set select.value directly.
  const desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!;
  Object.defineProperty(select, 'value', {
    get() {
      return desc.get!.call(this);
    },
    set(v) {
      desc.set!.call(this, v);
      refresh();
    },
  });
  refresh();
}

export function enhanceSelects(root: ParentNode = document) {
  root.querySelectorAll<HTMLSelectElement>('select').forEach(enhance);
}

document.addEventListener('click', (e) => {
  open.slice().forEach((o) => {
    if (!o.wrap.contains(e.target as Node)) o.close();
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') open.slice().forEach((o) => o.close());
});
