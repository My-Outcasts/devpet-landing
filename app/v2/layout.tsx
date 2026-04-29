import type { Metadata } from 'next'
import './fonts.css'
import LocaleClassWrapper from './components/LocaleClassWrapper'

export const metadata: Metadata = {
  title: 'Codepet — Learn to build agentic code with your crew',
  description:
    'Codepet is a macOS app that trains people to build real software with AI. 16 skills, 4 tiers, 8 companions, one shipped product.',
}

export default function V2Layout({ children }: { children: React.ReactNode }) {
  // LocaleClassWrapper is a tiny client component that reads the
  // current locale from LocaleProvider and adds `.v2-root--vi` to
  // the wrapper when Vietnamese is active. Keeping it as a child of
  // this server-rendered layout lets us still export `metadata`.
  return <LocaleClassWrapper>{children}</LocaleClassWrapper>
}
