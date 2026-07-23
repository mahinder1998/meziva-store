"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const orderNumber = params.get("orderNumber");
  const method = params.get("method");

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
        <p className="text-sm text-charcoal/60 mb-8">
          Please keep exact cash ready at the time of delivery.
        </p>
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
