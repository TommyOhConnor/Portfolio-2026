import { site } from '../data/site';
import {
  caseStudies,
  aiWorkIndex,
  productWorkIndex,
  type ArticleSection,
  type WorkIndexRow,
} from '../data/projects';
import { initNameReveal } from '../rive/name-reveal';
import { renderStudiesGrid } from './studies-grid';
import { renderBitesDrawer } from './bites-drawer';


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

const preloadedCaseStudyAssets = new Map<string, Promise<void>>();

function getCaseStudyAssetUrl(
  item: (typeof caseStudies)[string]['gallery'][number],
): string {
  if ('riveSrc' in item) return item.riveSrc;
  if ('videoSrc' in item) return item.videoSrc;
  if ('cycleFrames' in item) return item.cycleFrames[0];
  if ('renderFn' in item) return '';
  return item.src;
}

function preloadAsset(url: string): Promise<void> {
  const encodedUrl = encodeURI(url);
  const existing = preloadedCaseStudyAssets.get(encodedUrl);
  if (existing) return existing;

  const promise = new Promise<void>((resolve) => {
    if (encodedUrl.endsWith('.riv')) {
      // Warm the Rive file in the browser cache.
      fetch(encodedUrl)
        .catch(() => undefined)
        .finally(() => resolve());
      return;
    }

    if (encodedUrl.endsWith('.mp4')) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = encodedUrl;
      if (video.readyState >= 2) {
        resolve();
        return;
      }
      const done = () => resolve();
      video.addEventListener('loadeddata', done, { once: true });
      video.addEventListener('error', done, { once: true });
      return;
    }

    const img = new Image();
    img.src = encodedUrl;
    if (img.complete) {
      img.decode().catch(() => undefined).finally(resolve);
      return;
    }
    img.addEventListener('load', () => {
      img.decode().catch(() => undefined).finally(resolve);
    }, { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });

  preloadedCaseStudyAssets.set(encodedUrl, promise);
  return promise;
}

function collectArticleAssetUrls(sections: ArticleSection[]): string[] {
  const urls: string[] = [];
  for (const s of sections) {
    if (s.kind === 'figure') urls.push(s.src);
    else if (s.kind === 'video') urls.push(s.src);
    else if (s.kind === 'feature') urls.push(s.figure.src);
    else if (s.kind === 'twoFigures') {
      urls.push(s.left.src, s.right.src);
    }
  }
  return urls;
}

function preloadCaseStudyAssets(slug: string): Promise<void> {
  const study = caseStudies[slug];
  if (!study) return Promise.resolve();
  const urls =
    study.detailLayout === 'article' && study.article?.length
      ? collectArticleAssetUrls(study.article).slice(0, 2)
      : study.gallery.slice(0, 2).map(getCaseStudyAssetUrl);
  return Promise.all(urls.filter(Boolean).map(preloadAsset)).then(() => undefined);
}

function navigateToCaseStudy(slug: string): void {
  location.hash = `#/work/${slug}`;
}

export function renderWorkRow(row: WorkIndexRow, showYear: boolean): HTMLElement {
  const wrap = el('div', 'work-row');

  const main = el('div', 'work-row-main');

  if (showYear) {
    main.appendChild(el('span', 'work-year', row.year || '\u00a0'));
  }

  // Client + title rendered inline as one continuous text block
  const titleLine = el('p', 'work-title-line');
  const clientSpan = el('span', 'work-client-inline', row.client + '\u00a0');
  titleLine.appendChild(clientSpan);

  if (row.externalUrl) {
    const a = document.createElement('a');
    a.className = 'work-title-link';
    a.href = row.externalUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = row.title;
    titleLine.appendChild(a);
  } else if (row.slug) {
    const a = document.createElement('a');
    a.className = 'work-title-link';
    a.href = `#/work/${row.slug}`;
    const warmCaseStudy = () => { preloadCaseStudyAssets(row.slug!); };
    a.addEventListener('mouseenter', warmCaseStudy);
    a.addEventListener('focus', warmCaseStudy);
    a.addEventListener('touchstart', warmCaseStudy, { passive: true });
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = row.slug!;
      warmCaseStudy();
      navigateToCaseStudy(slug);
    });
    a.textContent = row.title;
    titleLine.appendChild(a);
  } else {
    const titleSpan = el('span', 'work-title-link', row.title);
    titleLine.appendChild(titleSpan);
  }
  main.appendChild(titleLine);

  const category = el('div', 'work-category-col', row.category);
  wrap.append(main, category);
  return wrap;
}

export function renderWorkSection(
  label: string | undefined,
  rows: WorkIndexRow[],
  showYear: boolean,
): HTMLElement {
  const section = el('div', 'landing-section');
  if (label) {
    section.appendChild(el('p', 'landing-section-label', label));
  }

  const table = el('div', 'work-table');
  for (let i = 0; i < rows.length; i++) {
    table.appendChild(renderWorkRow(rows[i], showYear));
    if (i < rows.length - 1) {
      table.appendChild(el('div', 'work-rule'));
    }
  }
  section.appendChild(table);
  return section;
}

