import type { NextConfig } from "next";

// All template imagery is served from public/assets, so no remote patterns are
// needed. Add them back here if images ever come from an external host.
//
// NEXT_DIST_DIR lets a verification build write somewhere other than .next, so
// running `next build` never corrupts a dev server's .next while it is running.
const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async redirects() {
    return [
      { source: "/shop-list", destination: "/shop", permanent: true },
      { source: "/shop-list-sidebar", destination: "/shop", permanent: true },
      { source: "/shop-grid-sidebar", destination: "/shop", permanent: true },
      { source: "/wishlist", destination: "/shop-cart", permanent: true },
      { source: "/team", destination: "/about", permanent: true },
      { source: "/team-details", destination: "/about", permanent: true },
      { source: "/testimonial", destination: "/", permanent: true },
      { source: "/history", destination: "/about", permanent: true },
      { source: "/gallery", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
