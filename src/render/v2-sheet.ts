import type { V2WorkProject } from '../data/v2-content';

const base = import.meta.env.BASE_URL;

// Placeholder body copy from the Figma frame (605:572) until the project pages are designed
const PLACEHOLDER_CAPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea consequat.';

type Sheet = {
  open: (project: V2WorkProject) => void;
};

let instance: Sheet | null = null;

// Pull-to-dismiss: scrolling up past the top of the sheet (or dragging it down on touch) moves
// the sheet with resistance; far enough, or a fast enough flick, closes it.
/** Fraction of the pull the sheet actually moves, for a rubber-band feel */
const PULL_RESISTANCE = 0.4;
/** Visible pull distance that closes the sheet */
const PULL_CLOSE_PX = 100;
/** Touch flick speed (px/ms) that closes regardless of distance */
const FLICK_CLOSE_VELOCITY = 0.5;
/** Quiet time between wheel events that marks a new gesture */
const WHEEL_GESTURE_GAP_MS = 150;
const SETTLE_TRANSITION = 'translate 400ms cubic-bezier(0.23, 1, 0.32, 1)';

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

function buildContent(project: V2WorkProject): HTMLElement {
  const layout = el('div', 'v2-sheet-layout');

  const intro = el('div', 'v2-sheet-intro');
  const heading = el('div', 'v2-sheet-heading');
  const title = el('h2', 'v2-sheet-title', project.title);
  title.id = 'v2-sheet-title';
  if (project.client) title.appendChild(el('span', 'v2-sheet-client', project.client));
  heading.appendChild(title);
  if (project.tag) heading.appendChild(el('span', 'v2-sheet-tag', project.tag));
  intro.append(heading, el('p', 'v2-sheet-desc', project.description));

  // Right column: gray placeholders and caption straight from the Figma frame
  const media = el('div', 'v2-sheet-media');
  media.append(
    el('div', 'v2-sheet-placeholder v2-sheet-placeholder--lead'),
    el('p', 'v2-sheet-caption', PLACEHOLDER_CAPTION),
    el('div', 'v2-sheet-placeholder v2-sheet-placeholder--second'),
  );

  layout.append(intro, media);
  return layout;
}

/**
 * Down-arrow cursor over the gap, drawn as an element so it can fade in and out; the system
 * pointer can't be animated, so it simply returns underneath as the arrow fades away. Lives
 * inside the dialog because the dialog renders in the top layer, above any other page element.
 * Until this runs (or on touch / coarse pointers) the gap keeps its CSS arrow cursor.
 */
function installGapCursor(dialog: HTMLDialogElement, gap: HTMLElement): void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // Outer node tracks the mouse with no transition; inner node fades and scales
  const cursor = el('div', 'v2-gap-cursor');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `<img class="v2-gap-cursor-inner" src="${base}assets/v2/arrow-down.svg" width="32" height="32" alt="" />`;
  dialog.appendChild(cursor);
  dialog.classList.add('has-gap-cursor');

  let frame = 0;
  let x = 0;
  let y = 0;
  const place = () => {
    frame = 0;
    cursor.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
  };

  dialog.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    if (!frame) frame = requestAnimationFrame(place);
    cursor.classList.toggle('is-visible', e.target === gap);
  });
  dialog.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  dialog.addEventListener('close', () => cursor.classList.remove('is-visible'));
}

