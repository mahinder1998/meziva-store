import { getAllProducts, getAllCollections } from "@/data/products";

// Next.js automatically serves whatever this function returns at
// https://meziva.in/sitemap.xml — no separate XML file to maintain by hand.
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://meziva.in";

  const products = await getAllProducts();
  const collections = await getAllCollections();

  const staticRoutes = ["", "/privacy-policy", "/shipping-policy", "/refund-policy", "/contact-us"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "monthly",
      priority: route === "" ? 1 : 0.5,
    })
  );

  const collectionRoutes = collections.map((c) => ({
    url: `${baseUrl}/collection/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
