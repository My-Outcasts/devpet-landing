'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/**
 * Top nav for /v2 landing.
 *
 * Layout (per "pixels" reference):
 *   [ Nav links — LEFT ] [ Codepet wordmark — CENTER, enlarged ] [ CTA — RIGHT ]
 *
 * ─── Scroll behaviour (Headroom pattern, snap-aware) ──────────
 * Sticky at the top with a solid white background. While the
 * reader scrolls DOWN past the nav's own height the bar slides
 * up out of view (`transform: translateY(-100%)`); on UP it
 * slides back. Near the top of the page (scrollY ≤ NAV_HEIGHT)
 * the nav is always shown so the hero opens with it in place.
 *
 * SHOW threshold is much higher than HIDE threshold (40px vs
 * 8px) because the page's scroll-snap-type fires small upward
 * scroll-corrections at section boundaries that would otherwise
 * read as 'user scrolled up' and pop the nav back into view in
 * the middle of e.g. the Testimonials section. Only a deliberate
 * upward gesture (>40px) re-shows the bar; snap-induced
 * micro-scrolls leave the nav hidden.
 *
 * The scroll listener is rAF-throttled and ignores deltas under
 * a small threshold so micro-jitter from trackpads doesn't
 * flicker the bar.
 *
 * ─── Appear effect (on mount) ─────────────────────────────────
 * Framer spec: Enter { opacity: 0, y: -150 }, Spring physics
 * stiffness 150 / damping 25 / mass 1 → ζ ≈ 1.02, critically
 * damped, mapped to a 0.6s ease-out cubic-bezier. Staggered per
 * child (see v2-nav-drop-in keyframes in fonts.css).
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Suppresses the show branch immediately after a nav anchor
  // click so the destination section gets a clean view without
  // the bar sliding down into it.
  const suppressShowUntilRef = useRef(0)

  useEffect(() => {
    let lastY = typeof window === 'undefined' ? 0 : window.scrollY
    let ticking = false
    const HIDE_THRESHOLD = 8     // px of downward scroll to hide
    const SHOW_THRESHOLD = 40    // px of upward scroll to show — high
                                  // enough to ignore scroll-snap
                                  // micro-corrections that would
                                  // otherwise pop the bar back down
                                  // into the middle of a section
    const NAV_HEIGHT = 124       // approx bar height (32 top padding
                                  // + 60 wordmark cap + 32 bottom)

    const update = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY

      // Headroom hide/show
      if (currentY <= NAV_HEIGHT) {
        // Always show the nav near the very top of the page so the
        // hero opens with it in place.
        setHidden(false)
        lastY = currentY
      } else if (delta > HIDE_THRESHOLD) {
        // Scrolled down meaningfully — hide the bar.
        setHidden(true)
        lastY = currentY
      } else if (delta < -SHOW_THRESHOLD &&
                 Date.now() >= suppressShowUntilRef.current) {
        // Scrolled UP meaningfully (>40px) — show the bar, unless
        // we're in the brief suppression window after a nav-anchor
        // click (which would otherwise re-show the bar at the
        // destination section).
        setHidden(false)
        lastY = currentY
      }

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

  // When the user clicks a nav anchor (PRODUCT / GET GOOD / etc.)
  // and the browser smooth-scrolls down to the target, we want the
  // bar to slide AWAY (Headroom hide branch handles that, since
  // the browser's programmatic scroll counts as scroll-down) and
  // STAY hidden at the destination so the section gets a clean
  // viewport. Without this suppression window the smooth-scroll's
  // tail would hit the show-threshold's upward branch (because
  // scroll-snap settles by reversing slightly) and pop the bar
  // back down into the section. 1.5s comfortably covers the
  // smooth-scroll + snap-correction tail.
  const handleAnchorClick = () => {
    suppressShowUntilRef.current = Date.now() + 1500
    setHidden(true)
  }

  return (
    <nav
      className={`v2-nav${scrolled ? ' v2-nav--scrolled' : ''}${hidden ? ' v2-nav--hidden' : ''}`}
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
