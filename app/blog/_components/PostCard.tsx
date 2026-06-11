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
 * Editorial split row: a large cover on one side and an airy text column
 * on the other (category eyebrow → meta → serif headline → excerpt →
 * "Read more"). No card chrome — alternation of the image side is handled
 * in CSS via .blog-post-row:nth-child(even). A thin rule separates rows.
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

  return (
    <Link href={postPath(locale, post.slug)} className="blog-post-row" data-category={post.category}>
      <div className="blog-post-cover">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt={post.coverAlt || ''} loading="lazy" />
        ) : (
          <CoverArt slug={post.slug} category={post.category} />
        )}
      </div>

      <div className="blog-post-content">
        {category && (
          <span className={`blog-post-eyebrow ${accentClass}`}>
            {category.label[locale]}
          </span>
        )}
        <div className="blog-card-meta">
          <span>{formatDate(post.date, locale)}</span>
          <span className="blog-dot" />
          <span>{formatReadingTime(post.readingMinutes, locale)}</span>
        </div>
        <h3 className="blog-post-title">{post.title}</h3>
        <p className="blog-post-excerpt">{post.description}</p>
        <span className={`blog-post-more ${accentClass}`}>
          {s.readMore}
        </span>
      </div>
    </Link>
  )
}
