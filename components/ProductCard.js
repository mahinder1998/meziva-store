"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { pushToDataLayer, toGA4Item } from "@/lib/gtm";

export default function ProductCard({ product }) {
  function handleClick() {
    pushToDataLayer({
      event: "select_item",
      ecommerce: {
        items: [
          toGA4Item(
            { id: product.id, name: product.name, size: product.sizes?.[0], price: product.price, qty: 1 },
            0
          ),
        ],
      },
    });
  }

  const discountPercent = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={handleClick}
      className="group block"
    >
      <div className="relative w-full aspect-[4/4] bg-white overflow-hidden border border-charcoal/10 group-hover:border-charcoal/20 transition-colors duration-300">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
        {discountPercent && (
          <span className="absolute top-3 left-3 bg-wine text-white text-[10px] font-medium uppercase tracking-widest2 px-2.5 py-1.5">
            {discountPercent}% Off
          </span>
        )}
      </div>

      <div className="mt-5 md:flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-base text-charcoal leading-snug">
            {product.name}
          </p>
          {/* <p className="text-xs text-charcoal/50 mt-1 capitalize">
            {product.collection}
          </p> */}
        </div>
        <div className="flex items-baseline gap-2 md:flex-col md:items-end mt-2 md:mt-0 shrink-0">
          <p className="text-base font-medium text-charcoal">
            {formatPrice(product.price)}
          </p>
          {product.compareAtPrice && (
            <p className="text-sm text-charcoal/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}