function renderAboutPanel(): HTMLElement {
  const panel = el('div', 'landing-about-panel');
  panel.setAttribute('aria-hidden', 'true');

  const bio = el('div', 'landing-about-bio');
  const appendWithInlineEmphasis = (target: HTMLElement, text: string) => {
    const tokens = text.split(/(\*[^*]+\*|_[^_]+_)/g);
    for (const token of tokens) {
      if (!token) continue;
      if (
        (token.startsWith('*') && token.endsWith('*'))
        || (token.startsWith('_') && token.endsWith('_'))
      ) {
        const em = document.createElement('em');
        em.textContent = token.slice(1, -1);
        target.appendChild(em);
      } else {
        target.appendChild(document.createTextNode(token));
      }
    }
  };

  for (const p of site.aboutBio.paragraphs) {
    const para = el('p', 'about-bio-p');
    appendWithInlineEmphasis(para, p);
    bio.appendChild(para);
  }

  const contact = el('div', 'landing-about-contact');

  const emailLink = document.createElement('a');
  emailLink.href = `mailto:${site.email}`;
  emailLink.className = 'about-contact-email';
  emailLink.textContent = site.email;
  contact.appendChild(emailLink);

  panel.append(bio, contact);
  return panel;
}

export function renderLanding(container: HTMLElement) {
  container.innerHTML = '';
  container.className = 'view view-landing';

  // Header
  const header = el('header', 'landing-header');
  const nameCanvas = document.createElement('canvas');
  nameCanvas.className = 'landing-name-abbr';
  nameCanvas.width = 240;
  nameCanvas.height = 32;
  const nameText = el('span', 'landing-name-text', site.name);
  header.append(nameCanvas, nameText);
  container.appendChild(header);

  // Inner
  const inner = el('div', 'landing-inner');

  // Hero
  const hero = el('div', 'landing-hero');
  const assetsBase = `${import.meta.env.BASE_URL}assets`;

  const photo = document.createElement('img');
  photo.src = encodeURI(`${assetsBase}/Profile Image.png`);
  photo.alt = site.name;
  photo.className = 'landing-hero-photo';

  const photoDark = document.createElement('img');
  photoDark.src = `${assetsBase}/profile.png`;
  photoDark.alt = site.name;
  photoDark.className = 'landing-hero-photo landing-hero-photo--dark';

  const photoWrap = el('div', 'landing-hero-photo-wrap');
  photoWrap.append(photo, photoDark);

  const heroText = el('div', 'landing-hero-text');
  const headline = el('p', 'landing-headline');
  headline.appendChild(document.createTextNode(site.heroHeadline));

  const moreBtn = el('button', 'landing-more-btn', 'MORE');
  moreBtn.type = 'button';
  moreBtn.setAttribute('aria-expanded', 'false');
  headline.appendChild(moreBtn);

  heroText.appendChild(headline);
  hero.append(photoWrap, heroText);
  inner.appendChild(hero);

  // Work — Bites / Work / Long Form tabs (Figma 289:67)
  const workWrap = el('div', 'landing-work landing-work-anchor landing-work--bites-active');

  const tablist = el('div', 'landing-work-tablist');
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Bites, Work and Studies');

  const shell = el('div', 'landing-work-tab-shell');

  type TabKey = 'bites' | 'work' | 'studies';
  const TAB_DEFS: { key: TabKey; label: string; desc: string }[] = [
    { key: 'bites',   label: 'Bites',   desc: 'Little snapshots.' },
    { key: 'work',    label: 'Work',    desc: 'Recent projects, examined.' },
    { key: 'studies', label: 'Long Form', desc: 'My heart, on my sleeve.' },
  ];
  const TAB_KEYS = TAB_DEFS.map(t => t.key);
  const DEFAULT_TAB: TabKey = 'bites';

  const tabBtns = new Map<TabKey, HTMLButtonElement>();
  for (const { key, label, desc } of TAB_DEFS) {
    const btn = el('button', `landing-work-tab${key === DEFAULT_TAB ? ' landing-work-tab--active' : ''}`);
    btn.type = 'button';
    btn.id = `tab-${key}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(key === DEFAULT_TAB));
    btn.setAttribute('aria-controls', `work-panel-${key}`);
    btn.setAttribute('tabindex', key === DEFAULT_TAB ? '0' : '-1');
    btn.appendChild(el('span', 'landing-work-tab-label', label));
    btn.appendChild(el('span', 'landing-work-tab-desc', desc));
    tabBtns.set(key, btn as HTMLButtonElement);
    shell.appendChild(btn);
  }
  tablist.appendChild(shell);

  const panelsWrap = el('div', 'landing-work-panels');

  const panelBites = el('div', 'landing-work-panel');
  panelBites.id = 'work-panel-bites';
  panelBites.setAttribute('role', 'tabpanel');
  panelBites.setAttribute('aria-labelledby', 'tab-bites');
  panelBites.setAttribute('aria-hidden', 'false');
  panelBites.appendChild(renderBitesDrawer());

  const panelWork = el('div', 'landing-work-panel landing-work-panel--hidden');
  panelWork.id = 'work-panel-work';
  panelWork.setAttribute('role', 'tabpanel');
  panelWork.setAttribute('aria-labelledby', 'tab-work');
  panelWork.setAttribute('aria-hidden', 'true');
  panelWork.appendChild(renderWorkSection(undefined, productWorkIndex, true));

  const panelStudies = el('div', 'landing-work-panel landing-work-panel--hidden');
  panelStudies.id = 'work-panel-studies';
  panelStudies.setAttribute('role', 'tabpanel');
  panelStudies.setAttribute('aria-labelledby', 'tab-studies');
  panelStudies.setAttribute('aria-hidden', 'true');
  panelStudies.appendChild(
    renderStudiesGrid(aiWorkIndex, {
      onWarm: preloadCaseStudyAssets,
      onNavigate: navigateToCaseStudy,
    }),
  );

  const panelMap = new Map<TabKey, HTMLElement>([
    ['bites',   panelBites],
    ['work',    panelWork],
    ['studies', panelStudies],
  ]);

  panelsWrap.append(panelBites, panelWork, panelStudies);
  workWrap.append(tablist, panelsWrap);

  let activeTabKey: TabKey = DEFAULT_TAB;
  const activateTab = (key: TabKey) => {
    // If a case study is currently open, close it without triggering a
    // browser scroll-to-top (which location.hash = '' would cause).
    if (location.hash && /work\/.+/.test(location.hash)) {
      window.dispatchEvent(new CustomEvent('close-study'));
    }
    if (key === activeTabKey) return;
    const isLTR = TAB_KEYS.indexOf(key) > TAB_KEYS.indexOf(activeTabKey);
    shell.dataset.direction = isLTR ? 'ltr' : 'rtl';
    activeTabKey = key;
    workWrap.classList.toggle('landing-work--bites-active', key === 'bites');
    workWrap.classList.toggle('landing-work--studies-active', key === 'studies');
    for (const [k, panel] of panelMap) {
      const on = k === key;
      panel.classList.toggle('landing-work-panel--hidden', !on);
      panel.setAttribute('aria-hidden', String(!on));
    }
    for (const [k, btn] of tabBtns) {
      const on = k === key;
      btn.classList.toggle('landing-work-tab--active', on);
      btn.setAttribute('aria-selected', String(on));
      btn.setAttribute('tabindex', on ? '0' : '-1');
    }
  };

  for (const [key, btn] of tabBtns) {
    btn.addEventListener('click', () => activateTab(key));
  }

  // Arrow-key navigation (ARIA tabs pattern)
  shell.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const keys = TAB_KEYS;
    const idx = keys.indexOf(activeTabKey);
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % keys.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + keys.length) % keys.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = keys.length - 1;
    const nextKey = keys[next];
    activateTab(nextKey);
    tabBtns.get(nextKey)?.focus();
  });

  inner.appendChild(workWrap);

  // About panel
  const aboutPanel = renderAboutPanel();
  inner.appendChild(aboutPanel);

  container.appendChild(inner);

  // Rive name animation
  const nameReveal = initNameReveal(nameCanvas);

  const handleNameClick = () => {
    if (container.classList.contains('is-about')) {
      moreBtn.click();
    }
  };

  nameCanvas.addEventListener('click', handleNameClick);
  nameText.addEventListener('click', handleNameClick);

  // Apply about state visually (driven by the URL via the about-change event)
  const applyAbout = (isAbout: boolean) => {
    const currentlyAbout = container.classList.contains('is-about');
    if (currentlyAbout === isAbout) return;
    container.classList.toggle('is-about', isAbout);
    nameReveal.setDark(isAbout);
    moreBtn.setAttribute('aria-expanded', String(isAbout));
    moreBtn.textContent = isAbout ? 'LESS' : 'MORE';
    workWrap.setAttribute('aria-hidden', String(isAbout));
    aboutPanel.setAttribute('aria-hidden', String(!isAbout));
    if (!isAbout) {
      moreBtn.classList.add('no-hover');
      setTimeout(() => moreBtn.classList.remove('no-hover'), 2000);
    }
  };

  window.addEventListener('about-change', (e) => {
    const isAbout = (e as CustomEvent<{ isAbout: boolean }>).detail.isAbout;
    applyAbout(isAbout);
  });

  // Sync to current URL on initial mount
  if (location.hash.replace(/^#\/?/, '').trim() === 'about') {
    applyAbout(true);
  }

  moreBtn.addEventListener('click', () => {
    const isOpening = !container.classList.contains('is-about');
    if (isOpening) {
      location.hash = '#/about';
    } else {
      // Closing — clear hash without leaving '#' debris in the URL.
      // We're at the top of the page so no scroll jump to worry about.
      history.pushState(null, '', location.pathname + location.search);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  });
}
