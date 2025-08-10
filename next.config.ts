import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Ensures static export for GitHub Pages
  basePath: "/prompt-flow",
  assetPrefix: "/prompt-flow/",
  images: {
    unoptimized: true, // Needed because GitHub Pages doesn't support Next.js Image Optimization
  },
};

export default nextConfig;
