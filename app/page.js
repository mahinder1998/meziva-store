import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HeroBanner from "@/components/HeroBanner";
import { getFeaturedProducts, getAllCollections } from "@/data/products";

// Rendered fresh per request — homepage shows admin-panel product changes
// immediately, no redeploy needed.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);
  const collections = await getAllCollections();

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      {/* Featured products */}
      <section className="container-x py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
            Fan Favourites
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
            Bestsellers
          </h2>
        </div>

        <div
          className={`grid gap-x-6 gap-y-14 ${
            featured.length === 1
              ? "grid-cols-1 max-w-sm mx-auto"
              : featured.length === 2
              ? "grid-cols-2 max-w-2xl mx-auto"
              : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* What's Inside — ingredient transparency builds trust fast */}
      {/* <section className="bg-blush/40 py-16 md:py-24">
        <div className="container-x">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
              Clean Formula
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              What's Inside
            </h2>
            <p className="text-sm text-charcoal/60 mt-3 max-w-md mx-auto">
              Every Meziva balm is made with skin-loving ingredients — nothing
              hidden, nothing unnecessary.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              {
                name: "Shea Butter",
                benefit: "Deep hydration for 24 hours",
              },
              {
                name: "Vitamin E",
                benefit: "Repairs & nourishes dry lips",
              },
              {
                name: "SPF 30",
                benefit: "Protects against sun damage",
              },
              {
                name: "No Parabens",
                benefit: "Dermatologically tested, safe daily use",
              },
            ].map((item) => (
              <div key={item.name} className="text-center">
                <h4 className="font-serif text-base md:text-lg text-charcoal mb-1.5">
                  {item.name}
                </h4>
                <p className="text-xs md:text-sm text-charcoal/60 leading-relaxed">
                  {item.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Value props */}
      <section className="bg-white py-16 md:py-20 border-t border-charcoal/10">
        <div className="container-x grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-charcoal/15 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                <path d="M3 7h11v8H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <h4 className="font-serif text-lg text-charcoal mb-2">Free Shipping</h4>
            <p className="text-sm text-charcoal/60 max-w-[220px]">
              On all prepaid orders across India.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-charcoal/15 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                <rect x="2.5" y="6" width="19" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2.5 10.5h19" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h4 className="font-serif text-lg text-charcoal mb-2">Cash on Delivery</h4>
            <p className="text-sm text-charcoal/60 max-w-[220px]">
              Pay when it arrives at your door.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-charcoal/15 flex items-center justify-center mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                <path d="M4 12a8 8 0 1 1 2.5 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 17v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="font-serif text-lg text-charcoal mb-2">Easy Returns</h4>
            <p className="text-sm text-charcoal/60 max-w-[220px]">
              7-day, no-questions-asked returns.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials — REPLACE with real customer reviews as soon as you have them */}
      {/* <section className="bg-cream py-16 md:py-24 border-t border-charcoal/10">
        <div className="container-x">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
              Loved By Customers
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
              What People Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {[
              {
                name: "Ananya S.",
                text:
                  "My lips have never felt this soft. The SPF is a game changer for daily wear in Delhi summers.",
              },
              {
                name: "Riya K.",
                text:
                  "Berry Blast smells amazing and the tint is so natural. Ordering the Cherry one next.",
              },
              {
                name: "Priya M.",
                text:
                  "Fast delivery, great packaging, and the balm genuinely lasts all day. Repeat customer already.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-white p-7 border border-charcoal/10"
              >
                <div className="flex text-wine mb-4" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 1.5l2.6 5.6 6 0.7-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-0.7L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-charcoal/75 leading-relaxed mb-5">
                  "{review.text}"
                </p>
                <p className="text-xs uppercase tracking-widest2 text-charcoal/50">
                  {review.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* FAQ — kills last-minute checkout doubt */}
      {/* <section className="bg-white py-16 md:py-20 border-t border-charcoal/10">
        <div className="container-x max-w-2xl">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
              Common Questions
            </h2>
          </div>

          <div className="divide-y divide-charcoal/10">
            {[
              {
                q: "Is this safe for daily use?",
                a: "Yes — our balms are dermatologically tested and formulated for everyday use, morning and night.",
              },
              {
                q: "How long does shipping take?",
                a: "Orders are typically delivered within 3–6 business days across India.",
              },
              {
                q: "What if I don't like the product?",
                a: "We offer a 7-day, no-questions-asked return policy. Reach out to support@meziva.in and we'll sort it out.",
              },
              {
                q: "Do you offer Cash on Delivery?",
                a: "Yes, COD is available on all orders across India.",
              },
            ].map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-serif text-base md:text-lg text-charcoal pr-4">
                    {item.q}
                  </span>
                  <span className="text-charcoal/40 group-open:rotate-45 transition-transform duration-300 text-xl leading-none shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-sm text-charcoal/60 leading-relaxed mt-3 pr-8">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}