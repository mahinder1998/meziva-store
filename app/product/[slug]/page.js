import { getProductBySlug, getAllProducts } from "@/data/products";
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
    title: `${product.name} — LUXE`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
