"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBF9] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-black/10 bg-white p-8"
      >
        <h1 className="text-xl mb-1">meziva Admin</h1>
        <p className="text-sm text-charcoal/60 mb-6">
          Enter the admin password to view orders.
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-black/20 px-4 py-3 text-sm mb-4"
          autoFocus
        />

        {error && (
          <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3 mb-4">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Checking..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
