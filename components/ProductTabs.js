"use client";

import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";

function StarRow({ rating, size = "text-sm" }) {
  const full = Math.round(rating);
  return (
    <span className={`${size} text-amber-500 leading-none`}>
      {"★".repeat(full)}
      <span className="text-charcoal/20">{"★".repeat(5 - full)}</span>
    </span>
  );
}

function RatingSummary({ reviews, fallbackRating }) {
  const count = reviews.length;
  const avg =
    count > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : fallbackRating || 0;

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const n = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = count > 0 ? Math.round((n / count) * 100) : 0;
    return { star, n, pct };
  });

  return (
    <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 mb-10">
      <div className="text-center sm:text-left">
        <p className="text-4xl ">{avg.toFixed(1)}</p>
        <StarRow rating={avg} size="text-base" />
        <p className="text-xs text-charcoal/50 mt-2">
          Based on {count} {count === 1 ? "review" : "reviews"}
        </p>
      </div>
      <div className="flex-1 space-y-1.5 max-w-sm">
        {breakdown.map(({ star, n, pct }) => (
          <div key={star} className="flex items-center gap-3 text-xs">
            <span className="w-10 text-charcoal/60">{star} star</span>
            <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-6 text-charcoal/40 text-right">{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductTabs({ product, reviews: initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || product.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const tabs = [
    { key: "description", label: "Description" },
    { key: "howToUse", label: "How to Use" },
    { key: "reviews", label: `Reviews (${reviews.length})` },
    { key: "additionalInfo", label: "Additional Information" },
  ];

  const [active, setActive] = useState("description");

  function handleReviewSubmitted(newReview) {
    setReviews((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
  }

  return (
    <div className="container-x mt-16 md:mt-24">
      {/* Tab headers */}
      <div className="flex gap-6 sm:gap-10 border-b border-black/10 overflow-x-auto overflow-y-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`whitespace-nowrap pb-4 text-xs sm:text-sm uppercase tracking-widest2 transition-colors relative ${
              active === tab.key
                ? "text-charcoal"
                : "text-charcoal/40 hover:text-charcoal/70"
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <span className="absolute left-0 -bottom-px h-[2px] w-full bg-charcoal" />
            )}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="py-10 max-w-3xl">
        {active === "description" && (
          <p className="text-sm leading-relaxed text-charcoal/70">
            {product.description}
          </p>
        )}

        {active === "howToUse" && (
          <p className="text-sm leading-relaxed text-charcoal/70">
            {product.howToUse ||
              "Care and usage instructions for this product will be added soon."}
          </p>
        )}

        {active === "additionalInfo" && (
          <div className="divide-y divide-black/10 border-t border-b border-black/10">
            {product.additionalInfo &&
            Object.keys(product.additionalInfo).length > 0 ? (
              Object.entries(product.additionalInfo).map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 py-3 text-sm"
                >
                  <span className="w-full sm:w-48 shrink-0 text-charcoal/50 uppercase tracking-widest2 text-xs">
                    {label}
                  </span>
                  <span className="text-charcoal/80">{value}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-charcoal/60 py-3">
                No additional information available for this product.
              </p>
            )}
          </div>
        )}

        {active === "reviews" && (
          <div>
            <RatingSummary reviews={reviews} fallbackRating={product.rating} />

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-charcoal/60">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </p>
              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-xs uppercase tracking-widest2 border border-charcoal px-4 py-2"
                >
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <ReviewForm
                productSlug={product.slug}
                onSubmitted={handleReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
              />
            )}

            {reviews.length > 0 ? (
              <div className="space-y-8">
                {reviews.map((review, i) => (
                  <div
                    key={review.id || i}
                    className="border-t border-black/10 pt-6 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <StarRow rating={review.rating} />
                        <p className="text-sm font-medium mt-2">
                          {review.title}
                        </p>
                      </div>
                      <p className="text-xs text-charcoal/40 shrink-0">
                        {new Date(review.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-charcoal/70 leading-relaxed mt-2">
                      {review.comment}
                    </p>
                    <p className="text-xs text-charcoal/50 mt-3">
                      {review.name}
                      {review.verified && (
                        <span className="text-emerald-700"> · Verified Buyer</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal/60">
                No reviews yet — be the first to review this product.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
