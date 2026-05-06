// Canonical landing at `/`.
//
// The implementation lives in `app/v2/` (kept as a self-contained
// segment so we can still mount it under `/v2` if needed). Because
// Next.js App Router scopes layouts to their route segment, simply
// re-exporting `./v2/page` is NOT enough — the v2 layout's CSS
// import (`./v2/fonts.css`, ~190KB of `.v2-*` styles) and the
// `LocaleClassWrapper` wouldn't apply at `/`. So we replicate the
// v2 layout's behavior here.
import type { Metadata } from 'next'
import './v2/fonts.css'
import LocaleClassWrapper from './v2/components/LocaleClassWrapper'
import V2LandingPage from './v2/page'

export const metadata: Metadata = {
  title: 'Codepet — Learn to build agentic code with your crew',
  description:
    'Codepet is a macOS app that trains people to build real software with AI. 16 skills, 4 tiers, 8 companions, one shipped product.',
}

export default function Home() {
  return (
    <LocaleClassWrapper>
      <V2LandingPage />
    </LocaleClassWrapper>
  )
}
