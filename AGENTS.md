# DevPet landing — agent instructions

This folder is a Next.js landing page for DevPet / Codepet, centered on retro 8-bit pixel-art characters and UI. Most recent work has been building out the sprite library in `sprites-svg/ui/` and wiring sprites into the preview HTML files at the project root.

## Stack note
This version of Next.js has breaking changes — APIs, conventions, and file structure may differ from training-data defaults. When touching anything under `app/`, `components/`, or `next.config.ts`, consult `node_modules/next/dist/docs/` before writing code and heed deprecation notices.

## Pixel-art sprite conventions

All sprites live in `sprites-svg/ui/` and follow the same format so they can be dropped into HTML without friction.

- **Grid unit.** 1 pixel = 16 CSS units. Every `<rect>` is `width="16" height="16"` and aligned to a 16-unit grid. The SVG `viewBox` is `W*16` × `H*16` where W and H are the sprite's pixel dimensions.
- **Crisp rendering.** Root `<svg>` must include `shape-rendering="crispEdges"`.
- **Transparent background.** Never fill the viewBox — empty cells are omitted entirely. Only draw the sprite pixels.
- **No antialiasing or gradients.** Every pixel is a single flat fill. No strokes, no filters.
- **Palette encoding.** Sprites are authored as a 2-D grid of single-character codes, then emitted as flat `<rect>` elements. Keep the palette compact and document it at the top of each generator. Common codes across the library:
  - `K` = black outline (or dark maroon for warm-palette sprites)
  - `W` = white
  - `.` = transparent (not drawn)
  - Warm: `R` red, `O` orange, `Y` yellow, `c` cream, `o` darker orange
  - Cool: `B` blue, `b` dark blue, `G` green, `g` dark green, `l` light highlight
  - Purple: `P` purple, `p` dark purple
  - Grey body: `N` light grey, `n` dark grey
  Feel free to introduce new single-char codes per sprite, but don't reuse a code for two colors in the same file.

## Generator pattern

Long sprites are generated with a small Node.js script rather than hand-written SVG. The established pattern, used across `button-*.svg`, `flame.svg`, `gamepad.svg`, `star.svg`, `gbc-pink.svg`, and `word-play.svg`:

1. Define `W`, `H`, and `CELL = 16` constants.
2. Define a `COLORS` map from single-char code → hex.
3. Build a `ROWS` array of `W`-wide strings, or build a grid programmatically.
4. **Validate uniform width.** `ROWS.forEach((r,i) => { if (r.length !== W) throw new Error(...) })`. Catching a width typo early beats debugging a shifted sprite.
5. Emit the SVG by iterating `(x, y)` and writing `<rect x="{x*CELL}" y="{y*CELL}" width="16" height="16" fill="{COLORS[ch]}"/>` for every non-`.` cell.
6. Write the file to `sprites-svg/ui/<name>.svg`.
7. Log the grid after generation so the design is reviewable from the terminal output.

Scratch generators can live in `/tmp/` (they don't need to be committed). If a generator is worth keeping, put it under `scripts/` with a matching name.

## Button pill shape

The `button-levelup` / `button-start` / `button-victory` sprites share a 49×14 rounded-pill silhouette with stepped `r=4` corners. When making a new button in this style:
- Outline rows 0 and 13 are solid `K` with 4 cells of padding on each side.
- Rows 1 and 12 are full-width highlight (`l`) and shadow (`g`) bands respectively.
- Rows 2–3 and 10–11 have stepped corners with `l` / `g` inside the `K` border.
- Rows 4–9 are the text area (5 rows tall with `l` / `g` tick marks at col 1 and W−2 on the transition rows).
- Letters are rendered from a small FONT map of 3-wide × 5-tall (or 4–5-wide for thicker glyphs) `W`/`.` strings, centered horizontally.
- To recolor for a new button, swap the main/shadow/highlight hex values and keep the structure intact.

## Image references

When the user provides a reference image and asks for a redraw:
- Match the silhouette, palette count, and key features (e.g. a detached spark, an inner highlight band).
- Exact pixel-perfect reproduction is rarely needed — aim for the same read at a glance.
- Never reproduce copyrighted or trademarked characters (Mario, Pokémon, etc.). If a reference is clearly a licensed character, offer to design an original in a similar style instead.

## File delivery

After creating or updating an SVG, respond with a single `computer://` link to the file plus a one-sentence description of what was made. Do not paste the SVG markup into chat.

## HTML previews

Preview HTMLs at the project root (`devpet-*.html`) reference sprites via `<img src="sprites-svg/ui/...">`. When adding a new sprite, check whether any of the preview pages should surface it. When renaming or moving a sprite, grep the preview files and update references.

## User context
- Email: nguyen@murror.app
- Today: 2026-04-21
