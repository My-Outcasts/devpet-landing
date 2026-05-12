'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from './i18n/en.json'
import vi from './i18n/vi.json'

type Locale = 'en' | 'vi'
type Messages = typeof en

interface LocaleContextValue {
  locale: Locale
  t: Messages
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const messages: Record<Locale, Messages> = { en, vi: vi as Messages }

// Client-side fallback for environments where the server-side
// `x-vercel-ip-country` header isn't available (local `next dev`,
// preview deploys hitting a region without geo, etc). When the
// server already passed an `initialLocale` derived from the header,
// this fetch is skipped — no extra request, no flash of English.
async function detectLocaleFromIP(): Promise<Locale> {
  try {
    const res = await fetch('https://api.country.is', { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return 'en'
    const data = await res.json()
    return data.country === 'VN' ? 'vi' : 'en'
  } catch {
    return 'en'
  }
}

interface LocaleProviderProps {
  children: ReactNode
  /**
   * Initial locale, computed server-side from Vercel's
   * `x-vercel-ip-country` header. The server already picked the
   * right language by the time the page hits the browser, so we
   * trust this value and skip the client-side IP fetch unless it
   * wasn't provided (local dev, etc).
   */
  initialLocale?: Locale
}

export function LocaleProvider({ children, initialLocale = 'en' }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    // 1. Manual user override (clicked the globe at some point) wins
    //    over both server-side detection and IP fallback. Their
    //    saved choice is the source of truth from then on.
    const manual = localStorage.getItem('devpet-locale-manual')
    const saved = localStorage.getItem('devpet-locale') as Locale | null
    if (manual && saved) {
      if (saved !== locale) setLocale(saved)
      return
    }

    // 2. If the server already gave us a non-default locale (i.e. the
    //    header was present and resolved to 'vi'), trust it and skip
    //    the client-side fetch entirely.
    if (initialLocale === 'vi') return

    // 3. Otherwise (local dev, preview without geo, or US/other
    //    country defaulting to 'en'), do a client-side IP lookup as
    //    a defensive fallback. This catches the edge case where the
    //    server header was missing but the visitor is actually in VN.
    detectLocaleFromIP().then((detected) => {
      if (detected !== locale) setLocale(detected)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = messages[locale]
    document.title = t.metadata.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.metadata.description)
    document.documentElement.lang = locale === 'vi' ? 'vi' : 'en'
  }, [locale])

  const toggleLocale = () => {
    setLocale(prev => {
      const next = prev === 'en' ? 'vi' : 'en'
      // If they're toggling back to the country-default the server
      // detected, clear the manual override entirely. That way the
      // next visit resumes IP-based auto-detection — useful when
      // someone toggled out by accident, or when a returning
      // visitor crosses borders. Without this clear, a one-time
      // toggle would stick forever even if the user moved to a
      // different country.
      if (next === initialLocale) {
        localStorage.removeItem('devpet-locale')
        localStorage.removeItem('devpet-locale-manual')
      } else {
        localStorage.setItem('devpet-locale', next)
        localStorage.setItem('devpet-locale-manual', '1')
      }
      return next
    })
  }

  return (
    <LocaleContext.Provider value={{ locale, t: messages[locale], toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
