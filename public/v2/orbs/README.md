# Mindset orbs

Referenced by `app/v2/components/Mindset.tsx`. Each orb is a
decorative corner element on the white mindset band — no text
labels, just visual anchors around the centered headline.

## Filenames

- `orb-blue-rocket.svg`   → top-left (blue orb with rocket silhouette)
- `orb-green-star.svg`    → top-right (green orb with star)
- `orb-red-heart.svg`     → bottom-left (red orb with heart, has sparkle dust)
- `orb-orange-pickaxe.svg`→ bottom-right (orange gem with pickaxe/arrow)

## Format

SVG preferred — pixel-art with flat fills on an integer grid stays
crisp at any size. PNG fallback works too; if you swap to PNG just
change the extensions in `Mindset.tsx` (single `replace_all`).

## Positioning

Positions are defined in `app/v2/fonts.css` under `.v2-mindset-orb--tl/tr/bl/br`.
Sizes scale with viewport via `clamp()`. If the Framer comp shifts an orb,
tweak `top`/`right`/`bottom`/`left` there — the component itself just
assigns a class per orb.