function createSheet(): Sheet {
  const dialog = el('dialog', 'v2-sheet-dialog');
  dialog.setAttribute('aria-labelledby', 'v2-sheet-title');
  dialog.tabIndex = -1;

  // The strip of page left visible above the sheet; hovering it nudges the sheet down (CSS),
  // clicking it closes. It sits before the sheet so `.v2-sheet-gap:hover + .v2-sheet` works.
  const gap = el('button', 'v2-sheet-gap');
  gap.type = 'button';
  gap.setAttribute('aria-label', 'Close project and return to work');

  const sheet = el('div', 'v2-sheet');
  dialog.append(gap, sheet);
  document.body.appendChild(dialog);
  installGapCursor(dialog, gap);

  let closing = false;

  const clearPull = () => {
    sheet.style.translate = '';
    sheet.style.transition = '';
  };

  const finishClose = () => {
    closing = false;
    clearPull();
    dialog.close();
  };

  const close = () => {
    if (!dialog.open || closing) return;
    closing = true;
    dialog.classList.remove('is-open');
    // Wait for the slide-down; fall back to a timer if no transition runs (reduced motion, etc.)
    const fallback = window.setTimeout(finishClose, 1100);
    sheet.addEventListener(
      'transitionend',
      (e) => {
        if (e.target !== sheet || e.propertyName !== 'transform') return;
        window.clearTimeout(fallback);
        finishClose();
      },
      { once: true },
    );
  };

  // Follow the pull directly: only `transform` (the open/close slide) keeps its transition
  const setPull = (offset: number) => {
    sheet.style.transition = 'transform 1000ms cubic-bezier(0.32, 0.72, 0, 1)';
    sheet.style.translate = `0 ${offset}px`;
  };

  const releasePull = () => {
    if (closing) return;
    sheet.style.transition = SETTLE_TRANSITION;
    sheet.style.translate = '';
    sheet.addEventListener('transitionend', () => !closing && clearPull(), { once: true });
  };

  // Wheel / trackpad. Only a gesture that starts while already at the top counts, so momentum
  // from scrolling back up through the content can't dismiss the sheet by accident.
  let wheelPull = 0;
  let wheelArmed = false;
  let lastWheel = 0;
  let wheelEndTimer = 0;
  sheet.addEventListener(
    'wheel',
    (e) => {
      const freshGesture = e.timeStamp - lastWheel > WHEEL_GESTURE_GAP_MS;
      lastWheel = e.timeStamp;
      if (closing) return;
      if (sheet.scrollTop > 0) {
        wheelArmed = false;
        return;
      }
      if (freshGesture) wheelArmed = true;
      if (!wheelArmed) return;

      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (delta > 0 && wheelPull === 0) return; // ordinary downward scroll
      e.preventDefault();
      wheelPull = Math.max(0, wheelPull - delta);
      const offset = wheelPull * PULL_RESISTANCE;
      setPull(offset);
      window.clearTimeout(wheelEndTimer);
      if (offset >= PULL_CLOSE_PX) {
        wheelPull = 0;
        close();
        return;
      }
      wheelEndTimer = window.setTimeout(() => {
        wheelPull = 0;
        releasePull();
      }, WHEEL_GESTURE_GAP_MS);
    },
    { passive: false },
  );

  // Touch: drag the sheet down from the top; distance or flick velocity closes it
  let touchStartY = 0;
  let touchStartTime = 0;
  let touchOffset = 0;
  let touchTracking = false;
  sheet.addEventListener(
    'touchstart',
    (e) => {
      if (closing || e.touches.length !== 1) return;
      touchTracking = sheet.scrollTop <= 0;
      touchStartY = e.touches[0].clientY;
      touchStartTime = e.timeStamp;
      touchOffset = 0;
    },
    { passive: true },
  );
  sheet.addEventListener(
    'touchmove',
    (e) => {
      if (!touchTracking || closing) return;
      const dy = e.touches[0].clientY - touchStartY;
      if (dy <= 0) {
        if (touchOffset > 0) setPull((touchOffset = 0));
        return; // scrolling the content down as normal
      }
      e.preventDefault();
      touchOffset = dy * PULL_RESISTANCE;
      setPull(touchOffset);
    },
    { passive: false },
  );
  const endTouch = (e: TouchEvent) => {
    if (!touchTracking) return;
    touchTracking = false;
    if (touchOffset <= 0) return;
    const velocity = touchOffset / PULL_RESISTANCE / Math.max(1, e.timeStamp - touchStartTime);
    if (touchOffset >= PULL_CLOSE_PX || velocity >= FLICK_CLOSE_VELOCITY) close();
    else releasePull();
    touchOffset = 0;
  };
  sheet.addEventListener('touchend', endTouch);
  sheet.addEventListener('touchcancel', endTouch);

  gap.addEventListener('click', close);
  // Esc: animate out instead of the dialog's instant close
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => {
    dialog.classList.remove('is-open');
    document.documentElement.classList.remove('v2-sheet-open');
  });

  return {
    open(project) {
      if (closing) finishClose();
      sheet.replaceChildren(buildContent(project));
      sheet.scrollTop = 0;
      document.documentElement.classList.add('v2-sheet-open');
      dialog.showModal();
      dialog.focus();
      // Next frame so the closed transform is committed before sliding up
      requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-open')));
    },
  };
}

export function openV2Sheet(project: V2WorkProject): void {
  instance ??= createSheet();
  instance.open(project);
}
