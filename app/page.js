import ProductCard from "@/components/ProductCard";
import HeroBanner from "@/components/HeroBanner";
import { getFeaturedProducts } from "@/data/products";

// Rendered fresh per request — homepage shows admin-panel product changes
// immediately, no redeploy needed.
export const dynamic = "force-dynamic";

const FAQS = [
  {
    q: "Is this safe for daily use?",
    a: "Yes — our balms are dermatologically tested and formulated for everyday use, morning and night.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are typically delivered within 3–7 business days across India.",
  },
  {
    q: "What if I don't like the product?",
    a: "We offer a 7-day, no-questions-asked return policy. Reach out to support@meziva.in and we'll sort it out.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes — Cash on Delivery is available on all orders across India, with no advance payment required.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      {/* Featured products */}
      <section className="container-x py-12 md:py-24">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
            Fan Favourites
          </p>
          <h2 className="font-serif text-2xl md:text-4xl text-charcoal">
            Bestsellers
          </h2>
        </div>

        <div
          className={`grid gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 ${
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
      <section className="bg-blush/30 py-12 md:py-24">
        <div className="container-x">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
              Clean Formula
            </p>
            <h2 className="font-serif text-2xl md:text-4xl text-charcoal">
              What's Inside
            </h2>
            <p className="text-sm text-charcoal/60 mt-3 max-w-md mx-auto">
              Every Meziva balm is made with skin-loving ingredients — nothing
              hidden, nothing unnecessary.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
            {[
              { name: "Shea Butter", benefit: "Deep hydration for 24 hours" },
              { name: "Vitamin E", benefit: "Repairs & nourishes dry lips" },
              { name: "SPF 30", benefit: "Protects against sun damage" },
              {
                name: "No Parabens",
                benefit: "Dermatologically tested, safe daily use",
              },
            ].map((item) => (
              <div key={item.name} className="text-center">
                <h4 className="font-serif text-[15px] md:text-lg text-charcoal mb-1.5">
                  {item.name}
                </h4>
                <p className="text-xs md:text-sm text-charcoal/60 leading-relaxed">
                  {item.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white py-12 md:py-20 border-t border-charcoal/10">
        <div className="container-x grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-charcoal/15 flex items-center justify-center mb-4 md:mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                <path d="M3 7h11v8H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <h4 className="font-serif text-base md:text-lg text-charcoal mb-2">Free Shipping</h4>
            <p className="text-sm text-charcoal/60 max-w-[220px]">
              On all prepaid orders across India.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-charcoal/15 flex items-center justify-center mb-4 md:mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                <rect x="2.5" y="6" width="19" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M2.5 10.5h19" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h4 className="font-serif text-base md:text-lg text-charcoal mb-2">Cash on Delivery</h4>
            <p className="text-sm text-charcoal/60 max-w-[220px]">
              Pay in full when it arrives at your door.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-charcoal/15 flex items-center justify-center mb-4 md:mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                <path d="M4 12a8 8 0 1 1 2.5 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M3 17v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="font-serif text-base md:text-lg text-charcoal mb-2">Easy Returns</h4>
            <p className="text-sm text-charcoal/60 max-w-[220px]">
              7-day, no-questions-asked returns.
            </p>
          </div>
        </div>
      </section>

      {/*
        Testimonials section intentionally left out.
        Add one here once you have real customer reviews/photos — using
        fabricated names or quotes is a trust and legal risk, so don't fill
        this with placeholder testimonials before going live.
      */}

      {/* FAQ — kills last-minute checkout doubt */}
      <section className="bg-white py-12 md:py-20 border-t border-charcoal/10">
        <div className="container-x max-w-2xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-serif text-xl md:text-3xl text-charcoal">
              Common Questions
            </h2>
          </div>

          <div className="divide-y divide-charcoal/10">
            {FAQS.map((item) => (
              <details key={item.q} className="group py-4 md:py-5">
                <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
                  <span className="font-serif text-[15px] md:text-lg text-charcoal">
                    {item.q}
                  </span>
                  <span className="text-charcoal/40 group-open:rotate-45 transition-transform duration-300 text-xl leading-none shrink-0">
                    +
                  </span>
                </summary>
                <p className="text-sm text-charcoal/60 leading-relaxed mt-3 pr-6 md:pr-8">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
