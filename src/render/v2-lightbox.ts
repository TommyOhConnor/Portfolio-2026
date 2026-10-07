import type { V2MediaTile } from '../data/v2-content';

const base = import.meta.env.BASE_URL;

type Lightbox = {
  open: (items: V2MediaTile[], index: number) => void;
};

let instance: Lightbox | null = null;

// Item-to-item motion: each item keeps its own size and slides along the direction of travel.
// Strong ease-out; the exit is quicker than the entrance so the new item wins attention.
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
// Quart ease-out with a visible tail so the incoming image glides the last few pixels into place
const EASE_SETTLE = 'cubic-bezier(0.25, 1, 0.5, 1)';
const ENTER_FADE_MS = 300;
const ENTER_SLIDE_MS = 600;
const EXIT_MS = 180;
// The caption follows as a second beat, once the image has mostly arrived
const CAPTION_DELAY_MS = 240;
const CAPTION_MS = 360;
const CAPTION_RISE_PX = 8;
const SLIDE_PX = 64;

/** -1 = previous, 1 = next, 0 = no animation (open, keyboard) */
type Direction = -1 | 0 | 1;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function arrowButton(direction: 'prev' | 'next'): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `v2-lightbox-arrow v2-lightbox-arrow--${direction}`;
  btn.setAttribute('aria-label', direction === 'prev' ? 'Previous image' : 'Next image');
  btn.innerHTML = `<img src="${base}assets/v2/arrow.svg" width="40" height="40" alt="" aria-hidden="true" />`;
  return btn;
}

