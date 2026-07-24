"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ slug, name }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${name}"? This also removes its reviews and cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Could not delete product.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs uppercase tracking-widest2 text-red-600 underline disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
