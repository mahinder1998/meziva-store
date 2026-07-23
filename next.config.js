/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
    // IMPORTANT: Next.js's on-demand image optimizer (the /_next/image route)
    // needs a properly working `sharp` install and enough CPU/memory to
    // resize+reformat images per request. On managed/shared Node hosting
    // (like this one), that route can intermittently time out or fail under
    // load — which is exactly the "images load sometimes, sometimes not"
    // symptom. Since our local images in /public/images are already resized
    // and compressed (see README notes), we don't need on-the-fly
    // optimization — serving them as static files is 100% reliable (no
    // per-request processing, and Hostinger's CDN caches them properly).
    unoptimized: true,
  },
};

module.exports = nextConfig;