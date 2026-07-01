import type { ReactNode } from 'react'
import type { Locale } from '@/lib/site'
import Atmosphere from '../../v3/components/Atmosphere'
import BlogNav from './BlogNav'
import BlogFooter from './BlogFooter'
import BlogLangSync from './BlogLangSync'

/**
 * Page chrome shared by every blog route. The blog lives inside the
 * site's cinematic-dark `.v3` scope (set up in the blog layout), so here
 * we just paint the atmosphere (drifting nebula + film grain, reused
 * from the landing) and hang the frosted pill nav + dark footer around a
 * `.bx-root` reading surface. `altHref` is the equivalent page in the
 * other locale, used by the nav's language switch.
 */
export default function BlogShell({
  locale,
  altHref,
  children,
}: {
  locale: Locale
  altHref: string
  children: ReactNode
}) {
  return (
    <div className="bx">
      <BlogLangSync locale={locale} />
      <Atmosphere />
      <BlogNav locale={locale} altHref={altHref} />
      <div className="bx-root">{children}</div>
      <BlogFooter locale={locale} />
    </div>
  )
}
