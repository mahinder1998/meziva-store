"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
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

  async function handleCOD() {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const result = await saveOrder();
      if (result.success) {
        pushPurchaseEvent(result.order.id, "COD");
        clearCart();
        router.push(
          `/order-success?orderId=${result.order.id}&orderNumber=${result.order.orderNumber}&method=COD`
        );
      } else {
        setError("Something went wrong placing your order. Try again.");
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

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const orderData = await orderRes.json();

      if (!orderData.order) {
        setError("Could not initiate payment. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: "INR",
        name: "meziva",
        description: "Order Payment",
        order_id: orderData.order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#111111" },
        handler: async function (response) {
          // 3. Verify payment signature on server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.verified) {
            const result = await saveOrder({
              razorpay: response,
            });
            pushPurchaseEvent(result.order.id, "RAZORPAY");
            clearCart();
            router.push(
              `/order-success?orderId=${result.order.id}&orderNumber=${result.order.orderNumber}&method=RAZORPAY`
            );
          } else {
            setError(
              "Payment verification failed. If money was deducted, contact support."
            );
          }
          setLoading(false);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);
        setError(
          `Payment failed: ${response.error.description || "Please try again."}`
        );
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
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
      <div className="container-x py-24 text-center">
        <h1 className="section-heading">Your bag is empty</h1>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container-x py-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-8">
          <div>
            <h2 className=" text-xl mb-6">Shipping Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="border border-black/20 px-4 py-3 text-sm sm:col-span-2"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border border-black/20 px-4 py-3 text-sm"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border border-black/20 px-4 py-3 text-sm"
              />
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="border border-black/20 px-4 py-3 text-sm sm:col-span-2"
              />
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border border-black/20 px-4 py-3 text-sm"
              />
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="border border-black/20 px-4 py-3 text-sm"
              />
              <input
                name="pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className="border border-black/20 px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <h2 className=" text-xl mb-6">Payment Method</h2>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 border px-4 py-4 cursor-pointer ${
                  paymentMethod === "RAZORPAY"
                    ? "border-charcoal"
                    : "border-black/15"
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
                className={`flex items-center gap-3 border px-4 py-4 cursor-pointer ${
                  paymentMethod === "COD" ? "border-charcoal" : "border-black/15"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-charcoal/50">
                    Pay in cash when your order arrives
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

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading
              ? "Processing..."
              : paymentMethod === "COD"
              ? "Place Order (COD)"
              : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <div className="bg-white p-8 sticky top-28">
            <h2 className=" text-xl mb-6">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.key} className="flex justify-between text-sm">
                  <span className="text-charcoal/70">
                    {item.name} × {item.qty}{" "}
                    <span className="text-charcoal/40">({item.size})</span>
                  </span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-black/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-black/10 pt-3">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
