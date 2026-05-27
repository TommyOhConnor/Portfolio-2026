import './style.css';
import { renderLanding } from './render/landing';
import { renderDetail } from './render/detail';
import { renderDetailMobile } from './render/detail-mobile';
import { caseStudies } from './data/projects';

const MOBILE_BREAKPOINT = 768;

const UMAMI_WEBSITE_ID = '42efc21e-f852-49d9-8d77-86e50de9118f';
const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js';

/** Umami Cloud — production only; opt out via localStorage or ?umami_disable=1. */
function initUmami(): void {
  if (import.meta.env.DEV) return;

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('umami_disable') === '1') {
      localStorage.setItem('umami.disabled', '1');
      params.delete('umami_disable');
      const qs = params.toString();
      const next =
        `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', next || window.location.pathname);
    }
  } catch {
    /* storage blocked */
  }

  try {
    if (localStorage.getItem('umami.disabled') === '1') return;
  } catch {
    /* storage blocked — still load analytics */
  }

  const s = document.createElement('script');
  s.defer = true;
  s.src = UMAMI_SCRIPT;
  s.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
  document.head.appendChild(s);
}

let root: HTMLElement;
{
  const el = document.querySelector<HTMLElement>('#app');
  if (!el) throw new Error('#app missing');
  root = el;
}

initUmami();

// Landing is rendered once and stays in the DOM permanently.
renderLanding(root);

// Detail pages mount as a fixed overlay on top and are removed on back navigation.
let detailEl: HTMLElement | null = null;

type Route =
  | { name: 'landing' }
  | { name: 'about' }
  | { name: 'detail'; slug: string };

function parseHash(): Route {
  const raw = location.hash.replace(/^#\/?/, '').trim();
  if (!raw) return { name: 'landing' };
  if (raw === 'about') return { name: 'about' };
  const work = raw.match(/^work\/(.+)$/);
  if (work) return { name: 'detail', slug: work[1] };
  return { name: 'landing' };
}

function setArticleDetailUi(active: boolean): void {
  root.classList.toggle('is-article-detail', active);
}

function setAboutRoute(active: boolean): void {
  window.dispatchEvent(
    new CustomEvent<{ isAbout: boolean }>('about-change', {
      detail: { isAbout: active },
    }),
  );
}

function trackEvent(name: string): void {
  const w = window as unknown as { umami?: { track: (n: string) => void } };
  try {
    w.umami?.track(name);
  } catch {
    /* analytics blocked */
  }
}

function render() {
  const route = parseHash();

  if (route.name === 'landing' || route.name === 'about') {
    if (detailEl) {
      detailEl.remove();
      detailEl = null;
    }
    setArticleDetailUi(false);
    setAboutRoute(route.name === 'about');
    if (route.name === 'about') {
      document.title = "About — Tommy O'Connor";
      trackEvent('view-about');
    } else {
      document.title = "Tommy O'Connor — Portfolio";
    }
  } else {
    setAboutRoute(false);
    if (detailEl) detailEl.remove();
    detailEl = document.createElement('div');
    document.body.appendChild(detailEl);
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      detailEl.style.cssText = 'position: fixed; inset: 0; z-index: 10; overflow-y: auto; background: #fff;';
      renderDetailMobile(detailEl, route.slug);
    } else {
      detailEl.style.cssText = 'position: fixed; inset: 0; z-index: 10;';
      renderDetail(detailEl, route.slug);
    }

    // Scroll background so the work block sits ~40px from the top
    requestAnimationFrame(() => {
      const anchor = document.querySelector<HTMLElement>('.landing-work-anchor');
      if (anchor) {
        const { top } = anchor.getBoundingClientRect();
        window.scrollBy({ top: top - 40, behavior: 'smooth' });
      }
    });

    const study = caseStudies[route.slug];
    setArticleDetailUi(study?.detailLayout === 'article');
    document.title = study
      ? `${study.headline} — Tommy O'Connor`
      : "Project — Tommy O'Connor";
  }
}

window.addEventListener('hashchange', render);

// Closing a study from a tab click: remove overlay + silently clear URL,
// bypassing the browser's default scroll-to-top on hash change.
window.addEventListener('close-study', () => {
  if (detailEl) {
    detailEl.remove();
    detailEl = null;
    setArticleDetailUi(false);
    history.replaceState(null, '', location.pathname + location.search);
    document.title = "Tommy O'Connor — Portfolio";
  }
});

render();
