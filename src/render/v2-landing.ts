import { site } from '../data/site';
import {
  v2Site,
  v2WorkProjects,
  type V2MediaTile,
  type V2WorkFilter,
  type V2WorkProject,
} from '../data/v2-content';

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

function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildPlayBadge(): HTMLElement {
  const badge = el('div', 'v2-play-badge');
  badge.innerHTML =
    '<span class="v2-play-icon" aria-hidden="true"></span><span class="v2-play-label">Play</span>';
  return badge;
}

const DRAG_THRESHOLD_PX = 5;
const MOMENTUM_FRICTION = 0.94;
const MOMENTUM_MIN_VELOCITY = 0.02;

/** Mouse click-and-drag with momentum; touch and trackpad use native scrolling. */
function enableDragScroll(row: HTMLElement): void {
  let pointerId: number | null = null;
  let startX = 0;
  let startScroll = 0;
  let dragging = false;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let momentumFrame = 0;
  let suppressClick = false;

  const stopMomentum = () => {
    cancelAnimationFrame(momentumFrame);
    momentumFrame = 0;
  };

  const runMomentum = () => {
    let prev = performance.now();
    const step = (now: number) => {
      const dt = now - prev;
      prev = now;
      row.scrollLeft -= velocity * dt;
      velocity *= Math.pow(MOMENTUM_FRICTION, dt / 16);
      const atEdge =
        row.scrollLeft <= 0 || row.scrollLeft >= row.scrollWidth - row.clientWidth;
      if (Math.abs(velocity) < MOMENTUM_MIN_VELOCITY || atEdge) {
        momentumFrame = 0;
        return;
      }
      momentumFrame = requestAnimationFrame(step);
    };
    momentumFrame = requestAnimationFrame(step);
  };

  row.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    stopMomentum();
    pointerId = e.pointerId;
    startX = lastX = e.clientX;
    startScroll = row.scrollLeft;
    lastTime = e.timeStamp;
    velocity = 0;
    dragging = false;
  });

  row.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      dragging = true;
      row.setPointerCapture(e.pointerId);
      row.classList.add('v2-tile-row--dragging');
    }
    row.scrollLeft = startScroll - dx;
    const dt = e.timeStamp - lastTime;
    if (dt > 0) velocity = (e.clientX - lastX) / dt;
    lastX = e.clientX;
    lastTime = e.timeStamp;
  });

  const endDrag = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    if (!dragging) return;
    dragging = false;
    suppressClick = true;
    row.classList.remove('v2-tile-row--dragging');
    if (row.hasPointerCapture(e.pointerId)) row.releasePointerCapture(e.pointerId);
    if (e.timeStamp - lastTime < 80) runMomentum();
  };
  row.addEventListener('pointerup', endDrag);
  row.addEventListener('pointercancel', endDrag);

  row.addEventListener(
    'click',
    (e) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.stopPropagation();
      e.preventDefault();
    },
    true,
  );

  row.addEventListener('wheel', stopMomentum, { passive: true });
  row.addEventListener('touchstart', stopMomentum, { passive: true });
  row.addEventListener('dragstart', (e) => e.preventDefault());
}

function tileWidth(tile: V2MediaTile): number {
  return Math.round((tile.height * tile.mediaWidth) / tile.mediaHeight);
}

