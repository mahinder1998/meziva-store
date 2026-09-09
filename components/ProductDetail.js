"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";
import Lightbox from "@/components/Lightbox";
import { pushToDataLayer, toGA4Item } from "@/lib/gtm";
import { fbqTrack } from "@/lib/fbpixel";

export default function ProductDetail({ product, relatedProducts = [], reviews }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
              size: product.sizes?.[0],
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

  const discountPercent = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : null;

  const inStock = product.stock == null || product.stock > 0;

  return (
    <>
      <div className="container-x pt-4 pb-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
        {/* Gallery */}
        <div>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="relative w-full aspect-square bg-white mb-3 md:mb-4 border border-charcoal/10 block group cursor-zoom-in"
            aria-label="Open image gallery"
          >
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {discountPercent && (
              <span className="absolute top-3 left-3 bg-wine text-white text-[10px] font-medium uppercase tracking-widest2 px-2.5 py-1.5">
                {discountPercent}% Off
              </span>
            )}
            {/* Zoom affordance icon */}
            <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </button>

          {product.images.length > 1 && (
            <div className="flex gap-2.5 md:gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 shrink-0 border transition-colors duration-200 ${
                    activeImage === i ? "border-charcoal" : "border-charcoal/10 hover:border-charcoal/30"
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
          )}
        </div>

        {/* Details */}
        <div className="md:pt-4">
          {product.collection && (
            <p className="text-xs uppercase tracking-widest2 text-wine capitalize">
              {product.collection}
            </p>
          )}
          <h1 className="font-serif text-2xl md:text-4xl text-charcoal mt-2 md:mt-3 leading-tight">
            {product.name}
          </h1>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-gold" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M10 1.5l2.6 5.6 6 0.7-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-0.7L10 1.5z" />
                  </svg>
                ))}
              </div>
              {reviews?.length > 0 && (
                <span className="text-xs text-charcoal/50">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              )}
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-4 md:mt-5">
            <span className="text-xl md:text-2xl font-medium text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm md:text-base text-charcoal/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {discountPercent && (
              <span className="text-xs uppercase tracking-widest2 text-wine font-medium">
                {discountPercent}% Off
              </span>
            )}
          </div>

          <p className="text-[15px] md:text-sm text-charcoal/70 leading-relaxed md:leading-7 mt-5 md:mt-6 max-w-md">
            {product.description}
          </p>

          {/* Qty selector */}
          <div className="mt-7 md:mt-8">
            <p className="text-xs uppercase tracking-widest2 text-charcoal/50 mb-3">Quantity</p>
            <div className="inline-flex items-center border border-charcoal/20">
              <button
                className="w-11 h-11 text-charcoal/70 hover:text-charcoal transition-colors text-lg"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-11 text-center text-sm font-medium">{qty}</span>
              <button
                className="w-11 h-11 text-charcoal/70 hover:text-charcoal transition-colors text-lg"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="btn-primary w-full mt-8 hidden md:block disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!inStock ? "Sold Out" : added ? "Added to Bag ✓" : "Add to Bag"}
          </button>

          {/* Mobile: sticky Add to Bag bar pinned to the bottom of the screen */}
          <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-charcoal/10 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!inStock
                ? "Sold Out"
                : added
                ? "Added to Bag ✓"
                : `Add to Bag — ${formatPrice(product.price * qty)}`}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 md:gap-3 mt-8 md:mt-10 pb-24 md:pb-0">
            <div className="flex items-start gap-2.5 md:gap-3 border border-charcoal/10 p-3.5 md:p-4">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-charcoal/15 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                  <path d="M3 7h11v8H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M14 10h4l3 3v2h-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="7" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-charcoal/70 leading-snug pt-1">
                {inStock ? `In stock — ${product.stock ?? "available"}` : "Currently out of stock"}
              </p>
            </div>

            <div className="flex items-start gap-2.5 md:gap-3 border border-charcoal/10 p-3.5 md:p-4">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-charcoal/15 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                  <rect x="2.5" y="6" width="19" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2.5 10.5h19" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-charcoal/70 leading-snug pt-1">
                Cash on Delivery available
              </p>
            </div>

            <div className="flex items-start gap-2.5 md:gap-3 border border-charcoal/10 p-3.5 md:p-4">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-charcoal/15 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                  <path
                    d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-charcoal/70 leading-snug pt-1">
                Secure payments via Razorpay
              </p>
            </div>

            <div className="flex items-start gap-2.5 md:gap-3 border border-charcoal/10 p-3.5 md:p-4">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-charcoal/15 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-charcoal">
                  <path d="M4 12a8 8 0 1 1 2.5 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 17v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs sm:text-sm text-charcoal/70 leading-snug pt-1">
                7-day easy returns
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProductTabs product={product} reviews={reviews} />
      <RelatedProducts products={relatedProducts} />

      {lightboxOpen && (
        <Lightbox
          images={product.images}
          initialIndex={activeImage}
          alt={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
