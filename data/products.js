// This file simulates a database. In production, replace the functions
// below with real DB/CMS calls (e.g. Postgres, MongoDB, Sanity, Shopify, etc.)
// Every page in this app reads through these functions, NOT the array directly —
// so swapping the data source later only means editing this one file.

export const collections = [
  {
    slug: "watches",
    name: "Timepieces",
    description: "Precision-crafted watches for the discerning collector.",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=80",
  },
  {
    slug: "bags",
    name: "Leather Goods",
    description: "Hand-stitched bags made from full-grain leather.",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80",
  },
  {
    slug: "fragrance",
    name: "Fragrance",
    description: "Signature scents, composed in small batches.",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
  },
];

const productList = [
  {
  id: "p1",
  slug: "cherry-blast-lip-balm",
  name: "Cherry Blast Hydrating Lip Balm",
  collection: "lip-care", // apna collection slug daal do
  price: 199, // apna actual price daalo
  compareAtPrice: 399,
  description:
    "Meziva's Cherry Blast Hydrating Lip Balm is a deeply nourishing everyday balm built around real cherry extract, Mango Butter, and Vitamin E. It melts into lips instantly, sealing in moisture while a built-in SPF 30 shields against sun damage and pigmentation. With regular use, lips feel visibly smoother, look naturally plump, and carry a soft rosy-red tint that needs no extra lipstick.",
  howToUse:
    "Start with clean, dry lips. Swipe the balm evenly across both lips in a single smooth stroke. Reapply whenever lips feel dry, before sun exposure, or after eating/drinking. For best results, use morning and night.",
  additionalInfo: {
    "Key Ingredients": "Mango Butter, Vitamin E, Cherry Extract",
    "SPF": "SPF 30 (Sun Protection)",
    "Net Weight": "4.5 g",
    "Finish": "Natural rosy tint, glossy",
    "Skin Type": "All skin types",
    "Fragrance": "Cherry",
  },
  images: ["/images/cherry-after-before-image.jpg",
  "/images/cherry-how-to-use.jpg",
  "/images/cherry-nourishment.jpg",
  "/images/cherry-why-love-it2.jpg"


  ], // apni image ka actual path daalo
  sizes: ["4.5g"],
  stock: 50,
  rating: 4.7,
  reviews: [],
  },
  {
    id: "p2",
    slug: "berry-blast-lip-balm",
    name: "Berry Blast Hydrating Lip Balm",
    collection: "lip-care",
    price: 199,
    compareAtPrice: 399,
    description:
      "Meziva's Berry Blast Hydrating Lip Balm combines the richness of Shea Butter with the repairing power of Ceramide and Jojoba Oil, rounded off with a juicy mixed-berry finish. Vitamin E fights daily damage while SPF 30 protects against sun-induced darkening. The result: soft, plump, naturally radiant lips with a subtle pinkish flush.",
    howToUse:
      "Apply to clean, dry lips. Swipe evenly over both lips in one smooth motion. Reapply as needed throughout the day, especially before stepping out in the sun or after meals. Safe for daily, twice-a-day use.",
    additionalInfo: {
      "Key Ingredients": "Shea Butter, Vitamin E, Ceramide, Jojoba Oil, Berry Extract",
      "SPF": "SPF 30 (Sun Protection)",
      "Net Weight": "4.5 g",
      "Finish": "Natural pinkish tint, glossy",
      "Skin Type": "All skin types",
      "Fragrance": "Mixed Berry",
    },
    images: ["/images/what-make-it-special.jpg",
"/images/berry-after-before-image.jpg",
"/images/how-to-use.jpg",
"/images/nourishment.jpg"

    ],
    sizes: ["4.5g"],
    stock: 50,
    rating: 4.6,
    reviews: [],
  },
];

// ---- "API" functions the rest of the app should use ----

export async function getAllProducts() {
  return productList;
}

export async function getFeaturedProducts(limit = 4) {
  return productList.slice(0, limit);
}

export async function getProductBySlug(slug) {
  return productList.find((p) => p.slug === slug) || null;
}

export async function getProductsByCollection(collectionSlug) {
  return productList.filter((p) => p.collection === collectionSlug);
}

// Returns up to `limit` other products from the same collection as `product`,
// falling back to top-rated products overall if the collection is too small.
export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];

  const sameCollection = productList.filter(
    (p) => p.collection === product.collection && p.id !== product.id
  );

  if (sameCollection.length >= limit) {
    return sameCollection.slice(0, limit);
  }

  // Top up with other highly-rated products if the collection is small
  const fallback = productList
    .filter((p) => p.id !== product.id && p.collection !== product.collection)
    .sort((a, b) => b.rating - a.rating);

  return [...sameCollection, ...fallback].slice(0, limit);
}

export async function getCollectionBySlug(slug) {
  return collections.find((c) => c.slug === slug) || null;
}

export async function getAllCollections() {
  return collections;
}

export function formatPrice(paise) {
  // prices stored in whole rupees here for simplicity
  return "₹" + Number(paise).toLocaleString("en-IN");
}
