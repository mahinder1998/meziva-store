"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();

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
    <div className="container-x py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="md:col-span-2">
        <h1 className="section-heading mb-8">Your Bag</h1>
        <div className="space-y-8">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex gap-6 border-b border-black/10 pb-8"
            >
              <div className="relative w-28 h-32 flex-shrink-0 bg-white">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-charcoal/50 mt-1">
                      Size: {item.size}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center border border-black/15">
                    <button
                      className="w-8 h-8"
                      onClick={() => updateQty(item.key, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.qty}
                    </span>
                    <button
                      className="w-8 h-8"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-xs uppercase tracking-widest2 text-charcoal/50 hover:text-charcoal"
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
        <div className="bg-white p-8 sticky top-28">
          <h2 className="font-serif text-xl mb-6">Order Summary</h2>
          <div className="flex justify-between text-sm mb-3">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t border-black/10 mt-4 pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="btn-primary w-full text-center block mt-6"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
