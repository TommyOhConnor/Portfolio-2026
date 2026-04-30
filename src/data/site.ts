export const site = {
  name: 'Tommy O\'Connor',
  nameAbbreviation: 'T..... O\'',
  heroHeadline: 'I\'m a technical product designer with 25+ years of figuring things out.',
  email: 'me@tommy-oconnor.com',
  xHandle: '@DadBodTrlRnnr',
  xUrl: 'https://x.com/DadBodTrlRnnr',
  /** Bio shown in the dark "About" state (MORE expanded) */
  aboutBio: {
    paragraphs: [
      `I'm a technical designer — and I've been doing that, in some form for almost three decades.`,
      `I'm self-taught, coming up through illustration, motion, branding and front end development before *product design* or *design engineer* was a job title. This path gave me something I've leaned on ever since: the ability to move fluidly between visual craft and technical thinking; giving me a deep comfort with figuring things out and learning new skills.`,
      `Most of my recent work has been in AI-augmented enterprise product design and AI-ready design systems — for companies ranging from early-stage startups like DashLX (Retail / Wearable Data) and Hemasense (Medical Equipment) to Pfizer, a Fortune 100.`,
      `What's got me really excited right now is AI — and this feeling isn't new. I taught myself Flash ActionScript back in the day because I wanted to make things that design tools alone couldn't. That was my first taste of _design meets code_ — and I loved it. Modern AI tools like Claude Code, Codex, Cursor, along with Shadcn and Rive I feel like I'm reliving those moments, and I can't be more excited.`,
      `If this resonates with you, feel free to reach out.`,
    ] as (string | null)[],
    /** Legacy italic paragraph payload (unused when no null paragraphs are present) */
    aiParagraph: {
      before: `But what's got me excited right now is AI — and this feeling isn't new. I taught myself Flash ActionScript back in the day because I wanted to make things that design tools alone couldn't. That was my first taste of `,
      italic: `design meets code`,
      after: ` — and I loved it. Tools like Claude Code, Cursor, and AI-augmented workflows feel like I'm reliving those moments, and I can't be more excited.`,
    },
  },
};
