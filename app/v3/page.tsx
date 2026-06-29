import Atmosphere from './components/Atmosphere'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Loop from './components/Loop'
import Departments from './components/Departments'
import Journey from './components/Journey'
import FinalCta from './components/FinalCta'

/**
 * /v3 — the cinematic-dark Codepet rebuild (draft).
 * Atmosphere (grain + nebula) sits behind everything; the page runs
 * Hero → Marquee → Loop → Departments → Journey → Final CTA. Lives at
 * /v3 so it previews beside the current homepage; promoting it to `/`
 * is a one-line swap.
 */
export default function V3Page() {
  return (
    <>
      <Atmosphere />
      <main>
        <Nav />
        <Hero />
        <Marquee />
        <Loop />
        <Departments />
        <Journey />
        <FinalCta />
      </main>
    </>
  )
}
