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
  /** Muted subtitle line (Studies grid cards) */
  subtitle?: string;
  /** Thumbnail for Studies grid */
  thumbnailSrc?: string;
  /** Solid fill when no thumbnail image */
  thumbnailPlaceholder?: string;
};

/** AI Stuffs / Studies section rows */
export const aiWorkIndex: WorkIndexRow[] = [
  {
    year: '',
    title: 'CX-DS, Part 1',
    subtitle: 'AI-optimized multi-theme design system package',
    category: '',
    client: 'Pfizer',
    clientColumn: 'wide',
    section: 'ai',
    slug: 'cx-ds',
    thumbnailSrc: `${import.meta.env.BASE_URL}assets/studies/cx-ds/CX-DS Thumbnail.png`,
  },
  {
    year: '',
    title: 'Node-based agent workflows',
    subtitle: 'Experiment / Thought',
    category: '',
    client: 'Self',
    clientColumn: 'wide',
    section: 'ai',
    slug: 'ai-based-affordance-layers',
    thumbnailSrc: `${import.meta.env.BASE_URL}assets/studies/ai-affordance-layers/thumb-ai-affordance.png`,
  },
  {
    year: '',
    title: 'Ultrarunning and Design, a comparison',
    subtitle: 'Missive',
    category: '',
    client: 'Self',
    clientColumn: 'wide',
    section: 'ai',
    slug: 'ultrarunning-as-design-analogy',
    thumbnailSrc: `${import.meta.env.BASE_URL}assets/studies/ultrarunning-as-design-analogy/finish-line.gif`,
  },
];

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

export type ArticleFigure = {
  src: string;
  alt: string;
  wide?: boolean;
  label?: string;
  description?: string;
  /** Override the figure container background; defaults to white for most, #f7f9fc for feature figures */
  bg?: 'white' | 'surface';
  /** Optional caption below the image */
  caption?: string;
};

export type ArticleSection =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  /** Geist Mono Bold 16px sub-label (e.g. "Single chat thread") */
  | { kind: 'mono-label'; text: string }
  | { kind: 'body'; paragraphs: (string | { text: string; variant?: 'disclaimer' })[] }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'figure'; src: string; alt: string; wide?: boolean; maxWidth?: number; caption?: string }
  | { kind: 'video'; src: string; alt: string; poster?: string; wide?: boolean }
  | {
      kind: 'table';
      headers: [string, string, string];
      rows: [string, string, string][];
    }
  | { kind: 'twoFigures'; left: ArticleFigure; right: ArticleFigure }
  | { kind: 'feature'; title: string; description: string; figure: ArticleFigure };

