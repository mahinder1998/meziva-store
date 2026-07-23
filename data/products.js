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
  reviews: [
    {
      name: "Kavya R.",
      rating: 5,
      title: "My lips have never felt this soft",
      comment:
        "I've tried at least 6 different lip balms this year for constant dryness during AC season. This is the first one where I actually see a difference by day 3 — no more flaking, and the cherry tint looks natural, not fake.",
      date: "2026-07-08",
      verified: true,
    },
    {
      name: "Rohan T.",
      rating: 4,
      title: "Good balm, wish the tube was slightly bigger",
      comment:
        "Texture and hydration are genuinely excellent, glides on smooth without being sticky. Only complaint is 4.5g finishes faster than I'd like since I reapply often being outdoors a lot.",
      date: "2026-06-29",
      verified: true,
    },
    {
      name: "Simran K.",
      rating: 5,
      title: "SPF in a lip balm actually works",
      comment:
        "Was skeptical about the SPF 30 claim on something this small, but my lips haven't darkened even after a beach trip where I reapplied every couple hours. Smells like actual cherries, not artificial.",
      date: "2026-06-14",
      verified: true,
    },
    {
      name: "Aman D.",
      rating: 4,
      title: "Great for cracked winter lips",
      comment:
        "Bought this for my badly chapped lips after a cold — took about a week of twice-daily use to fully heal, but the improvement was noticeable from day one itself. Slight cherry taste which I don't mind.",
      date: "2026-05-30",
      verified: false,
    },
    {
      name: "Priyanka M.",
      rating: 5,
      title: "Repurchased already",
      comment:
        "Finished my first tube in about 6 weeks of daily use and ordered two more immediately. The mango butter really does make it feel richer than typical drugstore balms.",
      date: "2026-05-19",
      verified: true,
    },
  ],
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
    reviews: [
      {
        name: "Neha S.",
        rating: 5,
        title: "The ceramide + shea combo is no joke",
        comment:
          "My lips get super dry from wearing matte lipstick daily, and this balm at night has genuinely repaired the texture. Woke up with soft lips for the first time in months. Berry smell is subtle, not overpowering.",
        date: "2026-07-11",
        verified: true,
      },
      {
        name: "Vikram J.",
        rating: 5,
        title: "Better than the cherry one for me",
        comment:
          "Tried both variants — this one feels slightly more moisturizing, probably the shea butter. The pinkish tint is very natural, my colleagues thought I was wearing a nude lipstick.",
        date: "2026-06-25",
        verified: true,
      },
      {
        name: "Divya P.",
        rating: 4,
        title: "Solid daily balm",
        comment:
          "Does exactly what it promises — hydrates well and the SPF gives peace of mind during my commute. Only wish it came in a bigger size since I keep one in my bag and one at my desk.",
        date: "2026-06-10",
        verified: false,
      },
      {
        name: "Arjun B.",
        rating: 5,
        title: "Fixed my peeling lips in under a week",
        comment:
          "Had really bad peeling from sun exposure during a trek. Applied this morning and night for about 5 days and the peeling completely stopped. Jojoba oil in the ingredients probably helps with that.",
        date: "2026-05-28",
        verified: true,
      },
      {
        name: "Ritika A.",
        rating: 4,
        title: "Nice tint, decent hydration",
        comment:
          "The berry tint is genuinely pretty and works well under gloss too. Hydration is good but I still need a slightly heavier night balm in peak winter — for everyday use though, this is great.",
        date: "2026-05-12",
        verified: true,
      },
    ],
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