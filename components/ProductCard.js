"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { pushToDataLayer, toGA4Item } from "@/lib/gtm";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, setMiniCartOpen } = useCart();
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
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0],
      size: product.sizes?.[0],
      qty: 1,
    });

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

    setMiniCartOpen(true);
    setTimeout(() => setAdding(false), 600);
  }

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
          className={`object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out ${
            !inStock ? "grayscale opacity-70" : ""
          }`}
        />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {discountPercent && (
            <span className="bg-wine text-white text-[10px] font-medium uppercase tracking-widest2 px-2.5 py-1.5">
              {discountPercent}% Off
            </span>
          )}
          {!inStock && (
            <span className="bg-charcoal text-white text-[10px] font-medium uppercase tracking-widest2 px-2.5 py-1.5">
              Sold Out
            </span>
          )}
          {inStock && lowStock && (
            <span className="bg-white text-wine text-[10px] font-medium uppercase tracking-widest2 px-2.5 py-1.5 border border-wine/30">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Quick add — desktop hover, always visible on mobile as a tap target */}
        {inStock && (
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-3 right-3 bg-white text-charcoal text-xs font-medium uppercase tracking-widest2 px-4 py-2.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 md:transition-all md:duration-300 hover:bg-wine hover:text-white"
          >
            {adding ? "Added ✓" : "Quick Add"}
          </button>
        )}
      </div>

      <div className="mt-5 md:flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-base text-charcoal leading-snug">
            {product.name}
          </p>

          {/* Rating — builds trust; only renders if you have review data */}
          {product.rating && (
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
              {product.reviewCount > 0 && (
                <span className="text-xs text-charcoal/50">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
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