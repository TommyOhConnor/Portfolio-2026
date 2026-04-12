export const site = {
  name: 'Tommy O\'Connor',
  nameAbbreviation: 'T..... O\'',
  heroHeadline: 'I\'m a dev-curious product designer with 25+ years of figuring things out.',
  email: 'me@tommy-oconnor.com',
  xHandle: '@DadBodTrlRnnr',
  xUrl: 'https://x.com/DadBodTrlRnnr',
  /** Bio shown in the dark "About" state (MORE expanded) */
  aboutBio: {
    paragraphs: [
      `I design — and I've been doing it, in some form for well over two decades.`,
      `I'm self-taught, coming up through illustration, motion, and branding before "product design" was even a job title. That path gave me something I've leaned on ever since: the ability to move fluidly between visual craft and technical thinking, and a deep comfort with figuring things out as I go.`,
      `Most of my recent work has been in enterprise UX and design systems — leading Figma library architecture, contributing to clinical mobile apps, and designing across healthcare, insurance, and AI for companies ranging from early-stage startups to Fortune 500s.`,
      /** Paragraph 4 has an italic span — rendered specially in landing.ts */
      null,
      `The goal at this stage of my career is to bring my experience and scrappiness to face challenging and exciting problems.`,
    ] as (string | null)[],
    /** The three parts of the italic-span paragraph */
    aiParagraph: {
      before: `But what's got me excited right now is AI — and this feeling isn't new. I taught myself Flash ActionScript back in the day because I wanted to make things that design tools alone couldn't. That was my first taste of `,
      italic: `design meets code`,
      after: ` — and I loved it. Tools like Claude Code, Cursor, and AI-augmented workflows feel like I'm reliving those moments, and I can't be more excited.`,
    },
  },
};
