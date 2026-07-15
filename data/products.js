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
    slug: "aurum-chronograph",
    name: "Aurum Chronograph",
    collection: "watches",
    price: 245000,
    compareAtPrice: 275000,
    description:
      "The Aurum Chronograph is hand-assembled from 316L surgical steel with an 18k gold-plated bezel. A sapphire crystal face resists scratching for a lifetime of wear.",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1200&q=80",
      "https://images.unsplash.com/photo-1518131672697-613becd4ab77?w=1200&q=80",
    ],
    sizes: ["38mm", "42mm"],
    stock: 12,
    rating: 4.8,
  },
  {
    id: "p2",
    slug: "midnight-diver",
    name: "Midnight Diver",
    collection: "watches",
    price: 189000,
    compareAtPrice: null,
    description:
      "Water resistant to 300m, the Midnight Diver pairs a matte ceramic case with a unidirectional rotating bezel built for real use, not just looks.",
    images: [
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=1200&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=1200&q=80",
    ],
    sizes: ["40mm", "44mm"],
    stock: 8,
    rating: 4.6,
  },
  {
    id: "p3",
    slug: "atelier-tote",
    name: "Atelier Tote",
    collection: "bags",
    price: 98000,
    compareAtPrice: 112000,
    description:
      "Cut from a single hide of Tuscan leather and finished by hand, the Atelier Tote develops a rich patina that is entirely its own with every wear.",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=80",
    ],
    sizes: ["One Size"],
    stock: 20,
    rating: 4.9,
  },
  {
    id: "p4",
    slug: "voyage-weekender",
    name: "Voyage Weekender",
    collection: "bags",
    price: 132000,
    compareAtPrice: null,
    description:
      "A weekend bag built for real travel — reinforced brass hardware, a removable shoulder strap, and enough room for a two-night stay.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80",
    ],
    sizes: ["One Size"],
    stock: 15,
    rating: 4.7,
  },
  {
    id: "p5",
    slug: "noir-de-nuit",
    name: "Noir de Nuit",
    collection: "fragrance",
    price: 24500,
    compareAtPrice: 28000,
    description:
      "An intense eau de parfum built around oud, black pepper, and amber. Composed in Grasse, bottled in weighted glass with a brushed metal cap.",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80",
    ],
    sizes: ["50ml", "100ml"],
    stock: 30,
    rating: 4.5,
  },
  {
    id: "p6",
    slug: "santal-reserve",
    name: "Santal Reserve",
    collection: "fragrance",
    price: 26500,
    compareAtPrice: null,
    description:
      "Sandalwood, cedar, and a whisper of vanilla — a warm, low-key scent that reads as unmistakably expensive without shouting about it.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&q=80",
    ],
    sizes: ["50ml", "100ml"],
    stock: 18,
    rating: 4.4,
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
