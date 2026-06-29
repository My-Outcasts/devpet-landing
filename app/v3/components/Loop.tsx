import Reveal from './Reveal'
import { LOOP } from '../content'

/**
 * Loop — byte's core promise as three calm beats:
 * Execute → Deliver → Approve. Frosted glass steps with a glowing
 * connector arrow between them.
 */
export default function Loop() {
  return (
    <section id="loop" className="v3-section">
      <Reveal>
        <p className="v3-eyebrow">{LOOP.eyebrow}</p>
        <h2 className="v3-h2">
          <span className="v3-lead">{LOOP.headlineLead}</span>{' '}
          <span className="it">{LOOP.headlineAccent}</span>
        </h2>
        <p className="v3-sub">{LOOP.sub}</p>
      </Reveal>

      <div className="v3-loop-grid">
        {LOOP.steps.map((s, i) => (
          <Reveal key={s.key} delay={i * 110}>
            <div className="v3-step">
              <span className="v3-step-num">0{i + 1}</span>
              <h3 className="v3-step-label">{s.label}</h3>
              <p className="v3-step-desc">{s.desc}</p>
              {i < LOOP.steps.length - 1 && (
                <svg className="v3-step-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
