import { caseStudies, workIndex, type ArticleFigure, type ArticleSection } from '../data/projects';
import { initNameReveal } from '../rive/name-reveal';

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

const EM_DASH = '\u2014';

/** Geist Mono draws U+2014 like a hyphen — render em dashes in sans for correct width */
function appendProseWithEmDashes(parent: HTMLElement, text: string): void {
  const normalized = text
    .replace(/\u2013/g, EM_DASH)
    .replace(/\s--\s/g, ` ${EM_DASH} `);
  const pattern = new RegExp(
    `(${EM_DASH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|\\*\\*[^*]+\\*\\*|\\*[^*]+\\*|~~[^~]+~~)`,
    'g',
  );
  let lastIndex = 0;

  for (const match of normalized.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parent.appendChild(document.createTextNode(normalized.slice(lastIndex, index)));
    }

    const token = match[0];
    if (token === EM_DASH) {
      const dash = document.createElement('span');
      dash.className = 'studies-em-dash';
      dash.textContent = EM_DASH;
      parent.appendChild(dash);
    } else if (token.startsWith('~~') && token.endsWith('~~')) {
      const strike = document.createElement('s');
      strike.textContent = token.slice(2, -2);
      parent.appendChild(strike);
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const strong = document.createElement('strong');
      strong.textContent = token.slice(2, -2);
      parent.appendChild(strong);
    } else {
      const em = document.createElement('em');
      em.textContent = token.slice(1, -1);
      parent.appendChild(em);
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < normalized.length) {
    parent.appendChild(document.createTextNode(normalized.slice(lastIndex)));
  }
}

function bodyParagraph(text: string, className: string): HTMLParagraphElement {
  const para = el('p', className);
  appendProseWithEmDashes(para, text);
  return para;
}

function renderFigure(fig: ArticleFigure & { maxWidth?: number }): HTMLElement {
  const classes = ['studies-figure'];
  if (fig.wide) classes.push('studies-figure--wide');
  if (fig.bg === 'white') classes.push('studies-figure--bg-white');
  const wrap = el('figure', classes.join(' '));
  if (fig.maxWidth) wrap.style.maxWidth = `${fig.maxWidth}px`;
  const img = document.createElement('img');
  img.src = encodeURI(fig.src);
  img.alt = fig.alt;
  img.loading = 'lazy';
  img.className = 'studies-figure-img';
  wrap.appendChild(img);
  if (fig.caption) {
    const caption = document.createElement('figcaption');
    caption.className = 'studies-figure-caption';
    caption.textContent = fig.caption;
    wrap.appendChild(caption);
  }
  return wrap;
}

function renderTwoColItem(fig: ArticleFigure): HTMLElement {
  const item = el('div', 'studies-two-col-item');
  const isRefactor = Boolean(fig.description);
  if (isRefactor) {
    // Refactor: title → description → image
    if (fig.label) item.appendChild(el('p', 'studies-refactor-title', fig.label));
    if (fig.description) item.appendChild(el('p', 'studies-refactor-desc', fig.description));
    item.appendChild(renderFigure(fig));
  } else {
    // Layout wireframes: image → label below
    item.appendChild(renderFigure(fig));
    if (fig.label) item.appendChild(el('p', 'studies-layout-label', fig.label));
  }
  return item;
}

