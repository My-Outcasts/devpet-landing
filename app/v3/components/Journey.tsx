import Reveal from './Reveal'
import { JOURNEY } from '../content'

/**
 * Journey — the roadmap as a single luminous path. Five phases on a
 * glowing connector line: Find → Build → Ship → Launch → Run & grow.
 */
export default function Journey() {
  return (
    <section id="journey" className="v3-section">
      <Reveal>
        <p className="v3-eyebrow">{JOURNEY.eyebrow}</p>
        <h2 className="v3-h2">
          <span className="v3-lead">{JOURNEY.headlineLead}</span>{' '}
          <span className="it">{JOURNEY.headlineAccent}</span>
        </h2>
        <p className="v3-sub">{JOURNEY.sub}</p>
      </Reveal>

      <div className="v3-journey-path">
        {JOURNEY.phases.map((p, i) => (
          <Reveal key={p.key} delay={i * 120}>
            <div className="v3-phase">
              <div className="v3-phase-dot" />
              <h3 className="v3-phase-label">{p.label}</h3>
              <p className="v3-phase-note">{p.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
