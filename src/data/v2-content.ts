const base = import.meta.env.BASE_URL;

export type V2WorkFilter = 'product' | 'brand';

export type V2MediaTile = {
  /** Display height in px; width follows the media's aspect ratio */
  height: number;
  /** Intrinsic pixel size of the media file */
  mediaWidth: number;
  mediaHeight: number;
  src?: string;
  videoSrc?: string;
  play?: boolean;
  alt?: string;
};

export type V2WorkProject = {
  id: string;
  filter: V2WorkFilter;
  title: string;
  titleUppercase?: boolean;
  titleFont?: 'golos' | 'geist-medium';
  description: string;
  tiles: V2MediaTile[];
  /** Optional caption under the first tile (TNF layout) */
  firstTileCaption?: string;
};

export const v2Site = {
  heroLine:
    'I\u2019m a builder who can help with digital product design, branding, and cooking tips.',
  workFilterLabel: 'Recent',
  aboutParagraphs: [
    'I\u2019ve been designing since the year 2000. Started out as a nightclub flyer designer, learned to code, fell in love with branding, and packaging, then found product design - all along the way I\u2019ve dabbled in illustration and animation.',
    'I have an amazing family, and run long distances with my dog Arlo.',
  ],
  contactEmail: 'me@tommyoconnor.com',
  twitterUrl: 'https://twitter.com/tommyoconnor',
  twitterLabel: 'Twitter',
};

export const v2WorkProjects: V2WorkProject[] = [
  {
    id: 'regular',
    filter: 'product',
    title: 'Regular',
    titleUppercase: true,
    titleFont: 'golos',
    description:
      'A type-forward product exploration — layout, motion, and editorial rhythm for a reading experience built around custom typography.',
    tiles: [
      {
        height: 469,
        mediaWidth: 1982,
        mediaHeight: 1552,
        videoSrc: `${base}assets/Bites/Run the Icons.mp4`,
        play: true,
      },
      {
        height: 639,
        mediaWidth: 1318,
        mediaHeight: 1386,
        videoSrc: `${base}assets/Bites/Hover effects.mp4`,
        play: true,
      },
      { height: 469, mediaWidth: 584, mediaHeight: 513, src: `${base}assets/Bites/tnf-pearl.png` },
    ],
  },
  {
    id: 'pfizer-bottle',
    filter: 'product',
    title: 'Pfizer Bottle',
    titleFont: 'geist-medium',
    description:
      'HemaSense is an early-stage medtech startup building an alert system to catch internal bleeding in post-op patients. I designed the tablet interface, alarm animations, and component library.',
    tiles: [
      {
        height: 597,
        mediaWidth: 2880,
        mediaHeight: 1800,
        src: `${base}assets/Hemasense/HS - 1.png`,
        play: true,
      },
      { height: 469, mediaWidth: 1400, mediaHeight: 1720, src: `${base}assets/Hemasense/HS - 2.png` },
    ],
  },
  {
    id: 'pfizer-spark',
    filter: 'product',
    title: 'Pfizer Spark',
    titleFont: 'geist-medium',
    description:
      'In 2024 I joined an internal Pfizer team to build the Meraki design system — 50+ components, token variables, motion, and kits — later updated for LLM-ready workflows.',
    tiles: [
      { height: 544, mediaWidth: 1952, mediaHeight: 1800, src: `${base}assets/meraki/MER - 1.png` },
      { height: 469, mediaWidth: 1680, mediaHeight: 1720, src: `${base}assets/meraki/MER - 2.png` },
      { height: 544, mediaWidth: 1310, mediaHeight: 1594, src: `${base}assets/meraki/MER - 3.png` },
    ],
  },
  {
    id: 'tnf',
    filter: 'product',
    title: 'TNF',
    titleFont: 'geist-medium',
    description:
      'An internal wear-tester dashboard for The North Face — real-time athlete performance, wearable data, and the flows that replaced manual surveys and spreadsheets.',
    tiles: [
      { height: 544, mediaWidth: 1952, mediaHeight: 1800, src: `${base}assets/TNF/TNF - 1.png` },
      { height: 469, mediaWidth: 1680, mediaHeight: 1720, src: `${base}assets/TNF/TNF - 2.png` },
      { height: 544, mediaWidth: 1800, mediaHeight: 1640, src: `${base}assets/TNF/TNF - 3.png` },
    ],
    firstTileCaption:
      'Program member growth tracked over time — a key metric for gauging loyalty program adoption and momentum.',
  },
  {
    id: 'brand-marks',
    filter: 'brand',
    title: 'Brand marks',
    titleUppercase: true,
    titleFont: 'golos',
    description:
      'A collection of brand marks created between 2020 and 2022 — identity systems built to work across print, product, and motion.',
    tiles: [
      { height: 469, mediaWidth: 2000, mediaHeight: 1800, src: `${base}assets/Brandmarks/BM - 1.png` },
      { height: 639, mediaWidth: 1600, mediaHeight: 1720, src: `${base}assets/Brandmarks/BM - 2.png` },
      { height: 469, mediaWidth: 1084, mediaHeight: 1640, src: `${base}assets/Brandmarks/BM - 3.png` },
    ],
  },
  {
    id: 'moonshot',
    filter: 'brand',
    title: 'Moonshot',
    titleFont: 'geist-medium',
    description:
      'Brand identity for Moonshot, a startup incubator — naming, visual language, and program materials.',
    tiles: [
      {
        height: 597,
        mediaWidth: 1952,
        mediaHeight: 1800,
        src: `${base}assets/Moonshot/MS - 1.png`,
        play: true,
      },
      { height: 469, mediaWidth: 1680, mediaHeight: 1720, src: `${base}assets/Moonshot/MS - 2.png` },
    ],
  },
  {
    id: 'brand-marks-extended',
    filter: 'brand',
    title: 'Various marks',
    titleFont: 'geist-medium',
    description:
      'Supporting marks, patterns, and illustration built to extend the core identity across touchpoints.',
    tiles: [
      { height: 544, mediaWidth: 1366, mediaHeight: 1640, src: `${base}assets/Brandmarks/BM - 4.png` },
      { height: 469, mediaWidth: 1084, mediaHeight: 1400, src: `${base}assets/Brandmarks/BM - 5.png` },
      { height: 544, mediaWidth: 1800, mediaHeight: 1640, src: `${base}assets/Moonshot/MS - 3.png` },
    ],
  },
  {
    id: 'moonshot-extended',
    filter: 'brand',
    title: 'Moonshot',
    titleFont: 'geist-medium',
    description:
      'Program visuals and illustration language used across incubator materials and event branding.',
    tiles: [
      { height: 544, mediaWidth: 1246, mediaHeight: 1640, src: `${base}assets/Moonshot/MS - 4.png` },
      { height: 469, mediaWidth: 1010, mediaHeight: 1556, src: `${base}assets/Moonshot/MS - 5.png` },
      { height: 544, mediaWidth: 1952, mediaHeight: 1800, src: `${base}assets/Moonshot/MS - 1.png` },
    ],
    firstTileCaption:
      'Brand mark and pattern system — built to scale from slide decks to environmental graphics.',
  },
];
