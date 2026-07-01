import Link from 'next/link'
import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { postPath, formatDate, formatReadingTime } from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'
import Reveal from '../../v3/components/Reveal'
import CoverArt from './CoverArt'

/**
 * Article card — a frosted-glass tile (cover under a soft scrim, then
 * category eyebrow / title / excerpt / meta) that lifts and glows in its
 * category hue on hover. Cards fade + rise into view on scroll (the
 * landing's `Reveal`), staggered by grid position via `index`.
 */
export default function PostCard({
  post,
  locale,
  index = 0,
}: {
  post: PostMeta
  locale: Locale
  index?: number
}) {
  const category = getCategory(post.category)
  const href = postPath(locale, post.slug)

  return (
    <Reveal className="bx-card-cell" delay={(index % 3) * 80}>
      <article className="bx-card" data-category={post.category}>
        <Link href={href} className="bx-card-link">
          <div className="bx-card-media">
            {post.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover} alt={post.coverAlt || ''} loading="lazy" />
            ) : (
              <CoverArt slug={post.slug} category={post.category} />
            )}
            <div className="bx-card-scrim" aria-hidden="true" />
          </div>
          <div className="bx-card-body">
            {category && (
              <span className="bx-eyebrow" data-category={post.category}>
                {category.label[locale]}
              </span>
            )}
            <h3 className="bx-card-title">{post.title}</h3>
            <p className="bx-card-excerpt">{post.description}</p>
            <div className="bx-meta bx-card-meta">
              <span>{formatDate(post.date, locale)}</span>
              <span className="bx-dot" />
              <span>{formatReadingTime(post.readingMinutes, locale)}</span>
            </div>
          </div>
        </Link>
      </article>
    </Reveal>
  )
}
