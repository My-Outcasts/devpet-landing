'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { JOURNEY } from '../content'

/**
 * Journey — a horizontal roadmap you travel along by scrolling. The section
 * pins; vertical scroll pans the track left→right so each stage
 * (Find→Build→Ship→Launch→Grow) arrives at centre one at a time, while a
 * horizontal line "draws" behind it — its glowing tip stays at screen
 * centre, so scrolling literally moves you to each stage. Each stage
 * unlocks as it's reached (node lights, card fades in). Below 820px /
 * reduced-motion it falls back to a plain vertical list.
 */
export default function Journey() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    const cells = Array.from(track.querySelectorAll<HTMLElement>('.v3-hroad-cell'))
    const n = cells.length
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let active = false
    let raf = 0

    const update = () => {
      if (!active) return
      const top = wrap.getBoundingClientRect().top + window.scrollY
      const dist = wrap.offsetHeight - window.innerHeight
      let p = (window.scrollY - top) / Math.max(1, dist)
      p = Math.min(1, Math.max(0, p))
      const cellW = cells[0].getBoundingClientRect().width
      const startX = window.innerWidth / 2 - cellW / 2
      const travel = (n - 1) * cellW
      track.style.transform = `translate3d(${(startX - p * travel).toFixed(1)}px,0,0)`
      wrap.style.setProperty('--p', p.toFixed(4))
      cells.forEach((c, i) => c.classList.toggle('is-on', p >= i / (n - 1) - 0.06))
    }

    const measure = () => {
      active = window.innerWidth > 820 && !reduce
      wrap.classList.toggle('is-pinned', active)
      if (active) {
        const cellW = cells[0].getBoundingClientRect().width
        wrap.style.height = `${(n - 1) * cellW + window.innerHeight}px`
      } else {
        wrap.style.height = ''
        track.style.transform = ''
        cells.forEach((c) => c.classList.add('is-on'))
      }
      update()
    }

    const onScroll = () => {
      if (!active) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="journey" className="v3-section v3-no-skew">
      <Reveal>
        <p className="v3-eyebrow">{JOURNEY.eyebrow}</p>
        <h2 className="v3-h2">
          <SplitText text={JOURNEY.headlineLead} className="v3-lead" />{' '}
          <SplitText text={JOURNEY.headlineAccent} className="it" />
        </h2>
        <p className="v3-sub">{JOURNEY.sub}</p>
      </Reveal>

      <div className="v3-hroad" ref={wrapRef} style={{ ['--n']: JOURNEY.phases.length } as CSSProperties}>
        <div className="v3-hroad-sticky">
          <div className="v3-hroad-track" ref={trackRef}>
            <div className="v3-hroad-line" aria-hidden="true">
              <span className="v3-hroad-fill" />
            </div>
            {JOURNEY.phases.map((ph, i) => (
              <div
                key={ph.key}
                className="v3-hroad-cell"
                data-pos={i % 2 === 0 ? 'above' : 'below'}
              >
                <div className="v3-hroad-card">
                  <span className="v3-rm-idx">0{i + 1}</span>
                  <h3 className="v3-rm-label">{ph.label}</h3>
                  <p className="v3-rm-note">{ph.note}</p>
                </div>
                <span className="v3-hroad-node" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