function renderSection(section: ArticleSection): HTMLElement | null {
  switch (section.kind) {
    case 'h2':
      return el('h2', 'studies-h2', section.text);
    case 'h3':
      return el('h3', 'studies-h3', section.text);
    case 'mono-label':
      return el('p', 'studies-mono-label', section.text);
    case 'body': {
      const wrap = el('div', 'studies-body');
      for (const p of section.paragraphs) {
        const text = typeof p === 'string' ? p : p.text;
        if (!text.trim()) continue;
        const className =
          typeof p === 'string' || p.variant !== 'disclaimer'
            ? 'studies-body-p'
            : 'studies-disclaimer';
        wrap.appendChild(bodyParagraph(text, className));
      }
      return wrap;
    }
    case 'list': {
      const listTag = section.ordered ? 'ol' : 'ul';
      const list = document.createElement(listTag);
      list.className = 'studies-list';
      for (const item of section.items) {
        const li = document.createElement('li');
        li.className = 'studies-list-item';
        appendProseWithEmDashes(li, item);
        list.appendChild(li);
      }
      return list;
    }
    case 'figure':
      return renderFigure({
        src: section.src,
        alt: section.alt,
        wide: section.wide,
        maxWidth: section.maxWidth,
        caption: section.caption,
      });
    case 'video': {
      const classes = ['studies-figure', 'studies-figure--video'];
      if (section.wide) classes.push('studies-figure--wide');
      const wrap = el('figure', classes.join(' '));
      const video = document.createElement('video');
      video.src = encodeURI(section.src);
      if (section.poster) video.poster = encodeURI(section.poster);
      video.className = 'studies-figure-video';
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', section.alt);
      wrap.appendChild(video);
      return wrap;
    }
    case 'table': {
      const wrap = el('div', 'studies-table-wrap');
      const table = el('table', 'studies-table');
      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');
      for (const cell of section.headers) {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = cell;
        headRow.appendChild(th);
      }
      thead.appendChild(headRow);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      for (const row of section.rows) {
        const tr = document.createElement('tr');
        row.forEach((cell, index) => {
          const td = document.createElement(index === 0 ? 'th' : 'td');
          if (index === 0) td.scope = 'row';
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      wrap.appendChild(table);
      return wrap;
    }
    case 'twoFigures': {
      const isRefactor = Boolean(section.left.description || section.right.description);
      const row = el('div', `studies-two-col ${isRefactor ? 'studies-two-col--refactor' : 'studies-two-col--layout'}`);
      row.append(renderTwoColItem(section.left), renderTwoColItem(section.right));
      return row;
    }
    case 'feature': {
      const block = el('div', 'studies-feature');
      const head = el('div', 'studies-feature-head');
      head.append(el('h3', 'studies-feature-title', section.title));
      head.appendChild(el('p', 'studies-feature-desc', section.description));
      block.append(head, renderFigure(section.figure));
      return block;
    }
    default:
      return null;
  }
}

export type StudiesArticleOptions = {
  /** Scrollable inner layout (mobile detail overlay) */
  embedded?: boolean;
};

export function renderStudiesArticle(
  container: HTMLElement,
  slug: string,
  options: StudiesArticleOptions = {},
): void {
  const study = caseStudies[slug];
  container.innerHTML = '';
  if (options.embedded) {
    container.className = 'studies-detail-scroll studies-detail-scroll--embedded';
  } else {
    container.className = 'view view-studies-detail';
  }

  if (!study?.article?.length) {
    container.append(
      el('p', undefined, 'Study not found.'),
      (() => {
        const a = el('a', 'text-link', 'Back home') as HTMLAnchorElement;
        a.href = '#/';
        return a;
      })(),
    );
    return;
  }

  if (!options.embedded) {
    const header = el('header', 'studies-detail-header');
    const nameCanvas = document.createElement('canvas');
    nameCanvas.className = 'landing-name-abbr';
    nameCanvas.width = 240;
    nameCanvas.height = 32;
    header.appendChild(nameCanvas);
    container.appendChild(header);
    initNameReveal(nameCanvas);
  }

  const inner = el('div', 'studies-detail-inner');

  const backRow = el('div', 'studies-detail-intro');
  const back = el('button', 'studies-back', '← Back') as HTMLButtonElement;
  back.type = 'button';
  back.setAttribute('aria-label', 'Back to home');
  back.addEventListener('click', () => {
    location.hash = '#/';
  });
  backRow.append(back);

  const titleBlock = el('div', 'studies-title-block');
  titleBlock.appendChild(el('h1', 'studies-page-title', study.headline));

  const meta = el('div', 'studies-page-meta');
  if (study.type) meta.appendChild(el('p', 'studies-page-byline', study.type));
  const row = workIndex.find((entry) => entry.slug === slug);
  if (row?.client) meta.appendChild(el('p', 'studies-page-client', row.client));
  if (meta.childElementCount) titleBlock.appendChild(meta);

  inner.append(backRow, titleBlock);

  const main = el('main', 'studies-detail-main');
  main.setAttribute('role', 'article');

  for (const section of study.article) {
    const node = renderSection(section);
    if (node) main.appendChild(node);
  }

  main.appendChild(
    el(
      'p',
      'studies-disclaimer',
      "Disclaimer: AI wasn't used to write this missive, all em dashes are mine.",
    ),
  );

  inner.appendChild(main);
  container.appendChild(inner);
}
