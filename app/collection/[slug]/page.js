import ProductCard from "@/components/ProductCard";
import {
  getCollectionBySlug,
  getProductsByCollection,
} from "@/data/products";
import { notFound } from "next/navigation";

// Same reasoning as the product page — rendered fresh per request so
// admin-panel product changes appear immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) return {};
  return {
    title: `${collection.name} — meziva`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }) {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const products = await getProductsByCollection(params.slug);

  return (
    <div className="container-x py-16">
      <div className="text-center max-w-xl mx-auto mb-14">
        <h1 className="section-heading">{collection.name}</h1>
        <p className="text-charcoal/60 mt-3">{collection.description}</p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-charcoal/50">
          No products in this collection yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
