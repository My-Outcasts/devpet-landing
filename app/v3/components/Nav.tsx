'use client'

import { useState } from 'react'
import { NAV } from '../content'
import SoonButton from './SoonButton'

/**
 * Nav — a floating frosted pill, centred at the top.
 * Minimal by design (less-is-more): brand, a few anchors, and the
 * single "Open the web app" CTA. The web app isn't live yet, so that
 * CTA reveals a "launching soon" note instead of navigating.
 *
 * On phones (≤760px) the inline links + CTA collapse into a hamburger
 * that opens a frosted drawer below the pill, so the section anchors and
 * the CTA stay reachable on touch.
 */
export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <div className={`v3-nav-wrap${open ? ' is-open' : ''}`}>
      <nav className="v3-nav" aria-label="Primary">
        <a href="#top" className="v3-nav-brand" onClick={() => setOpen(false)}>
          {NAV.brand}
        </a>
        <ul className="v3-nav-links">
          {NAV.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="v3-nav-link">{l.label}</a>
            </li>
          ))}
        </ul>
        <SoonButton className="v3-nav-cta">{NAV.cta}</SoonButton>
        <button
          type="button"
          className="v3-nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      <div className="v3-nav-menu" aria-hidden={!open}>
        <ul className="v3-nav-menu-links">
          {NAV.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="v3-nav-menu-link"
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <SoonButton className="v3-nav-menu-cta">{NAV.cta}</SoonButton>
      </div>
    </div>
  )
}
