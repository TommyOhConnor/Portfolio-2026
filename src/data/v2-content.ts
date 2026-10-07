const base = import.meta.env.BASE_URL;

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
  /** Shown under the media in the lightbox */
  caption: string;
};

export type V2WorkProject = {
  id: string;
  title: string;
  /** Left out of the page without deleting its content */
  hidden?: boolean;
  /** Client or brand, shown in gray after the title: "Bottle  Pfizer" */
  client?: string;
  /** Outlined pill after the title, e.g. "Branding & Product" */
  tag?: string;
  titleUppercase?: boolean;
  titleFont?: 'golos' | 'geist-medium';
  description: string;
  tiles: V2MediaTile[];
};

export const v2Site = {
  heroLine:
    'I\u2019m a designer who builds digital products, branding, and design systems.',
  aboutParagraphs: [
    'I\u2019ve been designing since the year 2000. Started out as a nightclub flyer designer, learned to code, fell in love with branding, and packaging, then found product design - all along the way I\u2019ve dabbled in illustration and animation.',
    'I have an amazing family, and run long distances with my dog Arlo.',
  ],
  contactEmail: 'me@tommyoconnor.com',
  linkedinUrl: 'https://www.linkedin.com/in/tommyohconnor/',
  linkedinLabel: 'LinkedIn',
};

export const v2WorkProjects: V2WorkProject[] = [
  {
    id: 'regular',
    title: 'Regular.Run',
    client: 'Self',
    tag: 'Branding & Product',
    titleFont: 'geist-medium',
    description:
      'The reality is that a lot of coaches use standard Google Sheets for their runners, because it\u2019s fast and doesn\u2019t get in their way. I wanted to bring thoughtful design to this process to help coaches.',
    tiles: [
      {
        height: 563,
        mediaWidth: 2400,
        mediaHeight: 3200,
        src: `${base}assets/Regular/REG - 2.png`,
        caption: 'Show up for the run \u2014 a Regular poster with \u201cyourself\u201d struck through.',
      },
      {
        // ~20% taller than the poster
        height: 676,
        mediaWidth: 1920,
        mediaHeight: 1440,
        src: `${base}assets/Regular/REG - 4.png`,
        caption: 'Today view \u2014 the day\u2019s workout up top and weekly mileage against plan, close up.',
      },
    ],
  },
  {
    id: 'pfizer-bottle',
    hidden: true,
    title: 'Bottle',
    client: 'Pfizer',
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
        caption: 'Session view \u2014 left and right patch status at a glance, from the green all-clear to a yellow alert.',
      },
      { height: 469, mediaWidth: 1400, mediaHeight: 1720, src: `${base}assets/Hemasense/HS - 2.png`, caption: 'The tablet interface mounted bedside, monitoring a post-op patient.' },
    ],
  },
  {
    id: 'pfizer-spark',
    hidden: true,
    title: 'Spark',
    client: 'Pfizer',
    titleFont: 'geist-medium',
    description:
      'In 2024 I joined an internal Pfizer team to build the Meraki design system — 50+ components, token variables, motion, and kits — later updated for LLM-ready workflows.',
    tiles: [
      { height: 544, mediaWidth: 1952, mediaHeight: 1800, src: `${base}assets/meraki/MER - 1.png`, caption: 'Card components \u2014 image, text, and icon variants sharing button and disclaimer styles.' },
      { height: 469, mediaWidth: 1680, mediaHeight: 1720, src: `${base}assets/meraki/MER - 2.png`, caption: 'Typography tokens \u2014 Pfizer Diatype headline and display styles with size and leading specs.' },
      { height: 544, mediaWidth: 1310, mediaHeight: 1594, src: `${base}assets/meraki/MER - 3.png`, caption: 'Light scheme color tokens \u2014 base, on-color, and container pairings for each hue.' },
    ],
  },
  {
    id: 'tnf',
    hidden: true,
    title: 'Wear Tester Dashboard',
    client: 'The North Face',
    titleFont: 'geist-medium',
    description:
      'An internal wear-tester dashboard for The North Face — real-time athlete performance, wearable data, and the flows that replaced manual surveys and spreadsheets.',
    tiles: [
      { height: 544, mediaWidth: 1952, mediaHeight: 1800, src: `${base}assets/TNF/TNF - 1.png`, caption: 'Program member growth tracked over time \u2014 a key metric for gauging loyalty program adoption and momentum.' },
      { height: 469, mediaWidth: 1680, mediaHeight: 1720, src: `${base}assets/TNF/TNF - 2.png`, caption: 'Athlete roster \u2014 filter by data freshness, age, gender, activity, and garment, with a 30-day data score per tester.' },
      { height: 544, mediaWidth: 1800, mediaHeight: 1640, src: `${base}assets/TNF/TNF - 3.png`, caption: 'Activity mix by sport alongside program membership growth.' },
    ],
  },
  {
    id: 'brand-marks',
    hidden: true,
    title: 'Brand marks',
    titleFont: 'geist-medium',
    description:
      'A collection of brand marks created between 2020 and 2022 — identity systems built to work across print, product, and motion.',
    tiles: [
      { height: 469, mediaWidth: 2000, mediaHeight: 1800, src: `${base}assets/Brandmarks/BM - 1.png`, caption: 'Concentric arc mark in ink on green.' },
      { height: 639, mediaWidth: 1600, mediaHeight: 1720, src: `${base}assets/Brandmarks/BM - 2.png`, caption: 'Mineril wordmark with a scattered-particle symbol.' },
      { height: 469, mediaWidth: 1084, mediaHeight: 1640, src: `${base}assets/Brandmarks/BM - 3.png`, caption: 'Looping hand-drawn monogram with a dashed exit stroke.' },
      { height: 544, mediaWidth: 1366, mediaHeight: 1640, src: `${base}assets/Brandmarks/BM - 4.png`, caption: 'Stacked wave mark in red on blue.' },
      { height: 469, mediaWidth: 1084, mediaHeight: 1400, src: `${base}assets/Brandmarks/BM - 5.png`, caption: 'Network globe mark in black on yellow.' },
    ],
  },
  {
    id: 'moonshot',
    hidden: true,
    title: 'Moonshot',
    titleFont: 'geist-medium',
    description:
      'Brand identity for Moonshot, a startup incubator \u2014 naming, visual identity, and the design language used across program materials, posters, and events.',
    tiles: [
      { height: 469, mediaWidth: 1952, mediaHeight: 1800, src: `${base}assets/Moonshot/MS - 1.png`, caption: 'Moonshot wordmark with its orbit-and-trajectory symbol.' },
      { height: 639, mediaWidth: 1680, mediaHeight: 1720, src: `${base}assets/Moonshot/MS - 2.png`, caption: 'Organic line texture drawn for the Moonshot identity.' },
      { height: 469, mediaWidth: 1800, mediaHeight: 1640, src: `${base}assets/Moonshot/MS - 3.png`, caption: 'Program guide spread \u2014 Track 3, Moving to Market.' },
      { height: 544, mediaWidth: 1246, mediaHeight: 1640, src: `${base}assets/Moonshot/MS - 4.png`, caption: 'Poster illustration of astronaut Sally Ride.' },
      { height: 469, mediaWidth: 1010, mediaHeight: 1556, src: `${base}assets/Moonshot/MS - 5.png`, caption: 'Sharks in Space \u2014 poster for Moonshot\u2019s startup pitch event.' },
    ],
  },
];
