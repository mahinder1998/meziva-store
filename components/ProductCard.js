import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/data/products";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative w-full aspect-[3/4] bg-white overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.compareAtPrice && (
          <span className="absolute top-3 left-3 bg-charcoal text-white text-[10px] uppercase tracking-widest2 px-2 py-1">
            Sale
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-charcoal">{product.name}</p>
          <p className="text-xs text-charcoal/50 mt-1 capitalize">
            {product.collection}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-charcoal">
            {formatPrice(product.price)}
          </p>
          {product.compareAtPrice && (
            <p className="text-xs text-charcoal/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
