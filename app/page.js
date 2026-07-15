import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts, getAllCollections } from "@/data/products";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);
  const collections = await getAllCollections();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="Luxe hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35 flex items-center">
          <div className="container-x">
            <p className="text-white/80 text-xs uppercase tracking-widest2 mb-4">
              New Season
            </p>
            <h1 className="font-serif text-white text-5xl md:text-7xl max-w-xl leading-tight">
              Crafted to outlast the trend.
            </h1>
            <Link
              href="/collection/watches"
              className="inline-block mt-8 btn-primary bg-white text-charcoal hover:bg-gold hover:text-white"
            >
              Shop Timepieces
            </Link>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="container-x py-20">
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
                <h3 className="font-serif text-white text-2xl">{c.name}</h3>
                <p className="text-white/80 text-sm mt-2">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-x py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="section-heading">Bestsellers</h2>
          <Link
            href="/collection/watches"
            className="text-xs uppercase tracking-widest2 hover:text-gold"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white py-16">
        <div className="container-x grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <h4 className="font-serif text-lg mb-2">Free Shipping</h4>
            <p className="text-sm text-charcoal/60">
              On all prepaid orders across India.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-2">Cash on Delivery</h4>
            <p className="text-sm text-charcoal/60">
              Pay when it arrives at your door.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-2">Easy Returns</h4>
            <p className="text-sm text-charcoal/60">
              7-day, no-questions-asked returns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
