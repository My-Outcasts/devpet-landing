// Blog chrome + theme. The blog now shares the main site's cinematic-dark
// v3 design language: it mounts inside the `.v3` scope (dark tokens, dark
// document root via `:root:has(.v3)`) and loads the same fonts —
// Google Sans Flex (body + headings), Playfair Display Italic (accents),
// and the self-hosted Minecraft pixel face (small labels, declared in
// v3.css). `blog.css` layers the editorial reading surface on top.
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
import '../v3/v3.css'
import '../v3/v3-fx.css'
import './blog.css'

const gsans = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-gsans',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['400', '500', '600'],
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v3 blogx ${gsans.variable} ${playfair.variable}`}>
      {children}
    </div>
  )
}
