'use client'

import Constellation from './Constellation'
import { HERO } from '../content'

/**
 * Hero — the magical centrepiece. A near-black canvas where the
 * eight departments orbit a central glow (Constellation) with the
 * pixel-font headline floating above.
 */
export default function Hero() {
  return (
    <header id="top" className="v3-hero">
      <Constellation />

      <div className="v3-hero-inner">
        <h1 className="v3-hero-headline">
          {HERO.headlineLead}{' '}
          <span className="it">{HERO.headlineAccent}</span>
        </h1>
        <p className="v3-hero-sub">{HERO.sub}</p>
        <div className="v3-hero-cta">
          <a href="/download" className="v3-btn v3-btn--primary">
            <AppleMark /> {HERO.ctaPrimary}
          </a>
          <a href="#loop" className="v3-btn v3-btn--ghost">{HERO.ctaSecondary}</a>
        </div>
      </div>

      <div className="v3-scrollhint" aria-hidden="true">
        <span>{HERO.scrollHint}</span>
        <i />
      </div>
    </header>
  )
}

function AppleMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.36 12.78c-.02-2.13 1.74-3.15 1.82-3.2-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.58.78-3.25.78-.67 0-1.7-.76-2.8-.74-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.38 6.44 1.07 8.55.71 1.03 1.55 2.19 2.66 2.15 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.78.67 1.15-.02 1.88-1.05 2.58-2.09.81-1.19 1.15-2.35 1.17-2.41-.03-.01-2.24-.86-2.26-3.4zM14.2 6.4c.59-.72.99-1.71.88-2.7-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.6.95.08 1.92-.48 2.51-1.18z" />
    </svg>
  )
}
