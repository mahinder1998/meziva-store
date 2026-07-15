import { NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/razorpay/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Verifies the payment signature server-side. NEVER trust the client's
// "payment successful" callback alone — always verify here before
// marking an order as paid in your database.
export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { verified: false, error: "Signature mismatch" },
        { status: 400 }
      );
    }

    // TODO: mark order as "paid" in your real database here.

    return NextResponse.json({ verified: true });
  } catch (err) {
    console.error("Razorpay verification failed:", err);
    return NextResponse.json(
      { verified: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
