"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";
import { pushToDataLayer, toGA4Item } from "@/lib/gtm";
import { fbqTrack } from "@/lib/fbpixel";

export default function ProductDetail({ product, relatedProducts = [], reviews }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    pushToDataLayer({
      event: "view_item",
      ecommerce: {
        currency: "INR",
        value: product.price,
        items: [
          toGA4Item(
            {
              id: product.id,
              name: product.name,
              size: product.sizes[0],
              price: product.price,
              qty: 1,
            },
            0
          ),
        ],
      },
    });

    fbqTrack("ViewContent", {
      content_ids: [product.metaContentId || product.id],
      content_type: "product",
      content_name: product.name,
      value: product.price,
      currency: "INR",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  function handleAddToCart() {
    addItem(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    pushToDataLayer({
      event: "add_to_cart",
      ecommerce: {
        currency: "INR",
        value: product.price * qty,
        items: [toGA4Item({ id: product.id, name: product.name, size, price: product.price, qty }, 0)],
      },
    });

    fbqTrack("AddToCart", {
      content_ids: [product.metaContentId || product.id],
      content_type: "product",
      content_name: product.name,
      value: product.price * qty,
      currency: "INR",
    });
  }

  return (
    <>
    <div className="container-x py-6 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Gallery */}
      <div>
        <div className="relative w-full aspect-[4/4] bg-white mb-4">
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
        <h1 className=" text-2xl md:text-3xl font-semibold mt-2">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mt-4">
          <span className="text-xl font-bold">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-md text-charcoal/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <p className="text-sm text-charcoal/70 leading-6 mt-6">
          {product.description}
        </p>

        {/* Size selector */}
        {/* <div className="mt-8">
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
        </div> */}

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
          className="btn-primary w-full mt-8 hidden md:block"
        >
          {added ? "Added to Bag ✓" : "Add to Bag"}
        </button>

        {/* Mobile: sticky Add to Bag bar pinned to the bottom of the screen */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/10 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button onClick={handleAddToCart} className="btn-primary w-full">
            {added
              ? "Added to Bag ✓"
              : `Add to Bag — ${formatPrice(product.price * qty)}`}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8  md:pb-0">
          <div className="flex items-start gap-3 border border-black/10 p-4">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-charcoal shrink-0 mt-0.5"
            >
              <path d="M3 7h11v8H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-snug">
              In stock — {product.stock} available
            </p>
          </div>

          <div className="flex items-start gap-3 border rounded-md border-black/10 p-4">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-charcoal shrink-0 mt-0.5"
            >
              <rect x="2.5" y="6" width="19" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2.5 10.5h19" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-snug">
              Cash on Delivery available
            </p>
          </div>

          <div className="flex items-start gap-3 border border-black/10 p-4">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-charcoal shrink-0 mt-0.5"
            >
              <path
                d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-snug">
              Secure payments via Razorpay
            </p>
          </div>

          <div className="flex items-start gap-3 border border-black/10 p-4">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="text-charcoal shrink-0 mt-0.5"
            >
              <path d="M4 12a8 8 0 1 1 2.5 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 17v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-snug">
              7-day easy returns
            </p>
          </div>
        </div>
      </div>
      </div>

      <ProductTabs product={product} reviews={reviews} />
      <RelatedProducts products={relatedProducts} />
    </>
  );
}