'use client'

import { NAV } from '../content'

/**
 * Nav — a floating frosted pill, centred at the top.
 * Minimal by design (less-is-more): brand, a few anchors, and the
 * single "Open the web app" CTA (proxied to the v1.2 app at /app).
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
        <a href="/app" className="v3-nav-cta">{NAV.cta}</a>
      </nav>
    </div>
  )
}
