import type { CSSProperties } from 'react'
import Image from 'next/image'
import Reveal from './Reveal'
import { DEPARTMENTS } from '../content'

/**
 * Departments — the eight pixel-art covers from the product app,
 * reframed inside glass cards with a department-colour glow. The
 * fusion moment: retro pixel art living inside the premium dark world.
 */
export default function Departments() {
  return (
    <section id="departments" className="v3-section">
      <Reveal>
        <p className="v3-eyebrow">{DEPARTMENTS.eyebrow}</p>
        <h2 className="v3-h2">
          <span className="v3-lead">{DEPARTMENTS.headlineLead}</span>{' '}
          <span className="it">{DEPARTMENTS.headlineAccent}</span>
        </h2>
        <p className="v3-sub">{DEPARTMENTS.sub}</p>
      </Reveal>

      <Reveal>
        <div className="v3-showcase">
          <Image src="/v3/coder-burst.jpg" alt="One builder, a whole company of work" fill sizes="(max-width: 720px) 100vw, 1180px" unoptimized />
          <div className="v3-showcase-cap">
            <h3>One person. A whole company’s worth of work.</h3>
            <p>byte carries the load across every department — so it never all lands on you at once.</p>
          </div>
        </div>
      </Reveal>

      <div className="v3-dept-grid">
        {DEPARTMENTS.items.map((d, i) => (
          <Reveal key={d.key} delay={(i % 4) * 90}>
            <article className="v3-dept" style={{ '--dept': d.color } as CSSProperties}>
              <div className="v3-dept-cover">
                <Image src={d.cover} alt={`${d.name} cover`} fill sizes="(max-width: 520px) 100vw, 280px" unoptimized />
              </div>
              <div className="v3-dept-body">
                <span className="v3-dept-tag">{d.name.slice(0, 2)}</span>
                <h3 className="v3-dept-name">{d.name}</h3>
                <p className="v3-dept-need">{d.need}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
