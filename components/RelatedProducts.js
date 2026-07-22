import ProductCard from "@/components/ProductCard";

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="container-x mt-8 mb-24">
      <h2 className=" text-2xl mb-8">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
