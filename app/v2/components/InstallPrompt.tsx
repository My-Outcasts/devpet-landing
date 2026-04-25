'use client'

import { useEffect, useState } from 'react'

/**
 * Floating "Install Codepet" pill — Progressive Web App install prompt.
 *
 * On Chromium browsers (Chrome / Edge / Brave) the browser fires a
 * `beforeinstallprompt` event when the site qualifies as installable
 * (manifest + icons + served over HTTPS). We capture the event,
 * suppress Chrome's own install banner, and surface our own pixel-
 * styled pill instead. Clicking the pill calls `prompt()` on the
 * captured event and shows the native install dialog.
 *
 * The pill self-hides when:
 *   - the app is already running in standalone display mode (the
 *     visitor opened it from their dock / home screen), OR
 *   - the visitor dismissed it (we drop a flag in localStorage so
 *     it doesn't keep nagging on every page load), OR
 *   - the visitor accepts the install (Chrome fires `appinstalled`).
 *
 * Safari / Firefox don't fire `beforeinstallprompt` — on those the
 * pill simply never renders. (Safari users can install via the share
 * sheet → "Add to Home Screen"; if you want a Safari-specific hint
 * we can add a separate UA-sniff branch later.)
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const DISMISS_KEY = 'codepet-pwa-install-dismissed'

export default function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Already installed? bail.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(display-mode: standalone)').matches
    ) {
      setHidden(true)
      return
    }

    // Previously dismissed? bail.
    try {
      if (localStorage.getItem(DISMISS_KEY)) {
        setHidden(true)
        return
      }
    } catch {
      // localStorage may be blocked (private mode, etc.) — fail open.
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredEvent(e as BeforeInstallPromptEvent)
    }

    const onInstalled = () => {
      setDeferredEvent(null)
      setHidden(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (hidden || !deferredEvent) return null

  const handleInstall = async () => {
    try {
      await deferredEvent.prompt()
      const { outcome } = await deferredEvent.userChoice
      if (outcome === 'accepted') {
        // Chrome will also fire `appinstalled`; this is a fallback.
        setHidden(true)
      }
    } catch {
      // User-agent threw — ignore, leave the pill in place.
    } finally {
      setDeferredEvent(null)
    }
  }

  const handleDismiss = () => {
    setHidden(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Same fail-open as above.
    }
  }

  return (
    <div className="v2-install-pill" role="region" aria-label="Install Codepet">
      <button
        type="button"
        className="v2-install-pill-cta"
        onClick={handleInstall}
      >
        Install Codepet
      </button>
      <button
        type="button"
        className="v2-install-pill-dismiss"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
      >
        ×
      </button>
    </div>
  )
}
