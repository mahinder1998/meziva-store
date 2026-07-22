// Minimal file-based review store for demo purposes only — same caveat as
// orders.json: replace with a real database before going live, and note
// that on most serverless hosts this file will not persist writes.
import { promises as fs } from "fs";
import path from "path";

const REVIEWS_FILE = path.join(process.cwd(), "reviews.json");

async function readReviews() {
  try {
    const data = await fs.readFile(REVIEWS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeReviews(reviews) {
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

// Returns all user-submitted reviews for a given product slug, newest first.
export async function getReviewsForProduct(slug) {
  const all = await readReviews();
  return all
    .filter((r) => r.productSlug === slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function addReview(review) {
  const all = await readReviews();
  all.push(review);
  await writeReviews(all);
  return review;
}
