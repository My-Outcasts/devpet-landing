import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import './v3.css'

// Elegant serif for the cinematic-dark headlines (regular + italic).
// Exposed as a CSS variable consumed by --v3-serif in v3.css.
const instrument = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Codepet — your AI cofounder',
  description:
    'Run your whole company with AI, department by department. byte drafts and builds with you, and you approve every move. A free macOS app.',
}

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <div className={`v3 ${instrument.variable}`}>{children}</div>
}
