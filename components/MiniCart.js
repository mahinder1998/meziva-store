"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { pushToDataLayer, toGA4Item } from "@/lib/gtm";

export default function MiniCart() {
  const {
    items,
    subtotal,
    updateQty,
    removeItem,
    isMiniCartOpen,
    setMiniCartOpen,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isMiniCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMiniCartOpen(false)}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isMiniCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-black/10">
          <h3 className=" text-xl">Your Bag ({items.length})</h3>
          <button
            onClick={() => setMiniCartOpen(false)}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 && (
            <p className="text-sm text-charcoal/60">Your bag is empty.</p>
          )}
          {items.map((item) => (
            <div key={item.key} className="flex gap-4">
              <div className="relative w-20 h-24 flex-shrink-0 bg-white">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{item.name}</p>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-xs text-charcoal/40 hover:text-charcoal"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-charcoal/50 mt-1">
                  Size: {item.size}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center border border-black/15">
                    <button
                      className="w-7 h-7 text-sm"
                      onClick={() => updateQty(item.key, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm">
                      {item.qty}
                    </span>
                    <button
                      className="w-7 h-7 text-sm"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-black/10 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-charcoal/50">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={() => {
                setMiniCartOpen(false);
                pushToDataLayer({
                  event: "begin_checkout",
                  ecommerce: {
                    currency: "INR",
                    value: subtotal,
                    items: items.map((item, i) => toGA4Item(item, i)),
                  },
                });
              }}
              className="btn-primary w-full text-center block"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => setMiniCartOpen(false)}
              className="btn-secondary w-full text-center block"
            >
              View Bag
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