function buildMediaTile(tile: V2MediaTile): HTMLElement {
  const wrap = el('div', 'v2-tile');
  wrap.style.setProperty('--v2-tile-w', `${tileWidth(tile)}px`);
  wrap.style.aspectRatio = `${tile.mediaWidth} / ${tile.mediaHeight}`;

  if (tile.videoSrc) {
    const video = document.createElement('video');
    video.src = encodeURI(tile.videoSrc);
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = 'metadata';
    video.className = 'v2-tile-media';
    wrap.appendChild(video);
    if (tile.play) {
      wrap.appendChild(buildPlayBadge());
      wrap.classList.add('v2-tile--has-play');
      wrap.addEventListener('click', () => {
        if (video.paused) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    }
  } else if (tile.src) {
    const img = document.createElement('img');
    img.src = encodeURI(tile.src);
    img.alt = tile.alt ?? '';
    img.className = 'v2-tile-media';
    img.loading = 'lazy';
    wrap.appendChild(img);
    if (tile.play) {
      wrap.appendChild(buildPlayBadge());
      wrap.classList.add('v2-tile--has-play');
    }
  }

  return wrap;
}

function buildProjectBlock(project: V2WorkProject): HTMLElement {
  const block = el('article', 'v2-project');
  block.dataset.filter = project.filter;
  block.id = `project-${project.id}`;

  const intro = el('div', 'v2-project-intro');
  const title = el(
    'h3',
    `v2-project-title${project.titleUppercase ? ' v2-project-title--upper' : ''}${
      project.titleFont === 'geist-medium' ? ' v2-project-title--geist' : ''
    }`,
    project.title,
  );
  const desc = el('p', 'v2-project-desc', project.description);
  intro.append(title, desc);
  block.appendChild(intro);

  const row = el('div', 'v2-tile-row');
  row.setAttribute('tabindex', '0');
  row.setAttribute('aria-label', `${project.title} gallery`);
  enableDragScroll(row);
  project.tiles.forEach((tile, index) => {
    if (index === 0 && project.firstTileCaption) {
      const col = el('div', 'v2-tile-col');
      col.style.setProperty('--v2-tile-w', `${tileWidth(tile)}px`);
      col.appendChild(buildMediaTile(tile));
      col.appendChild(el('p', 'v2-tile-caption', project.firstTileCaption));
      row.appendChild(col);
    } else {
      row.appendChild(buildMediaTile(tile));
    }
  });
  block.appendChild(row);
  return block;
}

export function renderV2Landing(container: HTMLElement): void {
  container.innerHTML = '';
  container.className = 'view view-v2';
  container.dataset.theme = 'product';

  const page = el('div', 'v2-page');

  const header = el('header', 'v2-header');
  const brand = el('p', 'v2-brand', site.name);
  brand.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const nav = el('nav', 'v2-nav');
  nav.setAttribute('aria-label', 'Primary');
  for (const { id, label } of [
    { id: 'work', label: 'Work' },
    { id: 'about', label: 'About me' },
    { id: 'contact', label: 'Contact' },
  ]) {
    const link = el('button', 'v2-nav-link', label);
    link.type = 'button';
    link.addEventListener('click', () => scrollToSection(id));
    nav.appendChild(link);
  }
  header.append(brand, nav);
  page.appendChild(header);

  const hero = el('p', 'v2-hero', v2Site.heroLine);
  const rule = el('p', 'v2-hero-rule', '---');
  page.append(hero, rule);

  const main = el('main', 'v2-main');

  const workSection = el('section', 'v2-section');
  workSection.id = 'work';

  const workHead = el('div', 'v2-section-head');
  workHead.appendChild(el('h2', 'v2-section-title', 'Work'));

  const filterBar = el('div', 'v2-filter-bar');
  filterBar.appendChild(el('span', 'v2-filter-label', v2Site.workFilterLabel));

  const pills = el('div', 'v2-filter-pills');
  let activeFilter: V2WorkFilter = 'product';
  const pillBtns = new Map<V2WorkFilter, HTMLButtonElement>();

  for (const key of ['product', 'brand'] as const) {
    const btn = el('button', `v2-filter-pill${key === activeFilter ? ' v2-filter-pill--active' : ''}`, key);
    btn.type = 'button';
    btn.dataset.filter = key;
    pillBtns.set(key, btn as HTMLButtonElement);
    pills.appendChild(btn);
  }
  filterBar.appendChild(pills);
  workHead.appendChild(filterBar);
  workSection.appendChild(workHead);

  const projectList = el('div', 'v2-project-list');
  const projectNodes = v2WorkProjects.map((p) => buildProjectBlock(p));
  for (const node of projectNodes) {
    projectList.appendChild(node);
  }
  workSection.appendChild(projectList);

  const applyFilter = (filter: V2WorkFilter) => {
    activeFilter = filter;
    const theme = filter === 'brand' ? 'brand' : 'product';
    container.dataset.theme = theme;
    document.body.dataset.v2Theme = theme;
    const themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.content = theme === 'brand' ? '#d9d9d9' : '#272727';
    }
    for (const [key, btn] of pillBtns) {
      btn.classList.toggle('v2-filter-pill--active', key === filter);
    }
    for (const node of projectNodes) {
      const show = node.dataset.filter === filter;
      node.classList.toggle('v2-project--hidden', !show);
    }
  };

  for (const [key, btn] of pillBtns) {
    btn.addEventListener('click', () => applyFilter(key));
  }
  applyFilter(activeFilter);

  main.appendChild(workSection);

  const aboutSection = el('section', 'v2-section v2-section--about');
  aboutSection.id = 'about';
  const aboutCopy = el('div', 'v2-about-copy');
  aboutCopy.appendChild(el('h2', 'v2-section-title', 'About me'));
  for (const paragraph of v2Site.aboutParagraphs) {
    aboutCopy.appendChild(el('p', 'v2-about-p', paragraph));
  }
  aboutSection.appendChild(aboutCopy);
  main.appendChild(aboutSection);

  const contactSection = el('section', 'v2-section v2-section--contact');
  contactSection.id = 'contact';
  contactSection.appendChild(el('h2', 'v2-section-title v2-section-title--contact', 'Contact'));
  const contactLinks = el('div', 'v2-contact-links');
  const email = document.createElement('a');
  email.href = `mailto:${v2Site.contactEmail}`;
  email.className = 'v2-contact-link';
  email.textContent = v2Site.contactEmail;
  const twitter = document.createElement('a');
  twitter.href = v2Site.twitterUrl;
  twitter.className = 'v2-contact-link';
  twitter.target = '_blank';
  twitter.rel = 'noopener noreferrer';
  twitter.textContent = v2Site.twitterLabel;
  contactLinks.append(email, twitter);
  contactSection.appendChild(contactLinks);
  main.appendChild(contactSection);

  page.appendChild(main);
  container.appendChild(page);
}
