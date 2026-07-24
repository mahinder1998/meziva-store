import {
  getProductBySlug,
  getRelatedProducts,
} from "@/data/products";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";

// Products now live in a database and can change any time from the admin
// panel (price edits, new products, stock updates) — so these pages are
// rendered fresh on every request instead of being pre-built at deploy
// time. That way an admin edit shows up immediately, with no redeploy
// needed.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — meziva`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product, 4);

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts}
      reviews={product.reviews}
    />
  );
}
