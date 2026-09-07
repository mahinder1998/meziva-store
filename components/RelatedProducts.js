import ProductCard from "@/components/ProductCard";

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="container-x mt-8 mb-24 md:mb-32">
      <div className="text-center mb-10 md:mb-12">
        <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
          Complete the Ritual
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
          You May Also Like
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}