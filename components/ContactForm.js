"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // No backend contact endpoint yet — this opens the user's mail client
    // pre-filled, which works reliably with zero extra setup. Once a
    // /api/contact route exists, swap this for a fetch() POST instead.
    const subject = encodeURIComponent(`Message from ${form.name || "website visitor"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:support@meziva.in?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border border-charcoal/20 px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border border-charcoal/20 px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
      />
      <textarea
        required
        name="message"
        placeholder="How can we help?"
        rows={5}
        value={form.message}
        onChange={handleChange}
        className="w-full border border-charcoal/20 px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
      />
      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send Message
      </button>
      {sent && (
        <p className="text-xs text-charcoal/50 pt-1">
          Your email app should have opened with your message ready to send.
          If it didn't, email us directly at{" "}
          <a href="mailto:support@meziva.in" className="underline">
            support@meziva.in
          </a>
          .
        </p>
      )}
    </form>
  );
}
