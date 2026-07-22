import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getReviewsForProduct, addReview } from "@/lib/reviews";

// GET /api/reviews?slug=cherry-blast-lip-balm
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const reviews = await getReviewsForProduct(slug);
  return NextResponse.json({ reviews });
}

// POST /api/reviews
// body: { productSlug, name, rating, title, comment }
export async function POST(req) {
  try {
    const { productSlug, name, rating, title, comment } = await req.json();

    if (!productSlug || !name || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Rating must be a whole number between 1 and 5." },
        { status: 400 }
      );
    }

    const review = {
      id: uuidv4(),
      productSlug,
      name: name.trim().slice(0, 60),
      rating: numericRating,
      title: title.trim().slice(0, 100),
      comment: comment.trim().slice(0, 1000),
      date: new Date().toISOString(),
      // User-submitted reviews are never marked "verified" — that badge is
      // reserved for reviews tied to a confirmed order (not implemented in
      // this demo store).
      verified: false,
    };

    await addReview(review);

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error("Review submission failed:", err);
    return NextResponse.json(
      { success: false, error: "Could not submit review." },
      { status: 500 }
    );
  }
}
