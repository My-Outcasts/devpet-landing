# Hero pet sprites

Referenced by `app/v2/components/Hero.tsx`. Left-to-right order matches
the Framer hero row:

- `1-pink-bear.svg`
- `2-green-owl.svg`
- `3-orange-fox.svg`
- `4-purple-byte.svg`
- `5-yellow-bear.svg`
- `6-red-bear.svg`
- `7-blue-penguin.svg`

## Format

SVG pixel art — each `<path>` is a single flat-fill square on a 16-unit
grid, exported from Figma. No gradients, no strokes, no antialiasing.
They render crisp at any size because the math is integer-aligned.

The CSS in `app/v2/fonts.css` still sets `image-rendering: pixelated`
on `.v2-hero-pet`, which is redundant for SVG (vector already renders
sharply) but harmless — keeps PNG fallback behavior consistent if any
sprite is swapped back to raster in the future.
