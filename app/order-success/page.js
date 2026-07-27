"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { formatPrice } from "@/lib/format";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const orderNumber = params.get("orderNumber");
  const method = params.get("method");
  const advance = params.get("advance");
  const remaining = params.get("remaining");

  return (
    <div className="container-x py-24 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 text-2xl">
        ✓
      </div>
      <h1 className="section-heading mb-4">Order Confirmed</h1>
      <p className="text-charcoal/60 mb-2">
        Thank you for your order! We&apos;ve sent a confirmation to your email.
      </p>
      {orderNumber && (
        <p className="text-lg font-medium mb-1">Order #{orderNumber}</p>
      )}
      {orderId && (
        <p className="text-xs text-charcoal/40 mb-8">
          Reference ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
      {method === "COD" && (
        <div className="text-sm text-left bg-amber-50 border border-amber-200 px-5 py-4 mb-8 space-y-1">
          {advance && (
            <p className="text-emerald-700">
              ✓ ₹{advance} advance received — your order is confirmed.
            </p>
          )}
          {remaining && (
            <p className="text-charcoal/70">
              Please keep{" "}
              <span className="font-medium">{formatPrice(Number(remaining))}</span>{" "}
              in exact cash ready at the time of delivery.
            </p>
          )}
        </div>
      )}
      <Link href="/" className="btn-primary inline-block">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
