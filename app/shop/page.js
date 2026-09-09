import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/data/products";

// Rendered fresh per request — same reasoning as the homepage: admin-panel
// product/price/stock changes show up immediately, no redeploy needed.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop All — Meziva Beauty",
  description:
    "Shop the full Meziva Beauty range — hydrating lip balms with SPF 30, real fruit extracts and Vitamin E.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="container-x py-10 md:py-16">
      <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
        <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
          Full Range
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
          Shop All
        </h1>
        <p className="text-sm md:text-base text-charcoal/60 mt-3 leading-relaxed">
          Clean, dermatologically tested lip care — made for Indian skin and
          weather.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-charcoal/50 py-16">
          No products available right now — check back soon.
        </p>
      ) : (
        <div
          className={`grid gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 ${
            products.length === 1
              ? "grid-cols-1 max-w-xs mx-auto"
              : products.length === 2
              ? "grid-cols-2 max-w-2xl mx-auto"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
