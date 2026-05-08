export type WorkIndexRow = {
  year: string;
  title: string;
  category: string;
  client: string;
  /** Narrow client column (104px in Figma) vs wide (160px) */
  clientColumn: 'narrow' | 'wide';
  /** Which landing section this row belongs to */
  section: 'ai' | 'product';
  /** In-page stacked-image case study */
  slug?: string;
  /** External URL — opens in new tab instead of detail page */
  externalUrl?: string;
};

/** AI Stuffs section rows */
export const aiWorkIndex: WorkIndexRow[] = [];

/** Product Design section rows */
export const productWorkIndex: WorkIndexRow[] = [
  {
    year: '2026',
    title: 'Motel Key Card Generator',
    category: 'AI Exploration',
    client: 'Self',
    clientColumn: 'wide',
    section: 'product',
    slug: 'motel-key-card-generator',
  },
  {
    year: '2025',
    title: 'Meraki',
    category: 'Design system',
    client: 'Pfizer',
    clientColumn: 'narrow',
    section: 'product',
    slug: 'meraki-ds-update',
  },
  {
    year: '2025',
    title: 'Internal Bleed Monitor',
    category: 'Product design',
    client: 'Hemasense',
    clientColumn: 'wide',
    section: 'product',
    slug: 'post-op-bleed-monitor',
  },
  {
    year: '2025',
    title: 'Wear Tester Dashboard',
    category: 'Product design',
    client: 'The North Face',
    clientColumn: 'wide',
    section: 'product',
    slug: 'tnf-wear-tester',
  },
  {
    year: '2020–22',
    title: 'Brand Marks',
    category: 'Brand identity',
    client: 'Various',
    clientColumn: 'wide',
    section: 'product',
    slug: 'brand-marks',
  },
  {
    year: '2018',
    title: 'Startup Incubator',
    category: 'Brand identity',
    client: 'Moonshot',
    clientColumn: 'wide',
    section: 'product',
    slug: 'moonshot',
  },
];

/** Combined list (for detail page nav, preserves order) */
export const workIndex: WorkIndexRow[] = [...aiWorkIndex, ...productWorkIndex];

/** Single still in the case-study gallery */
export type CaseStudyGalleryStill = {
  src: string;
  caption: string;
  /** Override object-fit; defaults to 'cover' */
  fit?: 'cover' | 'contain';
  /** Override object-position; defaults to 'top center' */
  align?: 'left' | 'center' | 'right';
  /** Optional interactive flag label shown at the top of the image */
  interactiveLabel?: string;
  /** If true, use the full first-image height instead of the stepped-down height */
  fullHeight?: boolean;
};

/** Two frames alternating on a timer (detail page only) */
export type CaseStudyGalleryCycle = {
  caption: string;
  cycleFrames: [string, string];
  /** ms each frame stays visible before switching; default 2000 */
  cycleIntervalMs?: number;
};

/** Looping mp4 video */
export type CaseStudyGalleryVideo = {
  videoSrc: string;
  caption: string;
  fit?: 'cover' | 'contain';
  align?: 'left' | 'center' | 'right';
};

/** Interactive Rive panel */
export type CaseStudyGalleryRive = {
  riveSrc: string;
  caption: string;
  panelWidth?: number;
  panelHeight?: number;
  panelBg?: string;
  align?: 'left' | 'center' | 'right';
  interactiveBadgeSrc?: string;
  /** Optional artboard name to load from the .riv file */
  artboard?: string;
  /** Optional state machine to drive interactive playback */
  stateMachine?: string;
  /** Optional interactive flag label shown at the top of the panel */
  interactiveLabel?: string;
};

/** Inline CSS-animated canvas panel (no external file needed) */
export type CaseStudyGalleryCanvas = {
  /** Function that returns the fully-built DOM element */
  renderFn: () => HTMLElement;
  caption: string;
  panelWidth?: number;
  panelHeight?: number;
  panelBg?: string;
  align?: 'left' | 'center' | 'right';
  /** Use the first image stack height so the panel is not stepped down (bottom still fixed to viewport). */
  tallAsFirstImage?: boolean;
};

export type CaseStudyGalleryItem =
  | CaseStudyGalleryStill
  | CaseStudyGalleryCycle
  | CaseStudyGalleryVideo
  | CaseStudyGalleryRive
  | CaseStudyGalleryCanvas;

