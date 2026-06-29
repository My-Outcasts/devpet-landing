import Nav from './components/Nav'
import Hero from './components/Hero'
import Loop from './components/Loop'
import Departments from './components/Departments'
import Journey from './components/Journey'
import FinalCta from './components/FinalCta'

/**
 * /v3 — the cinematic-dark Codepet rebuild (draft).
 * Five beats: Hero (constellation) → Loop → Departments → Journey →
 * Final CTA. Lives at /v3 so it previews side-by-side with the
 * current homepage; promoting it to `/` is a one-line swap.
 */
export default function V3Page() {
  return (
    <main>
      <Nav />
      <Hero />
      <Loop />
      <Departments />
      <Journey />
      <FinalCta />
    </main>
  )
}
