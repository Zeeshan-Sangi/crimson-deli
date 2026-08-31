import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a production build run into its own folder while `next dev` keeps
  // using .next — building into a live dev server's directory corrupts its
  // module cache. Usage: NEXT_DIST_DIR=.next-build npm run build
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // firebase-admin must run as a native Node dependency on Vercel (not bundled).
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
