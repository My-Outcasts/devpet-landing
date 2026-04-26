'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

/**
 * Top nav for /v2 landing.
 *
 * Layout (per "pixels" reference):
 *   [ Nav links — LEFT ] [ Codepet wordmark — CENTER, enlarged ] [ CTA — RIGHT ]
 *
 * ─── Scroll behaviour ─────────────────────────────────────────
 * Always sticky at the top — the bar stays visible at every
 * scroll position so the section links + wordmark are reachable
 * from anywhere on the page. (The previous Headroom-style hide-
 * on-scroll-down was disabled per design pass: it slid the bar
 * out of view as readers naturally scrolled into Mindset / Get
 * Good / etc., which felt jarring.)
 *
 * The scroll listener still runs to drive the .v2-nav--scrolled
 * class that fades the START YOUR JOURNEY CTA pill once the
 * reader has scrolled past the fold (every section below the
 * hero has its own waitlist CTA, so the nav one becomes
 * redundant).
 *
 * ─── Appear effect (on mount) ─────────────────────────────────
 * Framer spec: Enter { opacity: 0, y: -150 }, Spring physics
 * stiffness 150 / damping 25 / mass 1 → ζ ≈ 1.02, critically
 * damped, mapped to a 0.6s ease-out cubic-bezier. Staggered per
 * child (see v2-nav-drop-in keyframes in fonts.css).
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const currentY = window.scrollY

      // CTA fade trigger: hide the "Start Your Journey" pill as
      // soon as the reader has scrolled meaningfully past the
      // fold. We compare raw scrollY against 40% of the viewport —
      // reliable in every browser and independent of hydration
      // ordering or section rects. Every section below the hero
      // has its own waitlist CTA, so the nav one becomes redundant.
      setScrolled(currentY > window.innerHeight * 0.4)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    update() // initial sync on mount

    window.addEventListener('scroll', onScroll, { passive: true })
    // Also listen on document and body to cover any browser quirk
    // where scroll events fire on those instead of window.
    document.addEventListener('scroll', onScroll, { passive: true })

    // Belt-and-braces: IntersectionObserver on the hero.
    // When the hero is <50% in view, the reader is clearly past it.
    // Some setups miss a scroll event; this catches them.
    const hero = document.getElementById('hero')
    let observer: IntersectionObserver | null = null
    if (hero && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.intersectionRatio < 0.5) {
              setScrolled(true)
            } else if (window.scrollY <= window.innerHeight * 0.4) {
              setScrolled(false)
            }
          }
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] }
      )
      observer.observe(hero)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  // Anchor-click handler is now a no-op shim — kept as a hook
  // point in case we re-introduce per-click behaviour later (e.g.
  // analytics, scroll-margin tweaks) without changing every
  // <a onClick={...}> below.
  const handleAnchorClick = () => {
    // intentionally empty — nav stays visible at every scroll
    // position, so we no longer need to suppress hide logic on
    // anchor jumps.
  }

  return (
    <nav
      className={`v2-nav${scrolled ? ' v2-nav--scrolled' : ''}`}
      aria-label="Primary"
    >
      <div className="v2-nav-inner v2-nav-inner--enter">
        {/* LEFT — section links. Hover: thin rectangular outline
            fades in around each label via ::after pseudo-element. */}
        <ul className="v2-nav-links">
          <li>
            <a href="#product" className="v2-nav-link" onClick={handleAnchorClick}>Product</a>
          </li>
          <li>
            <a href="#get-good" className="v2-nav-link" onClick={handleAnchorClick}>Get Good</a>
          </li>
          <li>
            <a href="#skill-trees" className="v2-nav-link" onClick={handleAnchorClick}>Skill Tree</a>
          </li>
        </ul>

        {/* CENTER — Codepet wordmark, scaled up so it reads as the
            primary mark of the bar. */}
        <a href="#top" className="v2-nav-wordmark" aria-label="Codepet home" onClick={handleAnchorClick}>
          <Image
            src="/v2/codepet-wordmark.png"
            alt="Codepet"
            width={1215}
            height={240}
            priority
            unoptimized
          />
        </a>

        {/* RIGHT — persistent CTA anchors to the waitlist form.
            Two-layer pixel-art button:
              - outer <a>   : applies the black outer outline via
                              four zero-blur drop-shadows
              - inner <span>: carries the clip-path, body fill,
                              and inset highlight/shadow bevel
            Splitting the layers sidesteps the Chrome quirk where
            `filter` on the same element as `clip-path` gets
            cropped by that clip-path.

            Conditionally rendered — the entrance animation's
            `animation-fill-mode: both` kept pinning opacity:1 on
            this element, which beat every CSS-cascade attempt to
            fade it out. Yanking the node from the DOM when the
            reader is past the fold is the only fully reliable fix.
            An invisible placeholder keeps the grid's right column
            occupied so the wordmark stays visually centered. */}
        {scrolled ? (
          <span className="v2-nav-cta-placeholder" aria-hidden="true" />
        ) : (
          <a href="#waitlist" className="v2-nav-cta" onClick={handleAnchorClick}>
            <span className="v2-nav-cta-body">Start Your Journey</span>
          </a>
        )}
      </div>
    </nav>
  )
}
