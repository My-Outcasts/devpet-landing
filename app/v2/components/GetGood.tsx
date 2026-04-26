'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

/**
 * Get Good / Code.Grow.Learn — Section 6.
 *
 * Black band matching the Framer "GET GOOD" comp:
 *   - Corner eyebrow "■ GET GOOD" at top-left (Minecraft pixel caps)
 *   - Centered display headline "CODE.GROW.LEARN"
 *   - 4-card grid of learning-loop icons
 *   - Body paragraph explaining the 4-tier skill map
 *   - White-pill "Join the waitlist" CTA
 *
 * Icons are drawn from the existing /sprites-svg/ui/ library
 * (copied into /public/v2/get-good/ so Next.js can serve them)
 * with one exception: the "Your Companion" tile reuses the
 * purple Byte from the hero pet set. Any icon can be swapped by
 * editing the `cards` array — the CSS grid auto-flows.
 *
 * The nav "Get Good" link points to this section's id=`get-good`.
 */
const cards = [
  { icon: '/v2/get-good/icon-skill-map.png',        label: 'SKILL MAP' },
  { icon: '/v2/get-good/icon-your-companion.svg',   label: 'YOUR COMPANION' },
  { icon: '/v2/get-good/icon-real-practice.png',    label: 'REAL PRACTICE' },
  { icon: '/v2/get-good/icon-honest-insights.png',  label: 'HONEST INSIGHTS' },
] as const

export default function GetGood() {
  const sectionRef = useRef<HTMLElement | null>(null)
  // IntersectionObserver fires once when ~15% of the section is in
  // view, adding `.is-in-view` to the root. CSS handles the stagger
  // via per-element transition-delay (0s / 0.1s / 0.2s / 0.3s for
  // the four cards, matching the Framer inspector values).
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.15) setInView(true)
          else if (entry.intersectionRatio === 0) setInView(false)
        }
      },
      { threshold: [0, 0.15] }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="get-good"
      ref={sectionRef}
      className={`v2-getgood${inView ? ' is-in-view' : ''}`}
    >
      <span className="v2-corner-label v2-corner-label--tl">Get Good</span>

      <div className="v2-getgood-inner">
        <h2 className="v2-getgood-headline">CODE.GROW.LEARN</h2>

        <div className="v2-getgood-cards">
          {cards.map((card) => (
            <div key={card.label} className="v2-getgood-card">
              <div className="v2-getgood-card-icon">
                <Image
                  src={card.icon}
                  alt=""
                  width={220}
                  height={220}
                  unoptimized
                  aria-hidden="true"
                />
              </div>
              <p className="v2-getgood-card-label">{card.label}</p>
            </div>
          ))}
        </div>

        <p className="v2-getgood-body">
          Everything you need to actually get good. A skill map across four
          tiers tells you exactly what to learn next. Your companion — Crash,
          Nova, Glitch, and more — keeps you building. Every challenge happens
          in Cursor, VS Code, or Claude Code, and honest insights surface your
          weak spots so you know what to practice next.
        </p>

        {/* Pixel-art pill CTA — same two-layer pattern as Product
            and Mindset buttons. Outer <a> owns the drop-shadow
            outline, inner <span> owns the clip-path silhouette and
            the blue body fill. */}
        <a
          href="#waitlist"
          className="v2-getgood-cta"
          aria-label="Join the Codepet waitlist"
        >
          <span className="v2-getgood-cta-body">Join the waitlist</span>
        </a>
      </div>
    </section>
  )
}
