import type { CSSProperties } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { JOURNEY } from '../content'

/**
 * Journey — the roadmap as a single luminous path. On scroll-in the
 * connector line draws left-to-right and the five phase dots ignite in
 * sequence (driven by the wrapping Reveal's `.is-in` + per-dot `--i`).
 */
export default function Journey() {
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

      <Reveal>
        <div className="v3-journey-path">
          {JOURNEY.phases.map((p, i) => (
            <div key={p.key} className="v3-phase" style={{ ['--i']: i } as CSSProperties}>
              <div className="v3-phase-dot" />
              <h3 className="v3-phase-label">{p.label}</h3>
              <p className="v3-phase-note">{p.note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
