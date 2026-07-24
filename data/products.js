// Product/collection data now lives in MySQL — see db/schema.sql for the
// table structure and scripts/seed.js for the one-time initial data load.
//
// Every page in this app reads through the functions below, NOT the
// database directly, so swapping the data source again later (e.g. to a
// headless CMS) only means editing this one file.
import { query } from "@/lib/db";

function mapProductRow(row, reviews = []) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    collection: row.collection_slug,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    description: row.description,
    howToUse: row.how_to_use,
    // mysql2 auto-parses JSON columns into JS objects/arrays already.
    additionalInfo: row.additional_info || {},
    images: row.images || [],
    sizes: row.sizes || [],
    stock: row.stock,
    rating: Number(row.rating),
    metaContentId: row.meta_content_id,
    reviews,
  };
}

function mapReviewRow(row) {
  return {
    id: row.id,
    name: row.name,
    rating: row.rating,
    title: row.title,
    comment: row.comment,
    date: row.date,
    verified: !!row.verified,
  };
}

export async function getAllProducts() {
  const rows = await query("SELECT * FROM products ORDER BY created_at ASC");
  return rows.map((r) => mapProductRow(r));
}

export async function getFeaturedProducts(limit = 4) {
  const all = await getAllProducts();
  return all.slice(0, limit);
}

export async function getProductBySlug(slug) {
  const rows = await query("SELECT * FROM products WHERE slug = ?", [slug]);
  if (!rows[0]) return null;

  const reviewRows = await query(
    "SELECT * FROM reviews WHERE product_slug = ? ORDER BY date DESC",
    [slug]
  );

  return mapProductRow(rows[0], reviewRows.map(mapReviewRow));
}

export async function getProductsByCollection(collectionSlug) {
  const rows = await query(
    "SELECT * FROM products WHERE collection_slug = ?",
    [collectionSlug]
  );
  return rows.map((r) => mapProductRow(r));
}

// Returns up to `limit` other products from the same collection as `product`,
// falling back to top-rated products overall if the collection is too small.
export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];

  const sameCollection = await query(
    "SELECT * FROM products WHERE collection_slug = ? AND id != ? LIMIT ?",
    [product.collection, product.id, limit]
  );

  if (sameCollection.length >= limit) {
    return sameCollection.slice(0, limit).map((r) => mapProductRow(r));
  }

  const remaining = limit - sameCollection.length;
  const fallback = await query(
    "SELECT * FROM products WHERE id != ? AND collection_slug != ? ORDER BY rating DESC LIMIT ?",
    [product.id, product.collection, remaining]
  );

  return [...sameCollection, ...fallback].map((r) => mapProductRow(r));
}

export async function getCollectionBySlug(slug) {
  const rows = await query(
    "SELECT slug, name, description, image FROM collections WHERE slug = ?",
    [slug]
  );
  return rows[0] || null;
}

export async function getAllCollections() {
  return query("SELECT slug, name, description, image FROM collections");
}

export function formatPrice(paise) {
  // prices stored in whole rupees here for simplicity
  return "₹" + Number(paise).toLocaleString("en-IN");
}
