"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { pushToDataLayer, toGA4Item } from "@/lib/gtm";
import { fbqTrack } from "@/lib/fbpixel";

const SHIPPING_FLAT = 29;
const FREE_SHIPPING_THRESHOLD = 5000;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const total = subtotal + shipping;

  // Safety net: fires begin_checkout if someone lands directly on
  // /checkout (bookmark, back button) without clicking the button in
  // Cart/MiniCart — those already fire it on click, this just covers the
  // gap so the funnel step is never missed.
  useEffect(() => {
    if (items.length === 0) return;
    pushToDataLayer({
      event: "begin_checkout",
      ecommerce: {
        currency: "INR",
        value: subtotal,
        items: items.map((item, i) => toGA4Item(item, i)),
      },
    });

    fbqTrack("InitiateCheckout", {
      value: subtotal,
      currency: "INR",
      num_items: items.length,
      content_ids: items.map((item) => item.metaContentId || item.id),
      content_type: "product",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pushPurchaseEvent(orderId, method) {
    pushToDataLayer({
      event: "purchase",
      ecommerce: {
        transaction_id: orderId,
        currency: "INR",
        value: total,
        shipping,
        payment_type: method,
        items: items.map((item, i) => toGA4Item(item, i)),
      },
    });

    fbqTrack("Purchase", {
      value: total,
      currency: "INR",
      content_ids: items.map((item) => item.metaContentId || item.id),
      content_type: "product",
    });
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validateForm() {
    const required = ["name", "email", "phone", "address", "city", "state", "pincode"];
    for (const field of required) {
      if (!form[field] || form[field].trim() === "") {
        setError("Please fill in all fields.");
        return false;
      }
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return false;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }
    setError("");
    return true;
  }

  async function saveOrder(extra = {}) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: form,
        items,
        subtotal,
        shipping,
        total,
        paymentMethod,
        ...extra,
      }),
    });
    return res.json();
  }

  // Shared Razorpay Checkout flow: creates a Razorpay order for `amount`,
  // opens the payment popup, and verifies the signature server-side once
  // paid. Resolves with the verified { razorpay_order_id,
  // razorpay_payment_id, razorpay_signature } response, or null if the
  // customer cancelled or payment/verification failed (onError is called
  // with a message in that case).
  function payWithRazorpay({ amount, description, onError }) {
    return new Promise(async (resolve) => {
      try {
        const orderRes = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });
        const orderData = await orderRes.json();

        if (!orderData.order) {
          onError("Could not initiate payment. Please try again.");
          resolve(null);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.order.amount,
          currency: "INR",
          name: "Meziva Beauty",
          description,
          order_id: orderData.order.id,
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#7A2E3A" },
          handler: async function (response) {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              resolve(response);
            } else {
              onError(
                "Payment verification failed. If money was deducted, contact support."
              );
              resolve(null);
            }
          },
          modal: {
            ondismiss: function () {
              resolve(null);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Razorpay payment failed:", response.error);
          onError(
            `Payment failed: ${response.error.description || "Please try again."}`
          );
          resolve(null);
        });
        rzp.open();
      } catch (err) {
        console.error(err);
        onError("Something went wrong. Please try again.");
        resolve(null);
      }
    });
  }

  // Plain Cash on Delivery — no advance payment required. The full amount
  // is collected in cash when the order is delivered.
  async function handleCOD() {
    if (!validateForm()) return;
    setLoading(true);
    setError("");

    try {
      const result = await saveOrder();

      if (result.success) {
        pushPurchaseEvent(result.order.id, "COD");
        clearCart();
        router.push(
          `/order-success?orderId=${result.order.id}&orderNumber=${result.order.orderNumber}&method=COD`
        );
      } else {
        setError(
          result.error || "Something went wrong placing your order. Try again."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong placing your order. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRazorpay() {
    if (!validateForm()) return;
    setLoading(true);
    setError("");

    const response = await payWithRazorpay({
      amount: total,
      description: "Order Payment",
      onError: setError,
    });

    if (!response) {
      setLoading(false);
      return;
    }

    try {
      const result = await saveOrder({ razorpay: response });

      if (!result.success || !result.order) {
        setError(
          result.error ||
            "Payment was successful, but we could not create your order. Please contact support."
        );
        return;
      }

      pushPurchaseEvent(result.order.id, "RAZORPAY");
      clearCart();
      router.push(
        `/order-success?orderId=${result.order.id}&orderNumber=${result.order.orderNumber}&method=RAZORPAY`
      );
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (paymentMethod === "COD") {
      handleCOD();
    } else {
      handleRazorpay();
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-20 md:py-24 text-center">
        <h1 className="font-serif text-2xl md:text-3xl text-charcoal">Your bag is empty</h1>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container-x py-6 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-28 md:pb-10">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-7 md:space-y-8">
          <div>
            <h2 className="font-serif text-lg md:text-xl text-charcoal mb-5 md:mb-6">
              Shipping Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4">
              <input
                name="name"
                autoComplete="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="border border-charcoal/20 px-4 py-3 text-sm sm:col-span-2 focus:outline-none focus:border-charcoal transition-colors"
              />
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border border-charcoal/20 px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
              />
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border border-charcoal/20 px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
              />
              <input
                name="address"
                autoComplete="street-address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="border border-charcoal/20 px-4 py-3 text-sm sm:col-span-2 focus:outline-none focus:border-charcoal transition-colors"
              />
              <input
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border border-charcoal/20 px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
              />
              <input
                name="state"
                autoComplete="address-level1"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="border border-charcoal/20 px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
              />
              <input
                name="pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="border border-charcoal/20 px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
              />
            </div>
          </div>

          <div>
            <h2 className="font-serif text-lg md:text-xl text-charcoal mb-5 md:mb-6">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 border px-4 py-4 cursor-pointer transition-colors ${
                  paymentMethod === "RAZORPAY"
                    ? "border-charcoal"
                    : "border-charcoal/15"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                />
                <div>
                  <p className="text-sm font-medium">
                    Pay Online (Cards / UPI / Netbanking)
                  </p>
                  <p className="text-xs text-charcoal/50">Powered by Razorpay</p>
                </div>
              </label>
              <label
                className={`flex items-start gap-3 border px-4 py-4 cursor-pointer transition-colors ${
                  paymentMethod === "COD" ? "border-charcoal" : "border-charcoal/15"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-charcoal/50">
                    Pay the full amount in cash when your order arrives — no
                    advance payment needed.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : paymentMethod === "COD"
              ? "Place Order (Cash on Delivery)"
              : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <div className="bg-white p-6 md:p-8 md:sticky md:top-28 border border-charcoal/10">
            <h2 className="font-serif text-lg md:text-xl text-charcoal mb-5 md:mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.key} className="flex justify-between text-sm">
                  <span className="text-charcoal/70">
                    {item.name} × {item.qty}
                    {item.size && (
                      <span className="text-charcoal/40"> ({item.size})</span>
                    )}
                  </span>
                  <span className="shrink-0 ml-3">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-charcoal/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-charcoal/10 pt-3 text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {paymentMethod === "COD" && (
                <p className="text-xs text-charcoal/50 pt-2">
                  Full amount payable in cash on delivery.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}