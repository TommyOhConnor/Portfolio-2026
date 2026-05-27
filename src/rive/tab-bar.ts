import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

const baseUrl = import.meta.env.BASE_URL;

const WORK_SM  = 'Work SM';
const BITES_SM = 'Bites SM';
const ALL_SMS  = [WORK_SM, BITES_SM, 'Studies SM'];
const OUT_DELAY = 500;

export interface TabBarControls {
  setActive(tab: 'work' | 'studies'): void;
  destroy(): void;
}

export function initTabBar(
  canvas: HTMLCanvasElement,
  onSelectWork: () => void,
  onSelectStudies: () => void,
): TabBarControls {
  let activeSM = WORK_SM;

  const r = new Rive({
    src: `${baseUrl}assets/Tab.riv`,
    canvas,
    stateMachines: ALL_SMS,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),

    onLoadError: (e) => console.error('[TabBar] load error:', e),

    onLoad: () => {
      try {
        const b = r.bounds;
        const artW = b.maxX - b.minX;
        const artH = b.maxY - b.minY;
        if (artW > 0 && artH > 0) {
          const dpr = window.devicePixelRatio || 1;
          canvas.width = artW * dpr;
          canvas.height = artH * dpr;
          canvas.style.width = `${artW}px`;
          canvas.style.height = `${artH}px`;
        }
      } catch { /* keep attribute dimensions */ }
      r.resizeDrawingSurfaceToCanvas();

      // Work is active by default
      const workIsOn = getIsOn(WORK_SM);
      const bitesIsOn = getIsOn(BITES_SM);
      if (workIsOn)  workIsOn.value  = true;
      if (bitesIsOn) bitesIsOn.value = false;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getIsOn(smName: string): any {
    return r.stateMachineInputs(smName)?.find((i: any) => i.name === 'isOn');
  }

  function activate(smName: string) {
    if (smName === activeSM) return;
    const outIsOn = getIsOn(activeSM);
    if (outIsOn) outIsOn.value = false;
    activeSM = smName;
    setTimeout(() => {
      const inIsOn = getIsOn(smName);
      if (inIsOn) inIsOn.value = true;
      if (smName === WORK_SM) onSelectWork();
      else onSelectStudies();
    }, OUT_DELAY);
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const isLeft = (e.clientX - rect.left) < rect.width / 2;
    activate(isLeft ? WORK_SM : BITES_SM);
  });

  return {
    setActive(tab) {
      activate(tab === 'work' ? WORK_SM : BITES_SM);
    },
    destroy() { r.cleanup(); },
  };
}
