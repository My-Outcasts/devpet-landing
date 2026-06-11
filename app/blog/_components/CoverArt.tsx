import type { CategorySlug } from '@/lib/blog/categories'

/**
 * Deterministic generative cover art — abstract PIXEL-ART scenes.
 *
 * The blog has no photography, so each post gets a unique illustrated
 * scene drawn as inline SVG from a seed derived from its slug. Everything
 * is painted onto a coarse cell grid (COLS × ROWS) and emitted as flat,
 * gap-free <rect> blocks with `shape-rendering: crispEdges` — no
 * gradients, strokes, or antialiasing — so the result reads as simple,
 * elegant 8-bit art consistent with the Codepet pixel system.
 *
 * There are several scene types (hills, mountains, arches, orbit, blobs,
 * plant, sunburst); the slug picks the scene + seeded variation, the
 * category picks the palette. A few elements bob / blink via the pixel-
 * friendly `cv-bob` / `cv-blink` keyframes (translate / opacity only, so
 * the cells stay crisp). Same slug → same art (SSR-safe, free, no image
 * requests).
 */

type Palette = {
  sky: [string, string] // top band, bottom band
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

// Coarse grid: chunky cells read clearly as pixel art at any card size.
const COLS = 48
const ROWS = 27
const CELL = 24 // viewBox = 1152 × 648 (16:9)
const W = COLS * CELL
const H = ROWS * CELL

type R = () => number
type El = React.ReactElement
type Grid = (string | null)[][]
type Cell = [number, number]

/** Negative animation-delay so each element starts mid-cycle (desynced). */
const delay = (rng: R, max = 4) => ({ animationDelay: `-${(rng() * max).toFixed(2)}s` })

function makeGrid(p: Palette): Grid {
  const g: Grid = []
  const horizon = ROWS * 0.6
  for (let r = 0; r < ROWS; r++) {
    const fill = r < horizon ? p.sky[0] : p.sky[1]
    g.push(new Array(COLS).fill(fill))
  }
  return g
}

function paintDisc(g: Grid, cc: number, cr: number, rad: number, color: string, rowMax = ROWS) {
  for (let r = 0; r < Math.min(ROWS, rowMax); r++) {
    for (let c = 0; c < COLS; c++) {
      const dx = c + 0.5 - cc
      const dy = r + 0.5 - cr
      if (dx * dx + dy * dy <= rad * rad) g[r][c] = color
    }
  }
}

function discCells(cc: number, cr: number, rad: number): Cell[] {
  const out: Cell[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const dx = c + 0.5 - cc
      const dy = r + 0.5 - cr
      if (dx * dx + dy * dy <= rad * rad) out.push([c, r])
    }
  }
  return out
}

const rect = (c: number, r: number, w: number, color: string, key: string): El => (
  <rect key={key} x={c * CELL} y={r * CELL} width={w * CELL} height={CELL} fill={color} />
)

/** Merge consecutive same-colour cells per row into one rect (fewer nodes, still crisp). */
function emitGrid(g: Grid): El[] {
  const out: El[] = []
  for (let r = 0; r < ROWS; r++) {
    let c = 0
    while (c < COLS) {
      const col = g[r][c]
      if (col == null) { c++; continue }
      let w = 1
      while (c + w < COLS && g[r][c + w] === col) w++
      out.push(rect(c, r, w, col, `g${r}-${c}`))
      c += w
    }
  }
  return out
}

/** Merge a loose set of cells (one colour) into per-row run rects. */
function rectsFromCells(cells: Cell[], color: string, keyP: string): El[] {
  const byRow = new Map<number, number[]>()
  for (const [c, r] of cells) {
    const list = byRow.get(r)
    if (list) list.push(c)
    else byRow.set(r, [c])
  }
  const out: El[] = []
  for (const [r, cols] of byRow) {
    cols.sort((a, b) => a - b)
    let start = cols[0]
    let prev = cols[0]
    for (let i = 1; i < cols.length; i++) {
      if (cols[i] === prev + 1) { prev = cols[i]; continue }
      out.push(rect(start, r, prev - start + 1, color, `${keyP}${r}-${start}`))
      start = cols[i]; prev = cols[i]
    }
    out.push(rect(start, r, prev - start + 1, color, `${keyP}${r}-${start}`))
  }
  return out
}

/** A bobbing pixel disc (sun / moon / planet / core). */
function bobDisc(rng: R, color: string, cc: number, cr: number, rad: number, key: string): El {
  return (
    <g key={key} className="cv-bob" style={delay(rng)}>
      {rectsFromCells(discCells(cc, cr, rad), color, key)}
    </g>
  )
}

