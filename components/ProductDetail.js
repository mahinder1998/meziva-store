"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function ProductDetail({ product }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="container-x py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Gallery */}
      <div>
        <div className="relative w-full aspect-[3/4] bg-white mb-4">
          <Image
            src={product.images[activeImage]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex gap-3">
          {product.images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveImage(i)}
              className={`relative w-20 h-24 border ${
                activeImage === i ? "border-charcoal" : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="md:pt-4">
        <p className="text-xs uppercase tracking-widest2 text-charcoal/50 capitalize">
          {product.collection}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mt-4">
          <span className="text-xl font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-charcoal/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <p className="text-sm text-charcoal/70 leading-relaxed mt-6">
          {product.description}
        </p>

        {/* Size selector */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest2 mb-3">
            Size / Variant
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-2 text-sm border ${
                  size === s
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-black/20 text-charcoal"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Qty selector */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-widest2 mb-3">Quantity</p>
          <div className="inline-flex items-center border border-black/20">
            <button
              className="w-10 h-10"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-10 text-center">{qty}</span>
            <button className="w-10 h-10" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="btn-primary w-full mt-8"
        >
          {added ? "Added to Bag ✓" : "Add to Bag"}
        </button>

        <div className="mt-8 border-t border-black/10 pt-6 space-y-2 text-sm text-charcoal/60">
          <p>✓ In stock — {product.stock} available</p>
          <p>✓ Cash on Delivery available</p>
          <p>✓ Secure payments via Razorpay (Cards, UPI, Netbanking)</p>
          <p>✓ 7-day easy returns</p>
        </div>
      </div>
    </div>
  );
}
