'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * Stats — Section 4 of the /v2 landing.
 *
 * Framer-match redesign (updated):
 *
 *   ┌─ white rounded container (30px radius) ─────────────────┐
 *   │   ◤◤◤            ▓▓▓▓                                  │
 *   │  ◤ red ◤        ▓ yellow ▓                             │
 *   │ ◤ triangle ◤   ▓  square  ▓    ╭────────╮              │
 *   │◤───────◤      ▓▓▓▓▓▓▓▓▓▓▓     │  blue   │              │
 *   │                                │ circle │              │
 *   │   1,504        70%             │  2x    │              │
 *   │  builders   success rate       ╰─ faster ╯             │
 *   └─────────────────────────────────────────────────────────┘
 *
 * ─── Scroll-linked enter animation (per Framer spec) ─────────
 * Each decorative shape slides into place from its respective
 * direction as the section scrolls into view:
 *   Triangle → Slide In Left  (offset X: -150)
 *   Square   → Slide In Top   (offset Y: -150)
 *   Circle   → Slide In Right (offset X:  150)
 * Transition: Spring, stiffness 200 / damping 35 / mass 1
 *             → damping ratio ≈ 1.24 (overdamped, smooth settle)
 * Trigger: Section in View, Replay: Yes
 *
 * Driven by a single rAF-throttled scroll listener that writes
 * `--enter-p` (0..1) to the section root; each shape's CSS rule
 * consumes the variable with its own per-shape axis/direction.
 * Scrolling back up reverses the animation automatically since
 * --enter-p is a live value.
 */
// Per-stat colours — number + label each follow the shape sitting
// behind them: "1,504 / builders" sits over the red triangle (white
// reads), "70% / success rate" sits on white ground (dark grey reads),
// "2x / faster" sits inside the blue circle (white reads).
// Numeric values stay hardcoded (universal across locales); only the
// label text comes from translations. The `labelKey` indexes into
// t.v2.stats so each row can swap its localized label at render.
const stats = [
  { value: '1,504', labelKey: 'builders' as const,    color: '#FFFFFF', labelColor: '#FFFFFF' },
  { value: '70%',   labelKey: 'successRate' as const, color: '#000000', labelColor: '#8C8C8C' },
  { value: '2x',    labelKey: 'faster' as const,      color: '#FFFFFF', labelColor: '#FFFFFF' },
] as const

export default function Stats() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let ticking = false
    const update = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 0 when section top is at viewport bottom, 1 once the top
      // has risen by ~60% of a viewport. Matches the feel of the
      // Product/Mindset reveals — slow, deliberate, scroll-linked.
      const raw = (vh - rect.top) / (vh * 0.6)
      const clamped = Math.max(0, Math.min(1, raw))
      section.style.setProperty('--enter-p', clamped.toFixed(4))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="stats" ref={sectionRef} className="v2-stats">
      <div className="v2-stats-wrap">
        {/* Decorative shapes — bleed past the container edges. Each
            slides in from its own direction as the section enters view. */}
        <span
          className="v2-stats-shape v2-stats-shape--triangle"
          aria-hidden="true"
        />
        <span
          className="v2-stats-shape v2-stats-shape--square"
          aria-hidden="true"
        />
        <span
          className="v2-stats-shape v2-stats-shape--circle"
          aria-hidden="true"
        />

        <div className="v2-stats-inner">
          {stats.map((stat) => (
            <div className="v2-stat" key={stat.labelKey}>
              <span
                className="v2-stat-number"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <p
                className="v2-stat-label"
                style={{ color: stat.labelColor }}
              >
                {t.v2.stats[stat.labelKey]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
