"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { pushToDataLayer, toGA4Item } from "@/lib/gtm";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();

  // Fires whenever the bag page is viewed with items in it — the "view_cart"
  // step of the funnel, between add_to_cart and begin_checkout.
  useEffect(() => {
    if (items.length === 0) return;
    pushToDataLayer({
      event: "view_cart",
      ecommerce: {
        currency: "INR",
        value: subtotal,
        items: items.map((item, i) => toGA4Item(item, i)),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="section-heading mb-4">Your Bag is Empty</h1>
        <p className="text-charcoal/60 mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-6 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      <div className="md:col-span-2">
        <h1 className="section-heading mb-6 md:mb-8">Your Bag</h1>
        <div className="space-y-6 md:space-y-8">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex gap-4 md:gap-6 border-b border-charcoal/10 pb-6 md:pb-8"
            >
              <div className="relative w-20 h-24 md:w-28 md:h-32 flex-shrink-0 bg-white border border-charcoal/10">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-[15px] md:text-base text-charcoal truncate">
                      {item.name}
                    </p>
                    {item.size && (
                      <p className="text-xs md:text-sm text-charcoal/50 mt-1">
                        Size: {item.size}
                      </p>
                    )}
                  </div>
                  <p className="font-medium text-sm md:text-base shrink-0">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className="flex items-center border border-charcoal/15">
                    <button
                      className="w-8 h-8 text-charcoal/70 hover:text-charcoal"
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.qty}
                    </span>
                    <button
                      className="w-8 h-8 text-charcoal/70 hover:text-charcoal"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-xs uppercase tracking-widest2 text-charcoal/50 hover:text-wine transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order summary */}
      <div>
        <div className="bg-white p-6 md:p-8 md:sticky md:top-28 border border-charcoal/10">
          <h2 className="font-serif text-lg md:text-xl text-charcoal mb-5 md:mb-6">
            Order Summary
          </h2>
          <div className="flex justify-between text-sm mb-3">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t border-charcoal/10 mt-4 pt-4 flex justify-between font-medium text-base">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            onClick={() =>
              pushToDataLayer({
                event: "begin_checkout",
                ecommerce: {
                  currency: "INR",
                  value: subtotal,
                  items: items.map((item, i) => toGA4Item(item, i)),
                },
              })
            }
            className="btn-primary w-full text-center block mt-6"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
