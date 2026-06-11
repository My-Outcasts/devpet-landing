import type { CategorySlug } from '@/lib/blog/categories'

/**
 * Deterministic generative cover art — a flat **editorial illustration**.
 *
 * The blog has no photography, so each post gets a unique, brand-colored
 * illustrated scene generated as inline SVG from a seed derived from its
 * slug: a soft sky, a warm sun/moon, layered rolling hills, and a few
 * botanical leaves. Same slug → same art every render (SSR-safe, free, no
 * image requests). Color comes from the post's category; the composition
 * is seeded so every post looks distinct.
 */

type Palette = {
  sky: [string, string]
  sun: string
  hills: string[] // back → front
  leaf: string
  speck: string
}

const PALETTES: Record<CategorySlug, Palette> = {
  'building-ai-products': {
    sky: ['#F4F1FC', '#E6DCF7'],
    sun: '#F8C66B',
    hills: ['#BBADF0', '#8B7BE0', '#5C4DB8'],
    leaf: '#6E5FC8',
    speck: '#FFFFFF',
  },
  'user-insights': {
    sky: ['#F0F3FD', '#DCE4FA'],
    sun: '#F4A9C0',
    hills: ['#A9BCF6', '#6E86E0', '#3F58B8'],
    leaf: '#4F6AD0',
    speck: '#FFFFFF',
  },
  'second-brain': {
    sky: ['#F6EFFC', '#EADBF8'],
    sun: '#F3B6DA',
    hills: ['#CBAEF6', '#A886EE', '#7A4FCF'],
    leaf: '#9A6FE6',
    speck: '#FFFFFF',
  },
}

function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** mulberry32 — small deterministic PRNG. */
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const W = 1200
const H = 675

export default function CoverArt({
  slug,
  category,
  className,
}: {
  slug: string
  category: CategorySlug
  className?: string
}) {
  const p = PALETTES[category] ?? PALETTES['building-ai-products']
  const rng = makeRng(hashString(`${slug}|${category}`))
  const id = `cv${hashString(slug).toString(36)}`

  // Sun/moon — upper area, side seeded.
  const sunOnLeft = rng() > 0.5
  const sunX = sunOnLeft ? W * (0.18 + rng() * 0.1) : W * (0.72 + rng() * 0.1)
  const sunY = H * (0.26 + rng() * 0.14)
  const sunR = 80 + rng() * 70

  // Three layered hills rising from the bottom.
  const hillEls: React.ReactElement[] = []
  const layers = p.hills.length
  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1)
    const baseY = H * (0.5 + t * 0.28) // back hills higher, front lower
    const amp = 26 + rng() * 46
    const segs = 3
    const step = W / segs
    let d = `M 0 ${baseY.toFixed(1)}`
    for (let k = 1; k <= segs; k++) {
      const x = k * step
      const cx = x - step / 2
      const cy = baseY + (rng() * 2 - 1) * amp
      const ey = baseY + (rng() * 2 - 1) * amp * 0.5
      d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${ey.toFixed(1)}`
    }
    d += ` L ${W} ${H} L 0 ${H} Z`
    hillEls.push(<path key={`h${i}`} d={d} fill={p.hills[i]} />)
  }

  // A few botanical leaves in the sky.
  const leafEls: React.ReactElement[] = []
  const leafCount = 3 + Math.floor(rng() * 3)
  for (let i = 0; i < leafCount; i++) {
    const cx = W * (0.08 + rng() * 0.84)
    const cy = H * (0.08 + rng() * 0.34)
    const size = 34 + rng() * 46
    const rot = Math.round(rng() * 360)
    const op = 0.5 + rng() * 0.4
    // Almond leaf via two quadratic curves + a midrib.
    const d = `M ${cx.toFixed(1)} ${(cy - size).toFixed(1)} Q ${(cx + size * 0.62).toFixed(1)} ${cy.toFixed(1)} ${cx.toFixed(1)} ${(cy + size).toFixed(1)} Q ${(cx - size * 0.62).toFixed(1)} ${cy.toFixed(1)} ${cx.toFixed(1)} ${(cy - size).toFixed(1)} Z`
    leafEls.push(
      <g key={`l${i}`} transform={`rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})`} opacity={op}>
        <path d={d} fill={p.leaf} />
        <line
          x1={cx.toFixed(1)}
          y1={(cy - size * 0.82).toFixed(1)}
          x2={cx.toFixed(1)}
          y2={(cy + size * 0.82).toFixed(1)}
          stroke={p.sky[0]}
          strokeWidth={Math.max(2, size * 0.06)}
          strokeLinecap="round"
          opacity={0.6}
        />
      </g>
    )
  }

  // A scatter of small specks.
  const speckEls: React.ReactElement[] = []
  const speckCount = 4 + Math.floor(rng() * 5)
  for (let i = 0; i < speckCount; i++) {
    speckEls.push(
      <circle
        key={`s${i}`}
        cx={(W * rng()).toFixed(1)}
        cy={(H * (0.05 + rng() * 0.4)).toFixed(1)}
        r={2 + rng() * 4}
        fill={p.speck}
        opacity={0.5 + rng() * 0.4}
      />
    )
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <rect x="0" y="0" width={W} height={H} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect x="0" y="0" width={W} height={H} fill={`url(#${id})`} />
        {speckEls}
        <circle cx={sunX.toFixed(1)} cy={sunY.toFixed(1)} r={sunR.toFixed(1)} fill={p.sun} />
        {leafEls}
        {hillEls}
      </g>
    </svg>
  )
}
