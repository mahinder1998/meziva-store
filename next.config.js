/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
    // AVIF/WebP are 30-50% smaller than JPEG at the same visual quality —
    // Next.js automatically serves whichever the visitor's browser supports.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // cache optimized images for a year
  },
};

module.exports = nextConfig;
