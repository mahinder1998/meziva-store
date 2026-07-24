// Review storage — used by the "Write a Review" form's API route
// (app/api/reviews/route.js). Reads for display on the PDP happen through
// getProductBySlug() in data/products.js, which joins this same table —
// both seed reviews and user-submitted ones live together here now, so
// there's no separate "merge static + user reviews" step needed anymore.
import { query, toMySQLDatetime } from "@/lib/db";

export async function getReviewsForProduct(slug) {
  const rows = await query(
    "SELECT * FROM reviews WHERE product_slug = ? ORDER BY date DESC",
    [slug]
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    date: r.date,
    verified: !!r.verified,
  }));
}

export async function addReview(review) {
  await query(
    `INSERT INTO reviews (id, product_slug, name, rating, title, comment, date, verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      review.id,
      review.productSlug,
      review.name,
      review.rating,
      review.title,
      review.comment,
      toMySQLDatetime(review.date),
      review.verified,
    ]
  );
  return review;
}
