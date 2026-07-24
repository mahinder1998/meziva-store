// Run this ONCE after creating the database tables (db/schema.sql), to
// populate the catalog with the products/reviews that used to live in
// data/products.js. Safe to re-run — it upserts (won't create duplicates).
//
// Usage: node scripts/seed.js
// (make sure .env.local has DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME set)

require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

const collections = [
  {
    slug: "lip-care",
    name: "Lip Care",
    description: "Hydrating, SPF-protected lip balms made with real fruit extracts.",
    image: "/images/cherry-blast-main.jpg",
  },
];

const products = [
  {
    id: "p1",
    slug: "cherry-blast-lip-balm",
    name: "Cherry Blast Hydrating Lip Balm",
    collection: "lip-care",
    price: 199,
    compareAtPrice: 399,
    description:
      "Meziva's Cherry Blast Hydrating Lip Balm is a deeply nourishing everyday balm built around real cherry extract, Mango Butter, and Vitamin E. It melts into lips instantly, sealing in moisture while a built-in SPF 30 shields against sun damage and pigmentation. With regular use, lips feel visibly smoother, look naturally plump, and carry a soft rosy-red tint that needs no extra lipstick.",
    howToUse:
      "Start with clean, dry lips. Swipe the balm evenly across both lips in a single smooth stroke. Reapply whenever lips feel dry, before sun exposure, or after eating/drinking. For best results, use morning and night.",
    additionalInfo: {
      "Key Ingredients": "Mango Butter, Vitamin E, Cherry Extract",
      SPF: "SPF 30 (Sun Protection)",
      "Net Weight": "4.5 g",
      Finish: "Natural rosy tint, glossy",
      "Skin Type": "All skin types",
      Fragrance: "Cherry",
    },
    images: [
      "/images/cherry-blast-main.jpg",
      "/images/cherry-after-before-image.jpg",
      "/images/cherry-how-to-use.jpg",
      "/images/cherry-nourishment.jpg",
      "/images/cherry-why-love-it2.jpg",
    ],
    sizes: ["4.5g"],
    stock: 50,
    rating: 4.7,
    metaContentId: "2dunvaol6k",
    reviews: [
      { name: "Kavya R.", rating: 5, title: "My lips have never felt this soft", comment: "I've tried at least 6 different lip balms this year for constant dryness during AC season. This is the first one where I actually see a difference by day 3 — no more flaking, and the cherry tint looks natural, not fake.", date: "2026-07-08", verified: true },
      { name: "Rohan T.", rating: 4, title: "Good balm, wish the tube was slightly bigger", comment: "Texture and hydration are genuinely excellent, glides on smooth without being sticky. Only complaint is 4.5g finishes faster than I'd like since I reapply often being outdoors a lot.", date: "2026-06-29", verified: true },
      { name: "Simran K.", rating: 5, title: "SPF in a lip balm actually works", comment: "Was skeptical about the SPF 30 claim on something this small, but my lips haven't darkened even after a beach trip where I reapplied every couple hours. Smells like actual cherries, not artificial.", date: "2026-06-14", verified: true },
      { name: "Aman D.", rating: 4, title: "Great for cracked winter lips", comment: "Bought this for my badly chapped lips after a cold — took about a week of twice-daily use to fully heal, but the improvement was noticeable from day one itself. Slight cherry taste which I don't mind.", date: "2026-05-30", verified: false },
      { name: "Priyanka M.", rating: 5, title: "Repurchased already", comment: "Finished my first tube in about 6 weeks of daily use and ordered two more immediately. The mango butter really does make it feel richer than typical drugstore balms.", date: "2026-05-19", verified: true },
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
      SPF: "SPF 30 (Sun Protection)",
      "Net Weight": "4.5 g",
      Finish: "Natural pinkish tint, glossy",
      "Skin Type": "All skin types",
      Fragrance: "Mixed Berry",
    },
    images: [
      "/images/berry-blast-main.jpg",
      "/images/what-make-it-special.jpg",
      "/images/berry-after-before-image.jpg",
      "/images/how-to-use.jpg",
      "/images/nourishment.jpg",
    ],
    sizes: ["4.5g"],
    stock: 50,
    rating: 4.6,
    metaContentId: "vs60y3tgrq",
    reviews: [
      { name: "Neha S.", rating: 5, title: "The ceramide + shea combo is no joke", comment: "My lips get super dry from wearing matte lipstick daily, and this balm at night has genuinely repaired the texture. Woke up with soft lips for the first time in months. Berry smell is subtle, not overpowering.", date: "2026-07-11", verified: true },
      { name: "Vikram J.", rating: 5, title: "Better than the cherry one for me", comment: "Tried both variants — this one feels slightly more moisturizing, probably the shea butter. The pinkish tint is very natural, my colleagues thought I was wearing a nude lipstick.", date: "2026-06-25", verified: true },
      { name: "Divya P.", rating: 4, title: "Solid daily balm", comment: "Does exactly what it promises — hydrates well and the SPF gives peace of mind during my commute. Only wish it came in a bigger size since I keep one in my bag and one at my desk.", date: "2026-06-10", verified: false },
      { name: "Arjun B.", rating: 5, title: "Fixed my peeling lips in under a week", comment: "Had really bad peeling from sun exposure during a trek. Applied this morning and night for about 5 days and the peeling completely stopped. Jojoba oil in the ingredients probably helps with that.", date: "2026-05-28", verified: true },
      { name: "Ritika A.", rating: 4, title: "Nice tint, decent hydration", comment: "The berry tint is genuinely pretty and works well under gloss too. Hydration is good but I still need a slightly heavier night balm in peak winter — for everyday use though, this is great.", date: "2026-05-12", verified: true },
    ],
  },
];

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log("Connected. Seeding collections...");
  for (const c of collections) {
    await conn.execute(
      `INSERT INTO collections (slug, name, description, image) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), image=VALUES(image)`,
      [c.slug, c.name, c.description, c.image]
    );
  }

  console.log("Seeding products + reviews...");
  for (const p of products) {
    await conn.execute(
      `INSERT INTO products
        (id, slug, name, collection_slug, price, compare_at_price, description, how_to_use,
         additional_info, images, sizes, stock, rating, meta_content_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name=VALUES(name), collection_slug=VALUES(collection_slug), price=VALUES(price),
         compare_at_price=VALUES(compare_at_price), description=VALUES(description),
         how_to_use=VALUES(how_to_use), additional_info=VALUES(additional_info),
         images=VALUES(images), sizes=VALUES(sizes), stock=VALUES(stock),
         rating=VALUES(rating), meta_content_id=VALUES(meta_content_id)`,
      [
        p.id,
        p.slug,
        p.name,
        p.collection,
        p.price,
        p.compareAtPrice ?? null,
        p.description,
        p.howToUse,
        JSON.stringify(p.additionalInfo || {}),
        JSON.stringify(p.images || []),
        JSON.stringify(p.sizes || []),
        p.stock,
        p.rating,
        p.metaContentId || null,
      ]
    );

    for (const r of p.reviews) {
      const id = `${p.slug}-${r.name}-${r.date}`.replace(/\s+/g, "-").toLowerCase();
      await conn.execute(
        `INSERT INTO reviews (id, product_slug, name, rating, title, comment, date, verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           rating=VALUES(rating), title=VALUES(title), comment=VALUES(comment), verified=VALUES(verified)`,
        [id, p.slug, r.name, r.rating, r.title, r.comment, r.date, r.verified]
      );
    }
  }

  console.log("Done. Seeded", products.length, "products and", collections.length, "collection(s).");
  await conn.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
