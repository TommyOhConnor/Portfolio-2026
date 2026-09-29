import './style-v2.css';
import { renderV2Landing } from './render/v2-landing';

const UMAMI_WEBSITE_ID = '42efc21e-f852-49d9-8d77-86e50de9118f';
const UMAMI_SCRIPT = 'https://cloud.umami.is/script.js';

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
    /* storage blocked */
  }

  const s = document.createElement('script');
  s.defer = true;
  s.src = UMAMI_SCRIPT;
  s.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
  document.head.appendChild(s);
}

const root = document.querySelector<HTMLElement>('#app');
if (!root) throw new Error('#app missing');

initUmami();
renderV2Landing(root);
document.title = "Tommy O'Connor — Portfolio";
