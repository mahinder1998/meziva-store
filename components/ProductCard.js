"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { pushToDataLayer, toGA4Item } from "@/lib/gtm";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const discountPercent = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : null;

  const inStock = product.stock == null || product.stock > 0;
  const lowStock = product.stock != null && product.stock > 0 && product.stock <= 5;

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

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || adding) return;

    setAdding(true);
    addItem(product, product.sizes?.[0], 1);

    pushToDataLayer({
      event: "add_to_cart",
      ecommerce: {
        items: [
          toGA4Item(
            { id: product.id, name: product.name, size: product.sizes?.[0], price: product.price, qty: 1 },
            0
          ),
        ],
      },
    });

    setTimeout(() => setAdding(false), 900);
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={handleClick}
      className="group block"
    >
      <div className="relative w-full aspect-square bg-white overflow-hidden border border-charcoal/10 group-hover:border-charcoal/20 transition-colors duration-300 rounded-sm">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out ${
            !inStock ? "grayscale opacity-70" : ""
          }`}
        />

        {/* Top-left badges */}
        <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 flex flex-col gap-1.5 items-start">
          {discountPercent && (
            <span className="bg-wine text-white text-[10px] font-medium uppercase tracking-widest2 px-2 py-1 md:px-2.5 md:py-1.5">
              {discountPercent}% Off
            </span>
          )}
          {!inStock && (
            <span className="bg-charcoal text-white text-[10px] font-medium uppercase tracking-widest2 px-2 py-1 md:px-2.5 md:py-1.5">
              Sold Out
            </span>
          )}
          {inStock && lowStock && (
            <span className="bg-white text-wine text-[10px] font-medium uppercase tracking-widest2 px-2 py-1 md:px-2.5 md:py-1.5 border border-wine/30">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Quick add — visible on hover for desktop, tucked in bottom-right on mobile */}
        {inStock && (
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-2.5 right-2.5 md:bottom-3 md:right-3 bg-white text-charcoal text-[11px] md:text-xs font-medium uppercase tracking-widest2 px-3 py-2 md:px-4 md:py-2.5 opacity-100 md:opacity-0 translate-y-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 hover:bg-wine hover:text-white shadow-sm"
          >
            {adding ? "Added ✓" : "Quick Add"}
          </button>
        )}
      </div>

      <div className="mt-3 md:mt-5 md:flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-[15px] md:text-base text-charcoal leading-snug">
            {product.name}
          </p>

          {/* Rating — builds trust; only renders if you have review data */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex text-wine" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 20 20"
                    fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M10 1.5l2.6 5.6 6 0.7-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-0.7L10 1.5z" />
                  </svg>
                ))}
              </div>
              {product.reviews?.length > 0 && (
                <span className="text-xs text-charcoal/50">
                  ({product.reviews.length})
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 md:flex-col md:items-end mt-1.5 md:mt-0 shrink-0">
          <p className="text-[15px] md:text-base font-medium text-charcoal">
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
