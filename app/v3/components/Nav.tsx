'use client'

import { NAV } from '../content'
import SoonButton from './SoonButton'

/**
 * Nav — a floating frosted pill, centred at the top.
 * Minimal by design (less-is-more): brand, a few anchors, and the
 * single "Open the web app" CTA. The web app isn't live yet, so that
 * CTA reveals a "launching soon" note instead of navigating.
 */
export default function Nav() {
  return (
    <div className="v3-nav-wrap">
      <nav className="v3-nav" aria-label="Primary">
        <a href="#top" className="v3-nav-brand">{NAV.brand}</a>
        <ul className="v3-nav-links">
          {NAV.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="v3-nav-link">{l.label}</a>
            </li>
          ))}
        </ul>
        <SoonButton className="v3-nav-cta">{NAV.cta}</SoonButton>
      </nav>
    </div>
  )
}
