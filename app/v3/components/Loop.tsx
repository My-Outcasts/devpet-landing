'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { LOOP } from '../content'

/**
 * Loop — Codepet's core promise as a self-running cycle:
 * Execute → Deliver → Approve. Three full-bleed image cards with the step
 * text over a gradient scrim; a highlight cycles through them so the loop
 * visibly "runs" (the active card blooms + its art eases in).
 * Reduced-motion: static, all lit.
 */
export default function Loop() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % LOOP.steps.length),
      2100,
    )
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="loop" className="v3-section">
      <Reveal>
        <p className="v3-eyebrow">{LOOP.eyebrow}</p>
        <h2 className="v3-h2">
          <SplitText text={LOOP.headlineLead} className="v3-lead" />{' '}
          <SplitText text={LOOP.headlineAccent} className="it" />
        </h2>
        <p className="v3-sub">{LOOP.sub}</p>
      </Reveal>

      <div className="v3-loopcards">
        {LOOP.steps.map((s, i) => (
          <Reveal key={s.key} delay={i * 150}>
            <article className={`v3-loopcard${active === i ? ' is-active' : ''}`}>
              <div className="v3-loopcard-media">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  unoptimized
                />
              </div>
              <span className="v3-loopcard-scrim" aria-hidden="true" />
              <div className="v3-loopcard-body">
                <span className="v3-loopcard-num">0{i + 1}</span>
                <div className="v3-loopcard-foot">
                  <h3 className="v3-loopcard-title">{s.label}</h3>
                  <p className="v3-loopcard-desc">{s.desc}</p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