/** Blinking single-cell specks scattered across the upper area. */
function specks(rng: R, p: Palette, n: number): El[] {
  return Array.from({ length: n }, (_, i) => {
    const c = Math.floor(rng() * COLS)
    const r = Math.floor(rng() * ROWS * 0.55)
    return (
      <rect
        key={`sp${i}`}
        className="cv-blink"
        style={delay(rng, 3)}
        x={c * CELL}
        y={r * CELL}
        width={CELL}
        height={CELL}
        fill={p.speck}
      />
    )
  })
}

/* ── Scene 1: stepped rolling hills + sun ── */
function sceneHills(rng: R, p: Palette, g: Grid): El[] {
  const left = rng() > 0.5
  for (let i = 0; i < 3; i++) {
    const base = ROWS * (0.5 + i * 0.15)
    const amp = 2 + rng() * 2.5
    const ph1 = rng() * 6.28
    const ph2 = rng() * 6.28
    const f1 = 1 + rng() * 1.5
    const f2 = 2 + rng() * 2
    for (let c = 0; c < COLS; c++) {
      const s = Math.round(
        base + Math.sin((c / COLS) * Math.PI * f1 + ph1) * amp + Math.sin((c / COLS) * Math.PI * f2 + ph2) * amp * 0.4,
      )
      for (let r = Math.max(0, s); r < ROWS; r++) g[r][c] = p.tones[i]
    }
  }
  return [
    ...specks(rng, p, 5),
    bobDisc(rng, p.accent, left ? COLS * 0.22 : COLS * 0.78, ROWS * 0.3, 4 + rng() * 2, 'sun'),
  ]
}

/* ── Scene 2: pixel mountain range + moon ── */
function sceneMountains(rng: R, p: Palette, g: Grid): El[] {
  const range = (count: number, floor: number, minTop: number, color: string) => {
    const peaks = Array.from({ length: count }, () => ({
      cx: rng() * COLS,
      top: minTop + rng() * 4,
      slope: 0.8 + rng() * 0.5,
    }))
    for (let c = 0; c < COLS; c++) {
      let s = floor
      for (const pk of peaks) {
        const y = pk.top + Math.abs(c - pk.cx) * pk.slope
        if (y < s) s = y
      }
      for (let r = Math.max(0, Math.round(s)); r < ROWS; r++) g[r][c] = color
    }
  }
  range(4, ROWS * 0.8, ROWS * 0.32, p.tones[0])
  range(4, ROWS * 0.94, ROWS * 0.5, p.tones[2])
  return [
    ...specks(rng, p, 8),
    bobDisc(rng, p.accent, COLS * (0.6 + rng() * 0.22), ROWS * 0.24, 3 + rng() * 1.5, 'moon'),
  ]
}

/* ── Scene 3: nested pixel arches ── */
function sceneArches(rng: R, p: Palette, g: Grid): El[] {
  const cc = COLS * (0.3 + rng() * 0.4)
  const cr = ROWS * (1.0 + rng() * 0.05)
  const cols = [p.tones[2], p.accent, p.tones[0], p.leaf, p.tones[1]]
  let rad = ROWS * (0.95 + rng() * 0.15)
  for (let i = 0; i < 5; i++) {
    paintDisc(g, cc, cr, rad, cols[i % cols.length], Math.ceil(cr))
    rad *= 0.72 - rng() * 0.05
  }
  return specks(rng, p, 4)
}

/* ── Scene 4: planet + pixel orbit ── */
function sceneOrbit(rng: R, p: Palette, g: Grid): El[] {
  const cc = COLS * (0.4 + rng() * 0.18)
  const cr = ROWS * (0.5 + (rng() * 2 - 1) * 0.06)
  const rx = COLS * (0.3 + rng() * 0.08)
  const ry = ROWS * (0.28 + rng() * 0.06)
  // Elliptical ring band.
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const dx = (c + 0.5 - cc) / rx
      const dy = (r + 0.5 - cr) / ry
      const e = dx * dx + dy * dy
      if (e > 0.82 && e < 1.18) g[r][c] = p.tones[0]
    }
  }
  // Moons sit on the ring.
  const moons = 2 + Math.floor(rng() * 2)
  for (let i = 0; i < moons; i++) {
    const a = (i / moons) * Math.PI * 2 + rng()
    const mc = Math.round(cc + Math.cos(a) * rx - 0.5)
    const mr = Math.round(cr + Math.sin(a) * ry - 0.5)
    const col = i === 0 ? p.accent : p.tones[2]
    for (let dr = 0; dr < 2; dr++) for (let dc = 0; dc < 2; dc++) {
      const rr = mr + dr
      const ccol = mc + dc
      if (rr >= 0 && rr < ROWS && ccol >= 0 && ccol < COLS) g[rr][ccol] = col
    }
  }
  paintDisc(g, cc, cr, COLS * 0.1 + rng() * 2, p.tones[1])
  return specks(rng, p, 7)
}

