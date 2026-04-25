import type { Metadata } from 'next'
import { Varela_Round } from 'next/font/google'
import { LocaleProvider } from '@/lib/LocaleProvider'
import './globals.css'

const varelaRound = Varela_Round({ weight: '400', subsets: ['latin'], variable: '--font-varela' })

export const metadata: Metadata = {
  title: 'Codepet — The AI coding school with your pet',
  description: 'Learn to vibecode with your companion. 16 skills, 4 tiers, and a pet that grows as you do.',
  // PWA manifest — installable on macOS / Windows / Android. When the
  // visitor adds Codepet to their dock or home screen, Chrome/Safari
  // open it in a standalone window with no tab bar or URL bar
  // (matches the "full website, no Google chrome" experience the
  // brand wants).
  manifest: '/manifest.json',
  themeColor: '#1C40CF',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/codepet-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/codepet-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/codepet-apple-touch-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Codepet',
  },
}
// Note: title & description are updated client-side by LocaleProvider based on detected locale

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className={varelaRound.variable}>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
