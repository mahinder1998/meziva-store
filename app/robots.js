export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meziva.in";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/checkout", "/cart", "/order-success"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
