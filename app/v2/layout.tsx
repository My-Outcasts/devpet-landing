import type { Metadata } from 'next'
import './fonts.css'

export const metadata: Metadata = {
  title: 'Codepet — Learn to build agentic code with your crew',
  description:
    'Codepet is a macOS app that trains people to build real software with AI. 16 skills, 4 tiers, 8 companions, one shipped product.',
}

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className="v2-root min-h-screen">{children}</div>
}
