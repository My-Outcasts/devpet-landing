'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll — Lenis inertia scrolling + a subtle scroll-velocity
 * skew applied to the page content (.v3-skewer). In-page anchor links
 * are routed through Lenis so they glide. Disabled for reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    // Scroll-velocity skew → CSS var read by each section (.v3-skewer > *).
    lenis.on('scroll', () => {
      const vel = (lenis as { velocity?: number }).velocity ?? 0
      const v = Math.max(-0.7, Math.min(0.7, vel * 0.025))
      document.documentElement.style.setProperty('--vskew', `${v.toFixed(3)}deg`)
    })

    // Route in-page anchors through Lenis for a smooth glide.
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href') || ''
      if (id.length < 2) return
      const target = document.querySelector(id)
      if (target) { ev.preventDefault(); lenis.scrollTo(target as HTMLElement, { offset: -90 }) }
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])

  return null
}