export type CaseStudy = {
  slug: string;
  headline: string;
  type: string;
  description: string;
  /** Optional live demo / product link (shown after description on detail page) */
  tryItUrl?: string;
  tryItLabel?: string;
  gallery: CaseStudyGalleryItem[];
};

// ── Canvas render functions ────────────────────────────────────────────────

function buildMerakiLoadingGraphs(): HTMLElement {
  const blue = '#2e29ff';
  const track = '#f0f0f0';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes mer4LinearSweep {
      0%   { transform: translateX(0)    scaleX(0);   }
      30%  { transform: translateX(0%)   scaleX(0.4); }
      100% { transform: translateX(100%) scaleX(0.8); }
    }
    @keyframes mer4SpinLarge { to { transform: rotate(360deg); } }
    @keyframes mer4DashLarge {
      0%   { stroke-dasharray:  85,298; stroke-dashoffset:  97; }
      50%  { stroke-dasharray: 167,217; stroke-dashoffset: -49; }
      70%  { stroke-dasharray: 333, 51; stroke-dashoffset: -49; }
      100% { stroke-dasharray:  85,298; stroke-dashoffset: -277; }
    }
    @keyframes mer4SpinSmall { to { transform: rotate(360deg); } }
    @keyframes mer4DashSmall {
      0%   { stroke-dasharray:  24,83; stroke-dashoffset:  27; }
      50%  { stroke-dasharray:  47,60; stroke-dashoffset: -14; }
      70%  { stroke-dasharray:  93,14; stroke-dashoffset: -14; }
      100% { stroke-dasharray:  24,83; stroke-dashoffset: -77; }
    }
    .mer4-ring-large, .mer4-ring-small {
      transform-box: fill-box;
      transform-origin: center;
    }
  `;
  document.head.appendChild(style);

  const frame = document.createElement('div');
  Object.assign(frame.style, {
    position: 'relative',
    width: '800px',
    height: '760px',
    overflow: 'hidden',
    flexShrink: '0',
  });

  // Linear progress bar
  const barTrack = document.createElement('div');
  Object.assign(barTrack.style, {
    position: 'absolute',
    left: '166px', top: '372px',
    width: '489px', height: '16px',
    background: track,
    borderRadius: '25px',
    overflow: 'hidden',
  });
  const barFill = document.createElement('div');
  Object.assign(barFill.style, {
    position: 'absolute',
    inset: '0',
    background: blue,
    transformOrigin: '0% 50%',
    borderRadius: '20px',
    animation: 'mer4LinearSweep 1.8s cubic-bezier(0.41,0.01,0.22,0.99) infinite',
  });
  barTrack.appendChild(barFill);
  frame.appendChild(barTrack);

  // Large circular spinner (154×154, left=166 top=488)
  const svgNS = 'http://www.w3.org/2000/svg';
  const svgLarge = document.createElementNS(svgNS, 'svg');
  svgLarge.setAttribute('width', '154');
  svgLarge.setAttribute('height', '154');
  Object.assign((svgLarge as unknown as HTMLElement).style, {
    position: 'absolute', left: '166px', top: '488px', overflow: 'visible',
  });
  const trackLarge = document.createElementNS(svgNS, 'circle');
  trackLarge.setAttribute('cx', '77'); trackLarge.setAttribute('cy', '77'); trackLarge.setAttribute('r', '61');
  trackLarge.setAttribute('fill', 'none'); trackLarge.setAttribute('stroke', track); trackLarge.setAttribute('stroke-width', '16');
  const arcLarge = document.createElementNS(svgNS, 'circle');
  arcLarge.setAttribute('cx', '77'); arcLarge.setAttribute('cy', '77'); arcLarge.setAttribute('r', '61');
  arcLarge.setAttribute('fill', 'none'); arcLarge.setAttribute('stroke', blue); arcLarge.setAttribute('stroke-width', '16');
  arcLarge.setAttribute('stroke-linecap', 'round');
  arcLarge.classList.add('mer4-ring-large');
  arcLarge.style.animation = 'mer4SpinLarge 2.4s linear infinite, mer4DashLarge 2.4s cubic-bezier(0.41,0.01,0.22,0.99) infinite';
  svgLarge.append(trackLarge, arcLarge);
  frame.appendChild(svgLarge);

  // Small circular spinner (45×45, left=533 top=181)
  const svgSmall = document.createElementNS(svgNS, 'svg');
  svgSmall.setAttribute('width', '45');
  svgSmall.setAttribute('height', '45');
  Object.assign((svgSmall as unknown as HTMLElement).style, {
    position: 'absolute', left: '533px', top: '181px', overflow: 'visible',
  });
  const trackSmall = document.createElementNS(svgNS, 'circle');
  trackSmall.setAttribute('cx', '22.5'); trackSmall.setAttribute('cy', '22.5'); trackSmall.setAttribute('r', '17');
  trackSmall.setAttribute('fill', 'none'); trackSmall.setAttribute('stroke', track); trackSmall.setAttribute('stroke-width', '5');
  const arcSmall = document.createElementNS(svgNS, 'circle');
  arcSmall.setAttribute('cx', '22.5'); arcSmall.setAttribute('cy', '22.5'); arcSmall.setAttribute('r', '17');
  arcSmall.setAttribute('fill', 'none'); arcSmall.setAttribute('stroke', blue); arcSmall.setAttribute('stroke-width', '5');
  arcSmall.setAttribute('stroke-linecap', 'round');
  arcSmall.classList.add('mer4-ring-small');
  arcSmall.style.animation = 'mer4SpinSmall 1.5s linear infinite, mer4DashSmall 1.5s cubic-bezier(0.41,0.01,0.22,0.99) infinite';
  svgSmall.append(trackSmall, arcSmall);
  frame.appendChild(svgSmall);

  return frame;
}

// ── Asset base paths ──────────────────────────────────────────────────────
const assetsBase = `${import.meta.env.BASE_URL}assets`;
const tnfBase = `${assetsBase}/TNF`;
const bmBase = `${assetsBase}/Brandmarks`;
const msBase = `${assetsBase}/Moonshot`;
const cardsBase = `${assetsBase}/Cards`;
const merakiBase = `${assetsBase}/meraki`;
const hemasenseBase = `${assetsBase}/Hemasense`;

export const caseStudies: Record<string, CaseStudy> = {
  'post-op-bleed-monitor': {
    slug: 'post-op-bleed-monitor',
    headline: 'Internal Bleed Monitor - Hemasense',
    type: 'Product Design',
    description:
      "HemaSense is an early bleed detection patch for post-surgical recovery — and this is the tablet interface that talks to it. Designed for clinical environments where information has to land at a glance from varying distances, and where accidental touches to critical functions aren't an option. Currently in clinical trials.",
    gallery: [
      {
        src: `${hemasenseBase}/HS - 1.png`,
        caption:
          'The base state — vitals monitored, patch connected, nothing demanding attention.',
        fit: 'contain',
        align: 'left',
      },
      {
        src: `${hemasenseBase}/HS - 2.png`,
        caption:
          'A disconnected patch triggers a staged warning sequence designed to be read instantly from across the room.',
        fit: 'contain',
        align: 'right',
      },
      {
        riveSrc: `${hemasenseBase}/hemasense.riv`,
        artboard: 'Alert',
        stateMachine: 'State Machine 1',
        caption:
          'Histogram of recent readings — a quick way to see how values cluster and whether anything is drifting out of range.',
        panelWidth: 840,
        panelHeight: 600,
        panelBg: '#24282E',
        align: 'left',
      },
      {
        src: `${hemasenseBase}/HS - 4.png`,
        caption: '',
        fit: 'contain',
        align: 'right',
      },
      {
        src: `${hemasenseBase}/HS - 5.png`,
        caption: '',
        fit: 'contain',
        align: 'left',
      },
    ],
  },
  'meraki-ds-update': {
    slug: 'meraki-ds-update',
    headline: 'Meraki DS Update - Pfizer',
    type: 'Design System',
    description:
      "A design system update with a twist. After refreshing Meraki's 60+ component library, I used Cursor to convert everything into React components and packaged the system as an npm module — making it instantly consumable by AI-native tools like Figma Make and Cursor. Design systems built for how work actually happens now.",
    gallery: [
      {
        src: `${merakiBase}/MER - 1.png`,
        fit: 'contain',
        align: 'left',
        caption:
          'Card components built to flex across layout contexts without losing visual consistency.',
      },
      {
        src: `${merakiBase}/MER - 2.png`,
        fit: 'contain',
        align: 'right',
        caption: 'Type foundation sheet',
      },
      {
        src: `${merakiBase}/MER - 3.png`,
        fit: 'contain',
        align: 'left',
        caption: 'Color tokens reference sheet',
      },
      {
        renderFn: buildMerakiLoadingGraphs,
        caption:
          'Loading animations with custom easing',
        panelWidth: 800,
        panelHeight: 760,
        panelBg: '#F8FBFF',
        align: 'right',
        tallAsFirstImage: true,
      },
      {
        src: `${merakiBase}/MER - 5.png`,
        fit: 'contain',
        align: 'left',
        fullHeight: true,
        caption: '',
      },
    ],
  },
  'motel-key-card-generator': {
    slug: 'motel-key-card-generator',
    headline: 'Motel Key Card Generator - Self',
    type: 'AI Exploration',
    description:
      "What if we could design our own Motel Cards? I'd probably have an English Pointer on mine, one that looks like my dog Arlo. I built this little side project with Cursor, Opus 4.6, an LLM API key, and Illustrator. Feel free to make your own cards [here], you can even download the SVG and take it with you.",
    tryItUrl: 'https://guest-card-generator.vercel.app/',
    gallery: [
      { src: `${cardsBase}/KC - 1.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${cardsBase}/KC - 2.png`, caption: 'A few of my favorites so far.', fit: 'contain', align: 'right' },
      { videoSrc: `${cardsBase}/KC-3.mp4`, caption: '', fit: 'contain', align: 'left' },
      { src: `${cardsBase}/KC - 4.png`, caption: '', fit: 'contain', align: 'right' },
    ],
  },
  'brand-marks': {
    slug: 'brand-marks',
    headline: 'Various brand marks',
    type: 'Brand identity',
    description:
      'A collection of brand marks created between 2020 and 2022. Each mark started with a problem — a name, a feeling, a market position — and ended somewhere unexpected.',
    gallery: [
      { src: `${bmBase}/BM - 1.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${bmBase}/BM - 2.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${bmBase}/BM - 3.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${bmBase}/BM - 4.png`, caption: '', fit: 'contain', align: 'right' },
      { src: `${bmBase}/BM - 5.png`, caption: '', fit: 'contain', align: 'right' },
    ],
  },
  'tnf-wear-tester': {
    slug: 'tnf-wear-tester',
    headline: 'Wear tester dashboard - The North Face',
    type: 'Product design',
    description:
      "Designed an internal tool for The North Face's wear tester team to track athlete performance and surface actionable insights from Apple Watch data. Previously reliant on manual surveys and spreadsheets, the new platform streamlined data collection and gave the team a real-time view of how gear performed in the field. The project proved successful enough that leadership began exploring how key features could be adapted for a broader customer loyalty program.",
    gallery: [
      {
        src: `${tnfBase}/TNF - 1.png`,
        caption:
          'Program member growth tracked over time — a key metric for gauging loyalty program adoption and momentum.',
        fit: 'contain',
        align: 'left',
      },
      {
        riveSrc: `${tnfBase}/tnf_line_graph.riv`,
        caption:
          'Interactive month by month member volume',
        panelWidth: 756,
        panelHeight: 860,
        panelBg: '#D1471B',
        align: 'right',
        stateMachine: 'State Machine 1',
        interactiveBadgeSrc: `${tnfBase}/Interact.svg`,
      },
      {
        riveSrc: `${tnfBase}/tnf_member_activities.riv`,
        caption:
          'Breakdown of member activity over the past 30 days across run, hike, walk, lift, ski, paddle, cycle, swim, and other activities.',
        panelWidth: 756,
        panelHeight: 860,
        panelBg: '#F7F9FC',
        align: 'left',
      },
    ],
  },
  'moonshot': {
    slug: 'moonshot',
    headline: 'Startup Incubator - Moonshot',
    type: 'Brand',
    description:
      'Brand identity for Moonshot, a startup incubator built around the idea that the right environment unlocks outsized outcomes. The work covers naming, visual identity, and the design language used across their program materials.',
    gallery: [
      { src: `${msBase}/MS - 1.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${msBase}/MS - 2.png`, caption: '', fit: 'contain', align: 'right' },
      { src: `${msBase}/MS - 3.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${msBase}/MS - 4.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${msBase}/MS - 5.png`, caption: '', fit: 'contain', align: 'left' },
    ],
  },
};
