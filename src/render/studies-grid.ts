import type { WorkIndexRow } from '../data/projects';

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

export type StudiesGridOptions = {
  onNavigate?: (slug: string) => void;
  onWarm?: (slug: string) => void;
};

function renderThumb(row: WorkIndexRow): HTMLElement {
  const thumb = el('div', 'studies-card-thumb');
  if (row.thumbnailSrc) {
    const img = document.createElement('img');
    img.src = encodeURI(row.thumbnailSrc);
    img.alt = '';
    img.loading = 'lazy';
    img.className = 'studies-card-thumb-img';
    thumb.appendChild(img);
  } else if (row.thumbnailPlaceholder) {
    thumb.classList.add('studies-card-thumb--placeholder');
    thumb.style.backgroundColor = row.thumbnailPlaceholder;
  }
  return thumb;
}

function renderTitleBlock(row: WorkIndexRow): HTMLElement {
  const block = el('div', 'studies-card-title-block');
  block.appendChild(el('p', 'studies-card-title', row.title));
  if (row.subtitle) {
    block.appendChild(el('p', 'studies-card-subtitle', row.subtitle));
  }
  return block;
}

export function renderStudiesGrid(
  rows: WorkIndexRow[],
  options: StudiesGridOptions = {},
): HTMLElement {
  const grid = el('div', 'studies-grid');

  for (const row of rows) {
    const cardInner = el('div', 'studies-card-inner');
    cardInner.append(renderThumb(row), renderTitleBlock(row), el('p', 'studies-card-client', row.client));

    if (row.slug) {
      const link = document.createElement('a');
      link.className = 'studies-card studies-card--link';
      link.href = `#/work/${row.slug}`;
      const slug = row.slug;
      link.appendChild(cardInner);
      if (options.onWarm) {
        const warm = () => options.onWarm!(slug);
        link.addEventListener('mouseenter', warm);
        link.addEventListener('focus', warm);
        link.addEventListener('touchstart', warm, { passive: true });
      }
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (options.onNavigate) {
          options.onNavigate(slug);
        } else {
          location.hash = `#/work/${slug}`;
        }
      });
      grid.appendChild(link);
    } else {
      const card = el('div', 'studies-card studies-card--static');
      card.appendChild(cardInner);
      grid.appendChild(card);
    }
  }

  return grid;
}
