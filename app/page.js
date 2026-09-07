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

      {/* Collections */}
      {/* <section className="container-x py-20">
        <h2 className="section-heading text-center mb-12">Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collection/${c.slug}`}
              className="group relative h-96 overflow-hidden block"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-6">
                <h3 className=" text-white text-2xl">{c.name}</h3>
                <p className="text-white/80 text-sm mt-2">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section> */}

      {/* Featured products */}
      <section className="container-x py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
            Fan Favourites
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
            Bestsellers
          </h2>
          {/* <Link
            href="/collection/watches"
            className="text-xs uppercase tracking-widest hover:text-gold"
          >
            View All
          </Link> */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

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
    </div>
  );
}