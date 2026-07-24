"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// `initial` is a raw DB row shape (snake_case) when editing, or undefined
// when creating new. `mode` is "create" or "edit".
export default function ProductForm({ initial, mode }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    id: initial?.id || "",
    slug: initial?.slug || "",
    name: initial?.name || "",
    collection: initial?.collection_slug || "lip-care",
    price: initial?.price ?? "",
    compareAtPrice: initial?.compare_at_price ?? "",
    description: initial?.description || "",
    howToUse: initial?.how_to_use || "",
    stock: initial?.stock ?? 0,
    rating: initial?.rating ?? 0,
    metaContentId: initial?.meta_content_id || "",
    images: (initial?.images || []).join("\n"),
    sizes: (initial?.sizes || []).join(", "),
    additionalInfo: initial
      ? JSON.stringify(initial.additional_info || {}, null, 2)
      : '{\n  "Key Ingredients": "",\n  "SPF": "",\n  "Net Weight": "",\n  "Finish": "",\n  "Skin Type": "",\n  "Fragrance": ""\n}',
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    let additionalInfoParsed;
    try {
      additionalInfoParsed = JSON.parse(form.additionalInfo);
    } catch {
      setError("Additional Information must be valid JSON (check for missing commas/quotes).");
      return;
    }

    const payload = {
      id: form.id.trim(),
      slug: form.slug.trim(),
      name: form.name.trim(),
      collection: form.collection.trim(),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      description: form.description,
      howToUse: form.howToUse,
      additionalInfo: additionalInfoParsed,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      rating: Number(form.rating),
      metaContentId: form.metaContentId.trim() || null,
    };

    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/products/${initial.slug}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Product ID {isEdit && "(can't be changed)"}
          </label>
          <input
            name="id"
            value={form.id}
            onChange={handleChange}
            disabled={isEdit}
            placeholder="p3"
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1 disabled:bg-black/5"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Slug (used in the URL) {isEdit && "(can't be changed)"}
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            disabled={isEdit}
            placeholder="mango-blast-lip-balm"
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1 disabled:bg-black/5"
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
          Name
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border border-black/20 px-4 py-3 text-sm mt-1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Collection Slug
          </label>
          <input
            name="collection"
            value={form.collection}
            onChange={handleChange}
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Compare-at Price (₹, optional)
          </label>
          <input
            type="number"
            name="compareAtPrice"
            value={form.compareAtPrice}
            onChange={handleChange}
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full border border-black/20 px-4 py-3 text-sm mt-1 resize-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
          How to Use
        </label>
        <textarea
          name="howToUse"
          value={form.howToUse}
          onChange={handleChange}
          rows={3}
          className="w-full border border-black/20 px-4 py-3 text-sm mt-1 resize-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
          Additional Information (JSON — key/value pairs shown in the
          "Additional Information" PDP tab)
        </label>
        <textarea
          name="additionalInfo"
          value={form.additionalInfo}
          onChange={handleChange}
          rows={7}
          className="w-full border border-black/20 px-4 py-3 text-xs font-mono mt-1 resize-none"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
          Image paths (one per line — must already exist in /public/images/,
          upload via File Manager first)
        </label>
        <textarea
          name="images"
          value={form.images}
          onChange={handleChange}
          rows={4}
          placeholder="/images/mango-blast-main.jpg"
          className="w-full border border-black/20 px-4 py-3 text-sm font-mono mt-1 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Sizes (comma separated)
          </label>
          <input
            name="sizes"
            value={form.sizes}
            onChange={handleChange}
            placeholder="4.5g"
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Rating (0-5)
          </label>
          <input
            type="number"
            step="0.1"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest2 text-charcoal/50">
            Meta Content ID (optional)
          </label>
          <input
            name="metaContentId"
            value={form.metaContentId}
            onChange={handleChange}
            placeholder="from Meta Commerce Manager"
            className="w-full border border-black/20 px-4 py-3 text-sm mt-1"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm text-charcoal/60 underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
