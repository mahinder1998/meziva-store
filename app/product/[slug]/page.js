import {
  getProductBySlug,
  getAllProducts,
  getRelatedProducts,
} from "@/data/products";
import { getReviewsForProduct } from "@/lib/reviews";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

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

  const userReviews = await getReviewsForProduct(product.slug);
  const reviews = [...userReviews, ...(product.reviews || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
    />
  );
}
