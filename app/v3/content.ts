// Copy + data for the /v3 cinematic-dark rebuild.
//
// Draft is English-first: we're nailing the design/feel before
// wiring it through the i18n JSON. Strings live here (not in
// lib/i18n) so they're easy to iterate on without touching the
// production bilingual bundle. Localisation is a later pass.

export const NAV = {
  brand: 'Codepet',
  links: [
    { label: 'How it works', href: '#loop' },
    { label: 'Departments', href: '#departments' },
    { label: 'Journey', href: '#journey' },
    { label: 'Blog', href: '/blog' },
  ],
  cta: 'Download for macOS',
}

export const HERO = {
  // The headline is split so the design can render the tail in an
  // italic accent (Playfair Display) against the pixel lead.
  headlineLead: 'Let’s build your',
  headlineAccent: 'second brand',
  sub: 'Codepet is your AI cofounder — run your whole company with AI, department by department. byte drafts and builds with you, and you approve every move.',
  ctaPrimary: 'Download for macOS',
  ctaSecondary: 'See how it works',
  scrollHint: 'scroll to explore',
}

// The approve loop — byte's core promise. Three calm beats.
export const LOOP = {
  eyebrow: 'THE LOOP',
  headlineLead: 'byte drafts & builds.',
  headlineAccent: 'You approve every move.',
  sub: 'No black boxes. You watch every step, request changes in plain language, and nothing ships until you say so.',
  steps: [
    {
      key: 'execute',
      label: 'Execute',
      desc: 'byte runs the task and shows its work — a live build log, step by step.',
    },
    {
      key: 'deliver',
      label: 'Deliver',
      desc: 'A real artifact appears: a site, a PR, an email, a model — ready to review.',
    },
    {
      key: 'approve',
      label: 'Approve',
      desc: 'Request changes in a sentence, or approve to ship it straight to your Library.',
    },
  ],
}

// Eight departments — names, one-line needs, accent colour + cover.
// Covers + colours mirror the product app (public/v3/covers).
export const DEPARTMENTS = {
  eyebrow: 'ONE COMPANY · EIGHT DEPARTMENTS',
  headlineLead: 'Run the whole company,',
  headlineAccent: 'not just the code.',
  sub: 'Your business as eight departments — each with what it needs, and tasks byte can do, draft, or hand to you.',
  items: [
    { key: 'eng',     name: 'Engineering', need: 'Ship the work and verify every change.',        color: '#2563EB', cover: '/v3/covers/eng.png' },
    { key: 'mkt',     name: 'Marketing',   need: 'Find the words and the launch sequence.',        color: '#FF8C42', cover: '/v3/covers/mkt.png' },
    { key: 'ops',     name: 'Operations',  need: 'Stand up the machinery behind the scenes.',      color: '#2DD4BF', cover: '/v3/covers/ops.png' },
    { key: 'fin',     name: 'Finance',     need: 'Model the numbers, price with confidence.',      color: '#FDB022', cover: '/v3/covers/fin.png' },
    { key: 'legal',   name: 'Legal',       need: 'Cover the basics from sensible templates.',      color: '#9333EA', cover: '/v3/covers/legal.png' },
    { key: 'design',  name: 'Design',      need: 'Make the first run feel like magic.',            color: '#A855F7', cover: '/v3/covers/design.png' },
    { key: 'sales',   name: 'Sales',       need: 'Land your first real users, personally.',        color: '#7C3AED', cover: '/v3/covers/sales.png' },
    { key: 'support', name: 'Support',     need: 'Answer once, then keep triage running quietly.', color: '#FF6B9D', cover: '/v3/covers/support.png' },
  ],
}

// The roadmap as a luminous path.
export const JOURNEY = {
  eyebrow: 'YOUR ROADMAP',
  headlineLead: 'From a spark',
  headlineAccent: 'to a company that runs.',
  sub: 'Five phases, each unlocking the next. byte maps the path across all eight departments.',
  phases: [
    { key: 'find',   label: 'Find',         note: 'Validate the idea' },
    { key: 'build',  label: 'Build',        note: 'Shape the product' },
    { key: 'ship',   label: 'Ship',         note: 'Make it shippable' },
    { key: 'launch', label: 'Launch',       note: 'Run the closed beta' },
    { key: 'grow',   label: 'Run & grow',   note: 'Distribute & scale' },
  ],
}

export const FINAL = {
  headlineLead: 'Let’s build your',
  headlineAccent: 'second brand.',
  sub: 'A free macOS app. byte is waiting.',
  ctaPrimary: 'Download for macOS',
  ctaSecondary: 'Read the Build Log',
}

export const FOOTER = {
  tagline: 'Your AI cofounder for macOS.',
  links: [
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Download', href: '/download' },
  ],
  copyright: '© 2026 Codepet — built by Outcasts.',
}
