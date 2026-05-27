const BASE = `${import.meta.env.BASE_URL}assets/Bites/`;

/** Fallback label when an item has no per-item caption */
export const BITES_CAPTION = 'Figma plugin for icon management - Pfizer';

export type BitesMediaKind = 'image' | 'gif' | 'video';

export type BitesItem = {
  id: string;
  kind: BitesMediaKind;
  src: string;
  /** Poster / fallback image for video */
  posterSrc?: string;
  width: number;
  height: number;
  left: string;
  top: string;
  alt: string;
  /** Hover label; falls back to BITES_CAPTION when omitted */
  caption?: string;
};

/**
 * Figma 339:177 — positions relative to drawer origin (page top: 757px, page left: 48px).
 * Order in array = back → front (used as initial z-order).
 */
export const bitesItems: BitesItem[] = [
  {
    id: 'tnf-pearl',
    kind: 'image',
    src: `${BASE}tnf-pearl.png`,
    width: 584,
    height: 513,
    left: 'calc(8.33% - 45px)',
    top: '151px',
    alt: 'The North Face wear tester profile card for Pearl M.',
    caption: 'Bite-sized information panel interaction - The North Face',
  },
  {
    id: 'run-the-icons',
    kind: 'video',
    src: `${BASE}${encodeURIComponent('Run the Icons.mp4')}`,
    posterSrc: `${BASE}run-the-icons.png`,
    width: 622,
    height: 487,
    left: '0',
    top: '24px',
    alt: 'Run the Icons Figma plugin for Pfizer icon management',
  },
  {
    id: 'pfa-screens',
    kind: 'image',
    src: `${BASE}pfa-screens.jpg`,
    width: 600,
    height: 674,
    left: 'calc(8.33% + 30px)',
    top: '64px',
    alt: 'Pfizer For All product launch screens',
    caption: 'Hero (L1 & L2) and informational panels - Pfizer for All',
  },
  {
    id: 'chase-poster',
    kind: 'image',
    src: `${BASE}chase-poster.jpg`,
    width: 445,
    height: 688,
    left: 'calc(16.67% + 40px)',
    top: '155px',
    alt: 'The Chase All Cities tour poster',
    caption: 'Tour poster - The Chase',
  },
  {
    id: 'ui2',
    kind: 'gif',
    src: `${BASE}ui2.gif`,
    width: 600,
    height: 450,
    left: 'calc(33.33% - 71px)',
    top: '104px',
    alt: 'Scientific process UI exploration',
    caption: 'Scientific process illustrations - GE Healthcare',
  },
  {
    id: 'hover-effects',
    kind: 'video',
    src: `${BASE}${encodeURIComponent('Hover effects.mp4')}`,
    width: 520,
    height: 547,
    left: 'calc(25% + 190px)',
    top: '200px',
    alt: 'Hover effects design tool demonstration',
    caption: 'Hover effects tool - Self',
  },
];

/** Initial z-order: back → front (matches Figma layer order) */
export const bitesInitialOrder: string[] = bitesItems.map((item) => item.id);