export type CaseStudy = {
  slug: string;
  headline: string;
  type: string;
  description: string;
  /** Optional live demo / product link (shown after description on detail page) */
  tryItUrl?: string;
  tryItLabel?: string;
  gallery: CaseStudyGalleryItem[];
  /** Article layout for Studies (replaces stacked gallery detail) */
  detailLayout?: 'gallery' | 'article';
  article?: ArticleSection[];
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
const studiesBase = `${assetsBase}/studies/ai-affordance-layers`;
const cxDsBase = `${assetsBase}/studies/cx-ds`;
const ultraBase = `${assetsBase}/studies/ultrarunning-as-design-analogy`;

export const caseStudies: Record<string, CaseStudy> = {
  'post-op-bleed-monitor': {
    slug: 'post-op-bleed-monitor',
    headline: 'Internal Bleed Monitor - Hemasense',
    type: 'Product Design',
    description:
      'HemaSense is an early-stage medtech startup looking to create an alert system to catch internal bleeding in post-op patients. The hardware consists of a patch that is applied after surgery, and a tablet that would accompany the patient into their recovery room. I designed the interface for the tablet, alarm animations, and a component library.',
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
        caption: 'One of the alarm sequences',
        panelWidth: 840,
        panelHeight: 600,
        panelBg: '#24282E',
        align: 'left',
      },
      {
        src: `${hemasenseBase}/HS - 4.png`,
        caption: 'Patch battery alert states',
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
      "In 2024 I started work with an internal team at Pfizer to build the Meraki design system. We spent the next year and a half building a comprehensive system that housed 50+ components, countless token variables, animations, and a few design kits. In 2026 I was able to update the system to prepare it for LLM usage.",
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
        caption: 'The updated system in action.',
      },
    ],
  },
  'motel-key-card-generator': {
    slug: 'motel-key-card-generator',
    headline: 'Motel Key Card Generator - Self',
    type: 'AI Exploration',
    description:
      "What if we could design our own Motel Cards? I'd probably have an English Pointer on mine, one that looks like my dog Arlo. I built this little side project with Cursor, Opus 4.6, an LLM API key, and Illustrator. Feel free to make your own cards [here], you can even download the SVG when you're done and take it with you.",
    tryItUrl: 'https://guest-card-generator.vercel.app/',
    gallery: [
      { src: `${cardsBase}/KC - 1.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${cardsBase}/KC - 2.png`, caption: 'A few of my favorites so far.', fit: 'contain', align: 'right' },
      { videoSrc: `${cardsBase}/KC-3.mp4`, caption: 'The editor in action.', fit: 'contain', align: 'left' },
      { src: `${cardsBase}/KC - 4.png`, caption: '', fit: 'contain', align: 'right' },
    ],
  },
  'brand-marks': {
    slug: 'brand-marks',
    headline: 'Various brand marks',
    type: 'Brand identity',
    description:
      'A collection of brand marks created between 2020 and 2022.',
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
      "Designed an internal tool for The North Face's wear tester team to track athlete performance and surface actionable insights from wearable data. Previously reliant on manual surveys and spreadsheets, the new platform streamlined data collection and gave the team a real-time view of how gear performed in the field. I designed the interface, user flows, and data visual as well as their interactions/animations.",
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
      { src: `${msBase}/MS - 1.png`, caption: 'Brand mark', fit: 'contain', align: 'left' },
      { src: `${msBase}/MS - 2.png`, caption: 'Brand pattern', fit: 'contain', align: 'right' },
      { src: `${msBase}/MS - 3.png`, caption: '', fit: 'contain', align: 'left' },
      { src: `${msBase}/MS - 4.png`, caption: 'Illustration', fit: 'contain', align: 'left' },
      { src: `${msBase}/MS - 5.png`, caption: '', fit: 'contain', align: 'left' },
    ],
  },
  'cx-ds': {
    slug: 'cx-ds',
    headline: 'CX-DS, Part 1',
    type: 'AI-optimized multi-theme design system package',
    description:
      'Part one of a three-part series on building a multi-themed, agent-readable design system at Pfizer.',
    detailLayout: 'article',
    gallery: [],
    article: [
      {
        kind: 'body',
        paragraphs: [
          '*This is the first of a three part series on the CX-DS project at Pfizer.*',
        ],
      },
      { kind: 'h2', text: 'Background' },
      {
        kind: 'body',
        paragraphs: [
          "At Pfizer we're going through the exact challenge that every other mature company is facing in the AI age: 'how do we get agents to accurately use our design systems in their output?'",
          "If you're dealing with this issue then our story might feel familiar. We started building Meraki a few years ago. It lives in Figma with variables, tokens, 50+ components \u2013 all in all, a pretty typical setup. Our first attempt to make Meraki accessible by agents we turned our library into React components using Cursor and the Figma MCP, then we stored them in Storybook. Once we had our full set of coded components, we published them as a NPM package. We assumed we could just tell an agent to 'install npm meraki' and the agent would know what to do from there. If you've gone through this process then you already know that this assumption was naive at best. The outputs were really disappointing - they were worse than not using a design system package at all.",
        ],
      },
      {
        kind: 'figure',
        src: `${cxDsBase}/initial-meraki.png`,
        alt: 'Initial Meraki design system outputs from agent-driven builds',
        wide: true,
        caption: 'An output after importing the Meraki design system',
      },
      { kind: 'h2', text: 'Post-fail reflection' },
      {
        kind: 'body',
        paragraphs: [
          "Our first attempt taught us a lot, but it also caused us to take a step back and have some big conversations about what we actually needed. My team's outputs are very broad. We design mobile apps, desktop apps, websites, heck even emails. And the audience for these products are scientists, manufacturing, internal, external. We started wondering if a more compliant Meraki was really what we needed. AI is 'democratizing design' \u2014 I hate that term \u2014 so should we really be spending this time to create a design system that produces the exact design aesthetic for a business web app that Ken in accounting is vibe coding, as it uses for a consumer facing learning website our CX team is working on? Every single time? It seemed like the safe route, but maybe too myopic.",
          "The other technical bit of learning we did is that including a GUIDELINES.md file is very helpful at communicating the system rules to the agents. If you don't know a guidelines file is an extensive set of do's and don'ts that is read every time you give the agent a command. We also learned that some pre-built component packages, like Shadcn, are known entities to agents \u2014 so they're already really good at using them.",
        ],
      },
      { kind: 'h2', text: 'The decision' },
      {
        kind: 'body',
        paragraphs: [
          'We ultimately decided to build something flexible and multi-themed, but still adherent to the brand; so, not the safe route. This meant that we needed to develop a really dynamic typography system so we could have themes that worked well on a mobile app interface, as well as large and bold for a marketing website. We also needed to create a similar semantic spacing system that addressed that gap as well.',
          'In the end what we decided was:',
        ],
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          "Use the Shadcn library as a base with it's own high-level GUIDELINES.md file for all rules that are general (non-theme) in nature",
          'Then build multiple themes for various use cases, with their own GUIDELINES.md files for theme-specific rules',
          'Finally to help us work on the themes we decided to build a web application with workflow tools to help us see, build, and test the system',
        ],
      },
      {
        kind: 'body',
        paragraphs: [
          "If you were wondering about good ol Meraki, it was put on the back-burner for now. However, we're planning on creating a theme that mirrors it.",
        ],
      },
      { kind: 'h2', text: "How it's going" },
      {
        kind: 'body',
        paragraphs: [
          "As of this writing we have two themes completed, which has allowed us to start testing theme selection workflows. Our guidelines file is nearing 4k lines of rules, which sounds completely insane. In testing we've seen a huge improvement in the consistency of the outputs. We've had the best results when using a CLI to drive the canvas via MCP server. So far Paper has been excellent, and Figma seems to be getting better.",
          'The unsung hero in this first phase of the project has been the web application we built to help work with themes. It has specific tools that help us work on the various themes, and the workflow has been enjoyable and efficient.',
        ],
      },
      {
        kind: 'list',
        items: [
          '**Generator** is an LLM prompt area that allows me to give design tasks to an agent, and then it codes it on the page using our coded components.',
          '**Layouts** are similar to Generator, but without having to run an agent. I have premade layouts that use most of the components and allows us to quickly test a theme.',
          '**Theme Compare** is used to put a theme next to another theme so we can visually compare them.',
        ],
      },
      {
        kind: 'figure',
        src: `${cxDsBase}/Generate.png`,
        alt: 'Generator tool in the CX-DS theming application',
        wide: true,
        caption: 'The Generate tool that is built into the theming application',
      },
      { kind: 'h2', text: 'Workflow' },
      {
        kind: 'body',
        paragraphs: [
          'I wanted to quickly cover the workflow since it might not be obvious.',
        ],
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'The theming app is loaded locally in Cursor',
          'I use the tools outlined above to test components and layouts for drift, fidelity and aesthetics',
          'When I find an issue or want to improve something I simply work with the agent',
          'If the changes are persistent then I have the agent add rules to the guidelines',
        ],
      },
      { kind: 'h2', text: 'Part One Summary' },
      {
        kind: 'figure',
        src: `${cxDsBase}/Login.png`,
        alt: 'Login screen of the CX-DS theming application',
        maxWidth: 600,
        caption: 'A one-shot output of a login screen using the CX-DS design system',
      },
      {
        kind: 'body',
        paragraphs: [
          'This first phase has been successful in that we have a multi-themed design system that can be quickly read by agents and the results are consistent and on brand. The next phase of the plan is to test the package inside more agent tools. For instance, Figma Make has been especially unruly in most of my tests, so I think that will be an interesting problem to address.',
          "Overall I know we're on the right path even though there's a lot more to figure out.",
        ],
      },
    ],
  },
  'ai-based-affordance-layers': {
    slug: 'ai-based-affordance-layers',
    headline: 'Node-based agent workflows',
    type: 'Experiment / Thought',
    description:
      'Exploring a node-based affordance layer for AI-assisted design — action and visual cues instead of long chat threads.',
    detailLayout: 'article',
    gallery: [],
    article: [
      { kind: 'h2', text: 'Theory' },
      {
        kind: 'body',
        paragraphs: [
          "Working with agents via chat is the process by which most of us were introduced to AI. We're all familiar with it: request something of the agent, it produces what we asked for, we ask for some further clarifying output, it produces the request, we add context, it replies...",
          'Finding the right words, digesting the outputs, asking the followups. This is a fine process for research, copywriting, or other tasks where the output are words. But what about when the task is something else, like design?',
          "In this context the constant communication feels like we're stuck in a loop. My current workflow is Figma/Paper \u2192 Claude Code or Cursor \u2192 live prototype. So a lot of the communication I have is small bursts of unrelated requests. Tweaks like 'change this token to [enter token name]', or 'set this padding to 16px on mobile.' But the current chat-based modality stacks all of those unrelated requests into a single, extremely long, chat history. It becomes hard to find threads from just 5 requests ago, let alone one from yesterday.",
          'This is what that process looks like now:',
        ],
      },
      {
        kind: 'figure',
        src: `${studiesBase}/theory-chat-thread-cycle.png`,
        alt: 'Diagram of a single chat thread loop between human requests and machine responses',
      },
      {
        kind: 'body',
        paragraphs: [
          'I explored a different workflow that focuses more on compact action sequences and less on conversation. Design and development is spacial, so being able to distribute your conversations on a canvas \u2014 or a screen \u2014 makes sense in terms of adding context. The loop would look something like dozens of these flows:',
        ],
      },
      {
        kind: 'figure',
        src: `${studiesBase}/theory-single-thread-linear.png`,
        alt: 'Linear diagram of human request, machine action with visual mark, and human check',
        wide: true,
        maxWidth: 592,
      },
      {
        kind: 'body',
        paragraphs: [
          "This keeps the feedback shorter, and rather than one long chat dialog the user would have visual cues and independent 'request' nodes that highlight where the action happened.",
        ],
      },
      {
        kind: 'twoFigures',
        left: {
          src: `${studiesBase}/layout-chat-based.png`,
          alt: 'Wireframe showing a chat-based layout with a prominent sidebar',
          label: 'Chat based layout',
        },
        right: {
          src: `${studiesBase}/layout-node-based.png`,
          alt: 'Wireframe showing a node-based layout with contextual markers on the canvas',
          label: 'Node based layout',
        },
      },
      {
        kind: 'body',
        paragraphs: [
          'The advantage is that the user can keep moving forward, spatially. It replaces conversation with action and visual cues.',
        ],
      },
      { kind: 'h2', text: "Let's explore benefits" },
      {
        kind: 'feature',
        title: 'Processing',
        description:
          'A marker that signifies where the agent is working.',
        figure: {
          src: `${studiesBase}/feature-processing.png`,
          alt: 'Processing state with animated sidebar indicator on a blue canvas',
        },
      },
      {
        kind: 'feature',
        title: 'Completed',
        description: 'Simple indicator that marks the task as complete.',
        figure: {
          src: `${studiesBase}/feature-completed.png`,
          alt: 'Completed state with checkmark indicator on canvas',
        },
      },
      {
        kind: 'feature',
        title: 'Confidence',
        description:
          'This gives the user a numerical score based on the confidence that the agent had when crafting the solution.',
        figure: {
          src: `${studiesBase}/feature-confidence-chat.png`,
          alt: 'Chat panel showing confidence-scored agent responses',
          bg: 'white',
        },
      },
      { kind: 'h3', text: 'Add context' },
      {
        kind: 'body',
        paragraphs: [
          'Surface a node-specific chat to enter new context to alter the output.',
        ],
      },
      {
        kind: 'figure',
        src: `${studiesBase}/feature-reprompt-add-context.png`,
        alt: 'Node-specific prompt input overlay on canvas',
      },
      {
        kind: 'feature',
        title: 'Version History',
        description:
          "Because we're using contextual nodes instead of chat, the history of that node is stored within. This means you can re-surface historical views created in that node. Basically a form of version history for agent based work. Try that in a singular chat pane.",
        figure: {
          src: `${studiesBase}/feature-version-history.png`,
          alt: 'Stacked version history cards showing prior canvas states',
          wide: true,
          bg: 'white',
        },
      },
    ],
  },
  'ultrarunning-as-design-analogy': {
    slug: 'ultrarunning-as-design-analogy',
    headline: 'Ultrarunning and Design, a comparison',
    type: 'Missive',
    description:
      'A missive on how ultrarunning and design are both long problem-solving sessions — and why hard things are worth doing.',
    detailLayout: 'article',
    gallery: [],
    article: [
      {
        kind: 'body',
        paragraphs: [
          "Some will say that I was reaching when I decided to write about how ultrarunning is analogous to design, some will say that I just wanted to talk about ultrarunning like some cult member, or a vegan. Maybe both are true. Let's examine.",
          "For folks who don't know what ultrarunning is \u2014 which is probable since it is a niche sport full of nerds wearing uncool looking gear (example below) \u2014 an ultra marathon is categorized as: 'any running event that is longer than a marathon.' If you ran 26.3 mi then technically you're an ultra marathoner. Some take it seriously, or some (like me) are in it for the personal challenge, vibes, and aid station candy.",
        ],
      },
      {
        kind: 'figure',
        src: `${ultraBase}/Ultrarunner.png`,
        alt: 'Trail runner in ultrarunning gear',
      },
      {
        kind: 'body',
        paragraphs: [
          'What the serious runners \u2014 and casual ones \u2014 share is that an ultra is essentially a long problem solving session. We deal with fatigue, mental highs and lows, blisters, navigational errors, nutritional issues including lack (or surplus) of electrolytes, staying on course, injuries, sleep, gear choices like hiking poles or not, and then the mother of all problems: the weather. All the choices you make, along with the training you did, determine if you cross the finish line in time or not.',
        ],
      },
      {
        kind: 'figure',
        src: `${ultraBase}/finish-line.gif`,
        alt: 'Crossing the Tushars finish line',
        wide: true,
      },
      {
        kind: 'body',
        paragraphs: [
          'What is good design if not the culmination of our choices and how we handle unplanned challenges? We deal with changing or poorly researched requirements, stakeholder evangelism, deadlines, alignment, resources, tooling, content availability, and feedback. Our endurance is less about cardio and more about how long we can maintain mental dexterity. Solving a shifting requirement at hour two hits different than hour nine.',
          'I made a table so we can explore where ultrarunning and design parallel and diverge:',
        ],
      },
      {
        kind: 'table',
        headers: ['', 'Design', 'Ultra Running'],
        rows: [
          ['Planning artifacts', 'PRDs', 'Aid station charts'],
          ['Sleep the night before', 'Pretty good', 'No chance'],
          ['Chances of dying', 'Zero', 'Not zero, but also not likely'],
          ['Pull an all nighter', 'Not since I was a junior', 'Absolutely'],
          ['Making important decisions under stress', 'Yes', 'Yes'],
          ['Can you rally after getting \'down\'', 'Yes', 'Yes'],
          [
            'Sayings when fatigue starts taking a toll on performance',
            '"Let\'s table that till tomorrow"',
            '"I\'m just going to walk to the next aid station"',
          ],
          ['Causes of tummy troubles', 'Nerves plus coffee', 'Overdid the electrolytes'],
          ['Sources of feedback', 'External', 'Internal'],
          [
            'When all hope of meeting the deadline is lost',
            'Take the blame',
            'Blame it on bad aid station food',
          ],
          [
            'Hallucinations',
            "I once thought the word 'Band' was misspelled when I stared at it too long",
            'I once saw monkeys in a tree, in Arizona',
          ],
        ],
      },
      { kind: 'h2', text: 'In summary' },
      {
        kind: 'body',
        paragraphs: [
          "Hard things are hard. Problem solving, finding aesthetic balance, doing something new, getting alignment, and running a 100k are all hard. At the end of this I'm not sure how comparable design and ultrarunning are. I think the point is that they can both be hard, which is great because hard things are worth doing even if 'hard' means finding consensus between stakeholders, or puking behind a tree in the middle of the desert and still making it to the next aid station.",
        ],
      },
    ],
  },
};

/** Whether a work row can open a detail view */
export function isCaseStudyNavigable(slug: string): boolean {
  const study = caseStudies[slug];
  if (!study) return false;
  if (study.detailLayout === 'article') return Boolean(study.article?.length);
  return study.gallery.length > 0;
}
