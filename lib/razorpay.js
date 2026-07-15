import Razorpay from "razorpay";

// Server-side Razorpay instance. Uses secret key — NEVER import this file
// from a client component.
export function getRazorpayInstance() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}
