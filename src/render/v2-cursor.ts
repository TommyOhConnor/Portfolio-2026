const base = import.meta.env.BASE_URL;

/** Elements that swap the system pointer for the "See project" cursor */
const TARGET_SELECTOR = '.v2-tile';
/** Half the cursor's 80px size, so its center sits on the pointer position */
const HOTSPOT_PX = 40;

let installed = false;

/**
 * "See project" cursor for thumbnails (Figma 612:12). A fixed element follows the mouse and uses
 * mix-blend-mode: difference, so the white circle inverts whatever it's over: black on the white
 * poster, near-white on dark tiles. A native cursor can't blend, hence the DOM element.
 *
 * Only runs for a fine hover pointer. Until it runs, tiles keep the baked PNG cursor from CSS, and
 * `v2-cursor-active` on <html> is what hides the system pointer, so nothing breaks without JS.
 */
export function installV2Cursor(): void {
  if (installed) return;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;
  installed = true;

  // Outer node tracks the mouse with no transition; inner node animates in and out
  const cursor = document.createElement('div');
  cursor.className = 'v2-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = `<img class="v2-cursor-inner" src="${base}assets/v2/pointer.svg" width="80" height="80" alt="" />`;
  document.body.appendChild(cursor);
  document.documentElement.classList.add('v2-cursor-active');

  let x = -100;
  let y = -100;
  let frame = 0;

  const place = () => {
    frame = 0;
    cursor.style.transform = `translate3d(${x - HOTSPOT_PX}px, ${y - HOTSPOT_PX}px, 0)`;
  };

  const setVisible = (visible: boolean) => {
    cursor.classList.toggle('v2-cursor--visible', visible);
  };

  const overTarget = (node: Element | null) =>
    !!node?.closest(TARGET_SELECTOR) && !document.querySelector('dialog[open]');

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return setVisible(false);
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(place);
      setVisible(overTarget(e.target as Element));
    },
    { passive: true },
  );

  // Content can scroll under a still mouse (wheel, drag momentum); re-check what's underneath
  window.addEventListener(
    'scroll',
    () => setVisible(overTarget(document.elementFromPoint(x, y))),
    { passive: true, capture: true },
  );

  document.documentElement.addEventListener('pointerleave', () => setVisible(false));
  // Opening the lightbox covers the tiles; hide straight away rather than on the next move
  document.addEventListener('click', (e) => {
    if ((e.target as Element).closest(TARGET_SELECTOR)) setVisible(false);
  });
}
