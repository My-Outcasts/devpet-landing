'use client'

import { useEffect, useRef } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { JOURNEY } from '../content'

/**
 * Journey — the roadmap as a scroll-drawn timeline. A central line fills
 * top→down as the section scrolls through the viewport; each phase reveals
 * in sequence (slides up + fades in, its node lights) the moment the fill
 * reaches it — so scrolling progressively "unlocks" the steps.
 * Reduced-motion: fully drawn, all steps revealed, no scrubbing.
 */
export default function Journey() {
  const roadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const road = roadRef.current
    if (!road) return
    const steps = Array.from(road.querySelectorAll<HTMLElement>('.v3-rm-step'))
    const n = steps.length

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      road.style.setProperty('--p', '1')
      steps.forEach((s) => s.classList.add('is-on'))
      return
    }

    let raf = 0
    const update = () => {
      const rect = road.getBoundingClientRect()
      const vh = window.innerHeight
      // Fill starts when the roadmap top reaches ~80% down the viewport and
      // completes after it has travelled ~80% of its own height upward.
      const start = vh * 0.8
      const p = Math.min(1, Math.max(0, (start - rect.top) / (rect.height * 0.8)))
      road.style.setProperty('--p', p.toFixed(4))
      // A step unlocks once the fill has passed its centre.
      steps.forEach((s, i) => s.classList.toggle('is-on', p >= (i + 0.5) / n))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="journey" className="v3-section">
      <Reveal>
        <p className="v3-eyebrow">{JOURNEY.eyebrow}</p>
        <h2 className="v3-h2">
          <SplitText text={JOURNEY.headlineLead} className="v3-lead" />{' '}
          <SplitText text={JOURNEY.headlineAccent} className="it" />
        </h2>
        <p className="v3-sub">{JOURNEY.sub}</p>
      </Reveal>

      <div className="v3-roadmap" ref={roadRef}>
        <div className="v3-roadmap-line" aria-hidden="true">
          <span className="v3-roadmap-fill" />
        </div>
        {JOURNEY.phases.map((ph, i) => (
          <div key={ph.key} className="v3-rm-step" data-side={i % 2 === 0 ? 'left' : 'right'}>
            <div className="v3-rm-card">
              <span className="v3-rm-idx">0{i + 1}</span>
              <h3 className="v3-rm-label">{ph.label}</h3>
              <p className="v3-rm-note">{ph.note}</p>
            </div>
            <div className="v3-rm-node-wrap">
              <span className="v3-rm-node" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
