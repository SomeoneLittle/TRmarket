let timer: number | undefined;

/** Shows a short message in the toast at the bottom right, with an optional link. */
export function toast(message: string, action?: { label: string; href: string }) {
  const el = document.querySelector<HTMLElement>('.toast');
  if (!el) return;
  el.replaceChildren(document.createTextNode(message));
  if (action) {
    const a = document.createElement('a');
    a.href = action.href;
    a.textContent = action.label;
    el.append(a);
  }
  el.classList.add('show');
  clearTimeout(timer);
  timer = window.setTimeout(() => el.classList.remove('show'), 3200);
}

export const stars = (rating: number) => `${(rating / 5) * 100}%`;