/* ── Scene 5: abstract pixel blobs (memphis) ── */
function sceneBlobs(rng: R, p: Palette, g: Grid): El[] {
  const cols = [p.tones[0], p.tones[1], p.tones[2], p.accent, p.leaf]
  const n = 6 + Math.floor(rng() * 3)
  const overlays: El[] = []
  for (let i = 0; i < n; i++) {
    const cc = rng() * COLS
    const cr = rng() * ROWS
    const size = 3 + rng() * 5
    const col = cols[Math.floor(rng() * cols.length)]
    const bob = rng() > 0.6
    if (rng() > 0.45) {
      // square block
      const x0 = Math.round(cc - size / 2)
      const y0 = Math.round(cr - size / 2)
      const s = Math.round(size)
      if (bob) {
        const cells: Cell[] = []
        for (let r = y0; r < y0 + s; r++) for (let c = x0; c < x0 + s; c++) if (r >= 0 && r < ROWS && c >= 0 && c < COLS) cells.push([c, r])
        overlays.push(<g key={`b${i}`} className="cv-bob" style={delay(rng, 5)}>{rectsFromCells(cells, col, `b${i}`)}</g>)
      } else {
        for (let r = y0; r < y0 + s; r++) for (let c = x0; c < x0 + s; c++) if (r >= 0 && r < ROWS && c >= 0 && c < COLS) g[r][c] = col
      }
    } else {
      // disc
      if (bob) overlays.push(bobDisc(rng, col, cc, cr, size / 2, `b${i}`))
      else paintDisc(g, cc, cr, size / 2, col)
    }
  }
  return [...specks(rng, p, 5), ...overlays]
}

/* ── Scene 6: growing pixel plant ── */
function scenePlant(rng: R, p: Palette, g: Grid): El[] {
  const groundRow = Math.round(ROWS * 0.82)
  for (let r = groundRow; r < ROWS; r++) for (let c = 0; c < COLS; c++) g[r][c] = p.tones[2]
  const stems = 3 + Math.floor(rng() * 2)
  for (let s = 0; s < stems; s++) {
    const baseC = Math.round(COLS * (0.22 + (s / Math.max(1, stems - 1)) * 0.56))
    const top = groundRow - Math.round(8 + rng() * 8)
    const bend = (rng() * 2 - 1) * 5
    let leafSide = rng() > 0.5
    for (let r = groundRow - 1; r >= top; r--) {
      const t = (groundRow - 1 - r) / Math.max(1, groundRow - 1 - top)
      const c = Math.round(baseC + bend * t * t)
      if (c >= 0 && c < COLS) g[r][c] = p.tones[1]
      // leaf blocks every few rows
      if ((groundRow - 1 - r) % 4 === 2) {
        const lc = c + (leafSide ? 1 : -2)
        for (let dr = 0; dr < 2; dr++) for (let dc = 0; dc < 2; dc++) {
          const rr = r + dr - 1
          const cc = lc + dc
          if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) g[rr][cc] = p.leaf
        }
        leafSide = !leafSide
      }
    }
  }
  return [
    ...specks(rng, p, 4),
    bobDisc(rng, p.accent, COLS * (0.74 + rng() * 0.14), ROWS * 0.24, 3 + rng() * 1.5, 'sun'),
  ]
}

/* ── Scene 7: pixel sunburst ── */
function sceneSunburst(rng: R, p: Palette, g: Grid): El[] {
  const cc = COLS * (0.32 + rng() * 0.36)
  const cr = ROWS * (0.4 + rng() * 0.22)
  const rays = 10 + Math.floor(rng() * 4)
  const len = COLS * 0.5
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2
    const col = i % 2 ? p.tones[0] : p.tones[1]
    const dx = Math.cos(a)
    const dy = Math.sin(a)
    for (let t = 4; t < len; t++) {
      const c = Math.round(cc + dx * t - 0.5)
      const r = Math.round(cr + dy * t - 0.5)
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) g[r][c] = col
    }
  }
  return [
    ...specks(rng, p, 6),
    bobDisc(rng, p.accent, cc, cr, 2.5 + rng() * 1.5, 'core'),
  ]
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
  const scene = SCENES[hashString(`${slug}|scene`) % SCENES.length]

  const grid = makeGrid(p)
  const overlays = scene(rng, p, grid)

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {emitGrid(grid)}
      {overlays}
    </svg>
  )
}
