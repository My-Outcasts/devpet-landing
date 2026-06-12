# Blog cover images — hybrid workflow

Each post's cover is **either** a hand-picked AI-generated pixel-art image
**or** the procedural generator (`app/blog/_components/CoverArt.tsx`) as an
automatic fallback. You never have to make an image for every post — only
the ones you want to upgrade.

> This file is documentation only. The post loader ignores it (it loads
> just `<slug>.en.md` / `<slug>.vi.md`), so it will never appear as a post.

## How the override works

`PostCard`, `FeaturedCard`, and `ArticleView` all do the same thing:

```tsx
{post.cover ? <img src={post.cover} … /> : <CoverArt slug={…} category={…} />}
```

So a post shows your image the moment it has a `cover:` in frontmatter,
and falls back to the generated pixel-art landscape otherwise.

## Add a curated cover to a post

1. **Generate** a 16:9 pixel-art landscape (see prompts below).
2. **Save** it to `public/blog/<slug>/cover.png`
   (root-relative `/blog/...` is served from `public/`).
   Use the **same image for both locales** — covers have no text.
3. **Add** to the frontmatter of *both* `<slug>.en.md` and `<slug>.vi.md`:

   ```yaml
   cover: "/blog/<slug>/cover.png"
   coverAlt: "Pixel-art landscape: lavender mountains over a flower meadow"
   ```

That's it. To revert to the generated art, delete the two lines.

## Image specs

- **Aspect ratio:** 16:9. **Size:** 1280×720 (also fine for social/OG).
- **Format:** PNG.
- **Cropping:** the listing crops to ~4:3 and the hero/featured to 16:9 via
  `object-fit: cover`, so keep the subject roughly centered and avoid
  important detail in the far corners.
- **Crispness:** generate at 1280×720 (or a tidy pixel resolution upscaled
  cleanly). If a delivered image looks soft when displayed, ping me and I'll
  add a nearest-neighbour downscale step so the pixel grid stays sharp.

## Generation prompts (on-brand: Codepet pastel palette)

Base style to keep in every prompt:

> 16-bit pixel art landscape, soft pastel palette — lavender purple, blush
> pink, sky blue, cream — clean ordered dithering, crisp pixels, calm and
> elegant, no text, no characters, no people, no watermark, 16:9.

Per category (matches the procedural palettes):

- **building-ai-products** (purple): *"…distant snow-capped lavender
  mountains at dusk, layered pine forest, a quiet meadow, warm pink-and-gold
  sky."*
- **user-insights** (blue): *"…bright pastel day, blue sky with soft pink
  clouds, hazy blue mountains, rolling green hills, a winding path."*
- **second-brain** (pink): *"…rosy meadow full of pink and purple wildflowers,
  bushy round trees, gentle hills, dreamy pink clouds."*

A pixel-art-tuned generator (e.g. Retro Diffusion) gives the cleanest result;
Midjourney / gpt-image / Imagen also work with the base style above. Generate
a few and pick the calmest, most readable one (covers sit behind a headline).
