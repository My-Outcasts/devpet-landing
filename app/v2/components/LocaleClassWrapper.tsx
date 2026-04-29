'use client'

import { ReactNode } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * Wraps the v2 landing in a div whose class reflects the current
 * locale. The CSS variable + Upheaval TT overrides under
 * `.v2-root--vi` (see fonts.css) swap the entire pixel-font cascade
 * to DearPix when the user is on Vietnamese. English visits keep
 * `.v2-root` only and render with the original VT323 / Upheaval TT
 * stack — DearPix is never even loaded by the browser.
 *
 * Lives inside the (server-rendered) v2 layout because the layout
 * needs to export `metadata`, which a client component can't do.
 * This wrapper is the smallest client boundary that still lets us
 * read the locale.
 */
export default function LocaleClassWrapper({ children }: { children: ReactNode }) {
  const { locale } = useLocale()
  const className = 'v2-root min-h-screen' + (locale === 'vi' ? ' v2-root--vi' : '')
  return <div className={className}>{children}</div>
}
