import Reveal from './Reveal'
import SplitText from './SplitText'
import { ENVIRONMENT } from '../content'

/**
 * Environment — byte's guided Claude Code setup. Two columns: the
 * pitch on the left, a "recommended setup" panel (toggle rows) on the
 * right that mirrors the product's Environment view.
 */
export default function Environment() {
  return (
    <section id="environment" className="v3-section">
      <div className="v3-env-grid">
        <Reveal>
          <div>
            <p className="v3-eyebrow">{ENVIRONMENT.eyebrow}</p>
            <h2 className="v3-h2">
              <SplitText text={ENVIRONMENT.headlineLead} className="v3-lead" />{' '}
              <SplitText text={ENVIRONMENT.headlineAccent} className="it" />
            </h2>
            <p className="v3-sub">{ENVIRONMENT.sub}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="v3-env-panel">
            <div className="v3-env-panel-title">{ENVIRONMENT.panelTitle}</div>
            {ENVIRONMENT.items.map((it) => (
              <div key={it.name} className="v3-env-row">
                <div>
                  <div className="v3-env-name">{it.name}</div>
                  <div className="v3-env-desc">{it.desc}</div>
                </div>
                <span className="v3-env-toggle" aria-hidden="true"><span /></span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
