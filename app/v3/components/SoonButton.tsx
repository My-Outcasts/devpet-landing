'use client'

import { useState, type ReactNode } from 'react'

/**
 * SoonButton — a CTA for the pre-launch web app. Instead of navigating
 * to a not-yet-live destination, clicking it reveals a small floating
 * "launching soon" note (same behaviour as the hero "Sign Up" button).
 * Used for every "Open the web app" CTA (nav + final section).
 */
export default function SoonButton({
  className = '',
  children,
  note = 'The web app will be launched soon',
}: {
  className?: string
  children: ReactNode
  note?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <span className="v3-soon-wrap">
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && (
        <span className="v3-soon-note" role="status">
          {note}
        </span>
      )}
    </span>
  )
}
