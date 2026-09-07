"use client";

import { useState } from "react";

export default function ReviewForm({ productSlug, onSubmitted, onCancel }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!name.trim() || !title.trim() || !comment.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          name: name.trim(),
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Could not submit review. Please try again.");
        setLoading(false);
        return;
      }

      onSubmitted?.(data.review);
      setRating(0);
      setName("");
      setTitle("");
      setComment("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-charcoal/10 bg-cream p-6 md:p-8 mb-10 space-y-5"
    >
      <h3 className="font-serif text-xl text-charcoal">Write a Review</h3>

      {/* Star picker */}
      <div>
        <p className="text-xs uppercase tracking-widest2 mb-2 text-charcoal/60">
          Your Rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl leading-none px-0.5 transition-transform duration-150 hover:scale-110"
              aria-label={`${star} star`}
            >
              <span
                className={
                  (hoverRating || rating) >= star
                    ? "text-gold"
                    : "text-charcoal/20"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          className="border border-charcoal/20 px-4 py-3 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
        />
        <input
          type="text"
          placeholder="Review Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="border border-charcoal/20 px-4 py-3 text-sm bg-white focus:outline-none focus:border-charcoal transition-colors"
        />
      </div>

      <textarea
        placeholder="Share details of your experience with this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={1000}
        rows={4}
        className="w-full border border-charcoal/20 px-4 py-3 text-sm bg-white resize-none focus:outline-none focus:border-charcoal transition-colors"
      />

      {error && (
        <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-5">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-charcoal/60 hover:text-charcoal underline underline-offset-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}