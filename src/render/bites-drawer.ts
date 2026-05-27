import {
  BITES_CAPTION,
  bitesInitialOrder,
  bitesItems,
  type BitesItem,
} from '../data/bites';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function createMedia(item: BitesItem): HTMLElement {
  if (item.kind === 'video' && !prefersReducedMotion()) {
    const video = document.createElement('video');
    video.className = 'bites-item-media';
    video.src = item.src;
    if (item.posterSrc) video.poster = item.posterSrc;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('aria-label', item.alt);
    return video;
  }

  const img = document.createElement('img');
  img.className = 'bites-item-media';
  img.src =
    item.kind === 'video' && item.posterSrc ? item.posterSrc : item.src;
  img.alt = item.alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  return img;
}

function renderItem(item: BitesItem, stackIndex: number): HTMLElement {
  const wrap = el('div', 'bites-item bites-item--captioned');
  wrap.dataset.bitesId = item.id;
  wrap.style.setProperty('--bites-stack-index', String(stackIndex));
  wrap.style.width = `${item.width}px`;
  wrap.style.height = `${item.height}px`;
  wrap.style.left = item.left;
  wrap.style.top = item.top;

  const media = createMedia(item);
  media.style.width = '100%';
  media.style.height = '100%';
  wrap.appendChild(media);
  wrap.appendChild(el('p', 'bites-caption', item.caption ?? BITES_CAPTION));
  return wrap;
}

export function renderBitesDrawer(): HTMLElement {
  const host = el('div', 'bites-drawer-host');
  const drawer = el('div', 'bites-drawer');
  drawer.setAttribute(
    'role',
    'group',
  );
  drawer.setAttribute(
    'aria-label',
    'Bites — click the stack to cycle snapshots',
  );
  drawer.tabIndex = 0;

  const itemById = new Map(
    bitesItems.map((item, index) => [item.id, renderItem(item, index)]),
  );
  for (const item of bitesItems) {
    const node = itemById.get(item.id);
    if (node) drawer.appendChild(node);
  }
  host.appendChild(drawer);

  let order = [...bitesInitialOrder];
  let pointer = { x: 0, y: 0 };

  const clearHovered = () => {
    for (const node of itemById.values()) {
      node.classList.remove('bites-item--hovered');
    }
  };

  const syncHoverUnderPointer = () => {
    if (pointer.x === 0 && pointer.y === 0) return;
    clearHovered();
    const target = document.elementFromPoint(pointer.x, pointer.y);
    const item = target?.closest('.bites-item');
    if (item && drawer.contains(item)) {
      item.classList.add('bites-item--hovered');
    }
  };

  const applyStack = () => {
    order.forEach((id, index) => {
      const node = itemById.get(id);
      if (!node) return;
      node.style.zIndex = String(index + 1);
      const isTop = index === order.length - 1;
      node.classList.toggle('bites-item--top', isTop);
      node.style.pointerEvents = isTop ? 'auto' : 'none';
    });
    syncHoverUnderPointer();
  };

  /** Top card goes to the back; the next card in line comes forward */
  const advanceStack = () => {
    if (order.length < 2) return;
    const current = order.pop()!;
    order.unshift(current);
    applyStack();
  };

  for (const node of itemById.values()) {
    node.addEventListener('mouseenter', () => {
      clearHovered();
      node.classList.add('bites-item--hovered');
    });
    node.addEventListener('mouseleave', () => {
      node.classList.remove('bites-item--hovered');
    });
  }

  host.addEventListener('mousemove', (e) => {
    pointer = { x: e.clientX, y: e.clientY };
  });

  host.addEventListener('mouseenter', (e) => {
    pointer = { x: e.clientX, y: e.clientY };
    syncHoverUnderPointer();
  });

  host.addEventListener('mouseleave', () => {
    clearHovered();
  });

  drawer.addEventListener('click', () => advanceStack());

  drawer.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    advanceStack();
  });

  applyStack();
  return host;
}