function createLightbox(): Lightbox {
  const dialog = document.createElement('dialog');
  dialog.className = 'v2-lightbox';
  dialog.setAttribute('aria-label', 'Image viewer');
  // Focusable so open() can focus the dialog itself rather than the first arrow button;
  // otherwise arrow-key navigation lights up a focus ring on the ← control.
  dialog.tabIndex = -1;

  const frame = document.createElement('div');
  frame.className = 'v2-lightbox-frame';

  const media = document.createElement('div');
  media.className = 'v2-lightbox-media';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'v2-lightbox-toggle';

  const footer = document.createElement('div');
  footer.className = 'v2-lightbox-footer';
  const caption = document.createElement('p');
  caption.className = 'v2-lightbox-caption';
  footer.append(caption);
  // Arrows live outside the frame, pinned to the screen edges so they never move between items
  const prev = arrowButton('prev');
  const next = arrowButton('next');

  frame.append(media, footer);
  dialog.append(frame, prev, next);
  document.body.appendChild(dialog);

  let items: V2MediaTile[] = [];
  let index = 0;
  let video: HTMLVideoElement | null = null;
  let running: Animation[] = [];
  let ghost: HTMLElement | null = null;

  /** Jump any in-flight transition to its end so a new one starts from a clean state */
  const settle = () => {
    for (const animation of running) animation.cancel();
    running = [];
    ghost?.remove();
    ghost = null;
  };

  const preload = (i: number) => {
    const tile = items[(i + items.length) % items.length];
    if (tile.src) new Image().src = encodeURI(tile.src);
  };

  /** Freeze the current item (media + caption) in place at its current size so it can slide out */
  const createGhost = (outgoing: Element): HTMLElement => {
    const rect = frame.getBoundingClientRect();
    const mediaRect = media.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'v2-lightbox-frame v2-lightbox-ghost';
    layer.setAttribute('aria-hidden', 'true');
    layer.style.left = `${rect.left}px`;
    layer.style.top = `${rect.top}px`;
    layer.style.width = `${rect.width}px`;

    const box = document.createElement('div');
    box.className = 'v2-lightbox-media';
    box.style.width = `${mediaRect.width}px`;
    box.style.height = `${mediaRect.height}px`;
    box.appendChild(outgoing);

    layer.append(box, footer.cloneNode(true));
    dialog.prepend(layer);
    return layer;
  };

  const animateChange = (direction: -1 | 1) => {
    const reduce = prefersReducedMotion();
    const offset = (sign: number) => (reduce ? 'none' : `translateX(${sign * SLIDE_PX}px)`);

    // Opacity lands quickly; position keeps drifting so the slide settles slowly at the end
    running.push(
      frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ENTER_FADE_MS, easing: EASE_OUT }),
      frame.animate([{ transform: offset(direction) }, { transform: 'none' }], {
        duration: ENTER_SLIDE_MS,
        easing: EASE_SETTLE,
      }),
      caption.animate(
        [
          { opacity: 0, transform: reduce ? 'none' : `translateY(${CAPTION_RISE_PX}px)` },
          { opacity: 1, transform: 'none' },
        ],
        // backwards fill keeps the caption hidden during its delay
        { duration: CAPTION_MS, delay: CAPTION_DELAY_MS, easing: EASE_OUT, fill: 'backwards' },
      ),
    );

    if (ghost) {
      const leaving = ghost;
      const exit = leaving.animate(
        [
          { opacity: 1, transform: 'none' },
          { opacity: 0, transform: offset(-direction) },
        ],
        { duration: EXIT_MS, easing: EASE_OUT, fill: 'forwards' },
      );
      exit.onfinish = () => {
        leaving.remove();
        if (ghost === leaving) ghost = null;
      };
      running.push(exit);
    }
  };

  const renderToggle = () => {
    if (!video) return;
    const paused = video.paused;
    toggle.innerHTML = paused
      ? `<img class="v2-play-icon" src="${base}assets/v2/play.svg" width="10" height="10" alt="" aria-hidden="true" /><span class="v2-play-label">Play</span>`
      : '<span class="v2-pause-icon" aria-hidden="true"><span></span><span></span></span><span class="v2-play-label">Pause</span>';
    toggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
  };

  const show = (i: number, direction: Direction = 0) => {
    settle();
    index = (i + items.length) % items.length;
    const tile = items[index];

    video?.pause();
    video = null;
    const outgoing = direction ? media.querySelector('.v2-lightbox-el') : null;
    if (outgoing) ghost = createGhost(outgoing);
    media.replaceChildren();
    media.style.setProperty('--v2-lightbox-ar', `${tile.mediaWidth / tile.mediaHeight}`);

    if (tile.videoSrc) {
      video = document.createElement('video');
      video.src = encodeURI(tile.videoSrc);
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.autoplay = true;
      video.className = 'v2-lightbox-el';
      video.addEventListener('play', renderToggle);
      video.addEventListener('pause', renderToggle);
      media.append(video, toggle);
      renderToggle();
    } else if (tile.src) {
      const img = document.createElement('img');
      img.src = encodeURI(tile.src);
      img.alt = tile.alt ?? '';
      img.className = 'v2-lightbox-el';
      media.appendChild(img);
    }

    caption.textContent = tile.caption;
    const multiple = items.length > 1;
    prev.hidden = !multiple;
    next.hidden = !multiple;

    if (multiple) {
      preload(index + 1);
      preload(index - 1);
    }

    if (direction) animateChange(direction);
  };

  const close = () => dialog.close();

  toggle.addEventListener('click', () => {
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  });
  prev.addEventListener('click', () => show(index - 1, -1));
  next.addEventListener('click', () => show(index + 1, 1));

  // Clicking the dimmed backdrop (the dialog itself, outside the frame) closes it
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Arrow keys animate like the arrow buttons; a held key interrupts cleanly via settle()
  dialog.addEventListener('keydown', (e) => {
    if (items.length < 2) return;
    if (e.key === 'ArrowLeft') show(index - 1, -1);
    if (e.key === 'ArrowRight') show(index + 1, 1);
  });
  dialog.addEventListener('close', () => {
    settle();
    video?.pause();
    video = null;
    media.replaceChildren();
    document.documentElement.classList.remove('v2-lightbox-open');
  });

  return {
    open(nextItems, startIndex) {
      items = nextItems;
      show(startIndex);
      document.documentElement.classList.add('v2-lightbox-open');
      dialog.showModal();
      dialog.focus();
    },
  };
}

export function openV2Lightbox(items: V2MediaTile[], index: number): void {
  instance ??= createLightbox();
  instance.open(items, index);
}
