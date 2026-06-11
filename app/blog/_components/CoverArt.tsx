import type { CategorySlug } from '@/lib/blog/categories'

/**
 * Deterministic generative cover art — flat editorial illustrations.
 *
 * The blog has no photography, so each post gets a unique illustrated
 * scene drawn as inline SVG from a seed derived from its slug. To keep
 * every post visually distinct, there are several DIFFERENT scene types
 * (landscape, mountains, arches, orbit, blobs, plant, sunburst); the
 * slug picks both the scene type and the seeded variation, while the
 * category picks the palette. Same slug → same art (SSR-safe, free).
 */

type Palette = {
  sky: [string, string]
  accent: string
  tones: [string, string, string] // light → dark
  leaf: string
  speck: string
}

const PALETTES: Record<CategorySlug, Palette> = {
  'building-ai-products': {
    sky: ['#F4F1FC', '#E6DCF7'],
    accent: '#F8C66B',
    tones: ['#BBADF0', '#8B7BE0', '#5C4DB8'],
    leaf: '#6E5FC8',
    speck: '#FFFFFF',
  },
  'user-insights': {
    sky: ['#F0F3FD', '#DCE4FA'],
    accent: '#F4A9C0',
    tones: ['#A9BCF6', '#6E86E0', '#3F58B8'],
    leaf: '#4F6AD0',
    speck: '#FFFFFF',
  },
  'second-brain': {
    sky: ['#F6EFFC', '#EADBF8'],
    accent: '#F3B6DA',
    tones: ['#CBAEF6', '#A886EE', '#7A4FCF'],
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
type R = () => number
type El = React.ReactElement

const r1 = (n: number) => Number(n.toFixed(1))

function specks(rng: R, p: Palette, n = 6): El[] {
  return Array.from({ length: n }, (_, i) => (
    <circle
      key={`sp${i}`}
      cx={r1(W * rng())}
      cy={r1(H * (0.05 + rng() * 0.45))}
      r={r1(2 + rng() * 4)}
      fill={p.speck}
      opacity={r1(0.4 + rng() * 0.4)}
    />
  ))
}

function leaf(rng: R, p: Palette, cx: number, cy: number, size: number, key: string): El {
  const rot = Math.round(rng() * 360)
  const d = `M ${r1(cx)} ${r1(cy - size)} Q ${r1(cx + size * 0.62)} ${r1(cy)} ${r1(cx)} ${r1(cy + size)} Q ${r1(cx - size * 0.62)} ${r1(cy)} ${r1(cx)} ${r1(cy - size)} Z`
  return (
    <g key={key} transform={`rotate(${rot} ${r1(cx)} ${r1(cy)})`} opacity={r1(0.55 + rng() * 0.4)}>
      <path d={d} fill={p.leaf} />
      <line
        x1={r1(cx)} y1={r1(cy - size * 0.8)} x2={r1(cx)} y2={r1(cy + size * 0.8)}
        stroke={p.sky[0]} strokeWidth={Math.max(2, size * 0.06)} strokeLinecap="round" opacity={0.6}
      />
    </g>
  )
}

/* ── Scene 1: rolling hills + sun + leaves ── */
function sceneHills(rng: R, p: Palette): El[] {
  const els: El[] = [...specks(rng, p, 6)]
  const left = rng() > 0.5
  els.push(<circle key="sun" cx={r1(left ? W * 0.22 : W * 0.78)} cy={r1(H * (0.28 + rng() * 0.12))} r={r1(85 + rng() * 60)} fill={p.accent} />)
  for (let i = 0; i < 4 + Math.floor(rng() * 3); i++) els.push(leaf(rng, p, W * (0.1 + rng() * 0.8), H * (0.1 + rng() * 0.28), 32 + rng() * 40, `lf${i}`))
  for (let i = 0; i < 3; i++) {
    const baseY = H * (0.52 + (i / 2) * 0.26)
    const amp = 26 + rng() * 44
    let d = `M 0 ${r1(baseY)}`
    for (let k = 1; k <= 3; k++) {
      const x = (k * W) / 3
      d += ` Q ${r1(x - W / 6)} ${r1(baseY + (rng() * 2 - 1) * amp)} ${r1(x)} ${r1(baseY + (rng() * 2 - 1) * amp * 0.5)}`
    }
    d += ` L ${W} ${H} L 0 ${H} Z`
    els.push(<path key={`hl${i}`} d={d} fill={p.tones[i]} />)
  }
  return els
}

/* ── Scene 2: mountain range + moon + stars ── */
function sceneMountains(rng: R, p: Palette): El[] {
  const els: El[] = [...specks(rng, p, 9)]
  els.push(<circle key="moon" cx={r1(W * (0.6 + rng() * 0.25))} cy={r1(H * (0.22 + rng() * 0.12))} r={r1(70 + rng() * 50)} fill={p.accent} />)
  const layer = (baseY: number, tone: string, count: number, minH: number, maxH: number) => {
    for (let i = 0; i < count; i++) {
      const cx = W * (i / (count - 1)) + (rng() * 2 - 1) * 120
      const w = 180 + rng() * 200
      const h = minH + rng() * (maxH - minH)
      els.push(<polygon key={`mt${baseY}${i}`} points={`${r1(cx - w)},${r1(baseY)} ${r1(cx)},${r1(baseY - h)} ${r1(cx + w)},${r1(baseY)}`} fill={tone} />)
    }
  }
  layer(H * 0.74, p.tones[0], 5, 120, 230)
  layer(H * 0.9, p.tones[2], 5, 150, 300)
  els.push(<rect key="ground" x="0" y={r1(H * 0.88)} width={W} height={H} fill={p.tones[2]} />)
  return els
}

/* ── Scene 3: nested arches ── */
function sceneArches(rng: R, p: Palette): El[] {
  const els: El[] = [...specks(rng, p, 5)]
  const cx = W * (0.3 + rng() * 0.4)
  const cy = H * (0.92 + rng() * 0.06)
  const cols = [p.tones[2], p.tones[1], p.tones[0], p.accent, p.leaf]
  let r = 360 + rng() * 120
  for (let i = 0; i < 5; i++) {
    els.push(<path key={`ar${i}`} d={`M ${r1(cx - r)} ${r1(cy)} A ${r1(r)} ${r1(r)} 0 0 1 ${r1(cx + r)} ${r1(cy)} Z`} fill={cols[i % cols.length]} />)
    r *= 0.72 - rng() * 0.06
  }
  return els
}

/* ── Scene 4: planet + orbit + moons ── */
function sceneOrbit(rng: R, p: Palette): El[] {
  const els: El[] = [<rect key="bg2" x="0" y="0" width={W} height={H} fill="none" />, ...specks(rng, p, 12)]
  const cx = W * (0.4 + rng() * 0.2)
  const cy = H * (0.5 + (rng() * 2 - 1) * 0.08)
  els.push(<circle key="planet" cx={r1(cx)} cy={r1(cy)} r={r1(120 + rng() * 60)} fill={p.tones[1]} />)
  const rot = Math.round((rng() * 2 - 1) * 35)
  const rx = 300 + rng() * 140
  const ry = 110 + rng() * 60
  els.push(<ellipse key="orbit" cx={r1(cx)} cy={r1(cy)} rx={r1(rx)} ry={r1(ry)} fill="none" stroke={p.tones[0]} strokeWidth={10} transform={`rotate(${rot} ${r1(cx)} ${r1(cy)})`} opacity={0.9} />)
  const moons = 2 + Math.floor(rng() * 2)
  for (let i = 0; i < moons; i++) {
    const a = rng() * Math.PI * 2
    const mx = cx + Math.cos(a) * rx * Math.cos((rot * Math.PI) / 180) - Math.sin(a) * ry * Math.sin((rot * Math.PI) / 180)
    const my = cy + Math.cos(a) * rx * Math.sin((rot * Math.PI) / 180) + Math.sin(a) * ry * Math.cos((rot * Math.PI) / 180)
    els.push(<circle key={`mn${i}`} cx={r1(mx)} cy={r1(my)} r={r1(16 + rng() * 18)} fill={i === 0 ? p.accent : p.tones[2]} />)
  }
  return els
}

/* ── Scene 5: abstract blobs (memphis) ── */
function sceneBlobs(rng: R, p: Palette): El[] {
  const els: El[] = []
  const cols = [p.tones[0], p.tones[1], p.tones[2], p.accent, p.leaf]
  const n = 6 + Math.floor(rng() * 3)
  for (let i = 0; i < n; i++) {
    const cx = W * rng(), cy = H * rng()
    const size = 110 + rng() * 230
    const col = cols[Math.floor(rng() * cols.length)]
    const op = r1(0.55 + rng() * 0.4)
    const kind = Math.floor(rng() * 3)
    if (kind === 0) els.push(<circle key={`b${i}`} cx={r1(cx)} cy={r1(cy)} r={r1(size / 2)} fill={col} opacity={op} />)
    else if (kind === 1) els.push(<rect key={`b${i}`} x={r1(cx - size / 2)} y={r1(cy - size / 2)} width={r1(size)} height={r1(size)} rx={r1(size * 0.32)} transform={`rotate(${Math.round(rng() * 90)} ${r1(cx)} ${r1(cy)})`} fill={col} opacity={op} />)
    else els.push(leaf(rng, p, cx, cy, size * 0.4, `b${i}`))
  }
  els.push(...specks(rng, p, 6))
  return els
}

/* ── Scene 6: growing plant ── */
function scenePlant(rng: R, p: Palette): El[] {
  const els: El[] = [...specks(rng, p, 5)]
  els.push(<circle key="sun" cx={r1(W * (0.72 + rng() * 0.16))} cy={r1(H * (0.24 + rng() * 0.1))} r={r1(70 + rng() * 40)} fill={p.accent} />)
  const groundY = H * 0.82
  const stems = 3 + Math.floor(rng() * 3)
  for (let s = 0; s < stems; s++) {
    const x = W * (0.2 + (s / Math.max(1, stems - 1)) * 0.6) + (rng() * 2 - 1) * 40
    const top = groundY - (180 + rng() * 220)
    const bend = (rng() * 2 - 1) * 90
    els.push(<path key={`st${s}`} d={`M ${r1(x)} ${r1(groundY)} Q ${r1(x + bend)} ${r1((groundY + top) / 2)} ${r1(x + bend * 0.6)} ${r1(top)}`} fill="none" stroke={p.tones[2]} strokeWidth={r1(8 + rng() * 4)} strokeLinecap="round" />)
    const leaves = 2 + Math.floor(rng() * 3)
    for (let l = 0; l < leaves; l++) {
      const ty = groundY - (l + 1) * ((groundY - top) / (leaves + 1))
      const tx = x + bend * ((groundY - ty) / (groundY - top)) * 0.6
      els.push(leaf(rng, p, tx + (l % 2 ? 24 : -24), ty, 26 + rng() * 22, `pl${s}-${l}`))
    }
  }
  els.push(<rect key="ground" x="0" y={r1(groundY)} width={W} height={H} fill={p.tones[2]} />)
  return els
}

/* ── Scene 7: sunburst ── */
function sceneSunburst(rng: R, p: Palette): El[] {
  const els: El[] = []
  const cx = W * (0.3 + rng() * 0.4)
  const cy = H * (0.4 + rng() * 0.25)
  const rays = 12 + Math.floor(rng() * 6)
  const len = 520
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + rng() * 0.05
    const wA = 0.06
    const p1 = [cx + Math.cos(a - wA) * len, cy + Math.sin(a - wA) * len]
    const p2 = [cx + Math.cos(a + wA) * len, cy + Math.sin(a + wA) * len]
    els.push(<polygon key={`ry${i}`} points={`${r1(cx)},${r1(cy)} ${r1(p1[0])},${r1(p1[1])} ${r1(p2[0])},${r1(p2[1])}`} fill={i % 2 ? p.tones[0] : p.tones[1]} opacity={0.85} />)
  }
  els.push(<circle key="core" cx={r1(cx)} cy={r1(cy)} r={r1(70 + rng() * 40)} fill={p.accent} />)
  els.push(...specks(rng, p, 7))
  return els
}

const SCENES = [sceneHills, sceneMountains, sceneArches, sceneOrbit, sceneBlobs, scenePlant, sceneSunburst]

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
  // Scene type is chosen from the slug so every post differs.
  const scene = SCENES[hashString(`${slug}|scene`) % SCENES.length]

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
        {scene(rng, p)}
      </g>
    </svg>
  )
}
