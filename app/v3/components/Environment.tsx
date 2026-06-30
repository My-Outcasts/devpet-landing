'use client'

import Image from 'next/image'
import { type CSSProperties } from 'react'
import Reveal from './Reveal'
import SplitText from './SplitText'
import { ENVIRONMENT } from '../content'

/**
 * Environment — Codepet's guided Claude Code setup as an alternating (zigzag)
 * feature list. A heading intro, then one row per capability: its image on
 * one side and the option (hue node, name, description, an ON toggle in its
 * colour) on the other, alternating left/right down the section.
 */
export default function Environment() {
  return (
    <section id="environment" className="v3-section">
      <Reveal>
        <div className="v3-env-intro">
          <p className="v3-eyebrow">{ENVIRONMENT.eyebrow}</p>
          <h2 className="v3-h2">
            <SplitText text={ENVIRONMENT.headlineLead} className="v3-lead" />{' '}
            <SplitText text={ENVIRONMENT.headlineAccent} className="it" />
          </h2>
          <p className="v3-sub">{ENVIRONMENT.sub}</p>
        </div>
      </Reveal>

      <div className="v3-env-zigzag">
        {ENVIRONMENT.items.map((it, i) => (
          <Reveal key={it.name} delay={(i % 2) * 60}>
            <div className="v3-env-zrow" style={{ ['--c']: it.color } as CSSProperties}>
              <div className="v3-env-zimg v3-img-reveal">
                <Image src={it.image} alt="" fill sizes="(max-width: 760px) 100vw, 560px" unoptimized />
              </div>
              <div className="v3-env-zbody">
                <span className="v3-env-node" aria-hidden="true" />
                <h3 className="v3-env-zname">{it.name}</h3>
                <p className="v3-env-zdesc">{it.desc}</p>
                <span className="v3-env-toggle" aria-hidden="true"><span /></span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
