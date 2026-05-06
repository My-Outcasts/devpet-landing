import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // output: "export", — removed to enable API routes on Vercel
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  // Hide the Next.js dev-mode on-screen indicator (the little "N"
  // badge in the bottom-left of every page during `next dev`).
  // Purely a DX preference — Next still surfaces build and runtime
  // errors via the overlay; only the route-status badge is removed.
  devIndicators: false,
  // Canonical landing URL is `/` — the V2 landing is re-exported
  // from `app/page.tsx`. We canonicalize `/v2` → `/` so the base
  // domain never includes `/v2` and any old inbound links land on
  // the canonical URL. `permanent: false` (307) keeps it reversible
  // without search engines caching it as a 301.
  async redirects() {
    return [
      {
        source: '/v2',
        destination: '/',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
