import Link from 'next/link'
import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { postPath, formatDate, formatReadingTime } from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'
import { blogStrings } from '@/lib/blog/ui-strings'
import CoverArt from './CoverArt'

const ACCENT_CLASS: Record<string, string> = {
  primary: 'blog-accent-primary',
  info: 'blog-accent-info',
  premium: 'blog-accent-premium',
}

/**
 * Post row (AKINA-style): a large rounded card (cover + centered text) with
 * a small external side-note column (date · reading time + a "Read" pill).
 * Odd/even rows alternate light/dark card, image side, and note side — all
 * handled by :nth-child rules in globals.css.
 */
export default function PostCard({
  post,
  locale,
}: {
  post: PostMeta
  locale: Locale
}) {
  const s = blogStrings(locale)
  const category = getCategory(post.category)
  const accentClass = category ? ACCENT_CLASS[category.accent] : ''
  const href = postPath(locale, post.slug)

  return (
    <article className="blog-post-row">
      <Link href={href} className="blog-post-card" data-category={post.category}>
        <div className="blog-post-card-cover">
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt={post.coverAlt || ''} loading="lazy" />
          ) : (
            <CoverArt slug={post.slug} category={post.category} />
          )}
        </div>
        <div className="blog-post-card-body">
          {category && (
            <span className={`blog-post-card-eyebrow ${accentClass}`}>
              {category.label[locale]}
            </span>
          )}
          <h3 className="blog-post-card-title">{post.title}</h3>
          <p className="blog-post-card-excerpt">{post.description}</p>
        </div>
      </Link>

      <div className="blog-post-aside">
        <div className="blog-card-meta blog-post-aside-note">
          <span>{formatDate(post.date, locale)}</span>
          <span className="blog-dot" />
          <span>{formatReadingTime(post.readingMinutes, locale)}</span>
        </div>
        <span className="blog-post-aside-rule" />
        <Link href={href} className="blog-post-pill">
          {s.readMore}
        </Link>
      </div>
    </article>
  )
}
