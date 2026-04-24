# Fonts for /v2 landing

Drop font files into these subfolders. File names must match exactly (case-sensitive) — the @font-face rules in `app/v2/fonts.css` reference them by name.

## PP Neue Montreal (Pangram Pangram, licensed)
Path: `public/fonts/pp-neue-montreal/`

Required files (prefer `.woff2`, `.woff` or `.otf` also work — update fonts.css if extension changes):

- `PPNeueMontreal-Medium.woff2`       — weight 500, style normal
- `PPNeueMontreal-Bold.woff2`         — weight 700, style normal
- `PPNeueMontreal-BoldItalic.woff2`   — weight 700, style italic
- `PPNeueMontreal-Book.woff2`         — weight 400, style normal (optional, nice to have)

## Minecraft (pixel font used in nav + stat numbers)
Path: `public/fonts/minecraft/`

Required files:

- `Minecraft-Regular.woff2`  — weight 400, style normal
- `Minecraft-Bold.woff2`     — weight 700, style normal (optional)

## After uploading
No build step needed — Next.js serves `/public/fonts/*` statically. Reload `/v2` and the real fonts should apply. Until files are present, `fonts.css` falls back to system sans + monospace.
