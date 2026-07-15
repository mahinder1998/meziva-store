import { NextResponse } from "next/server";
import { getRazorpayInstance } from "@/lib/razorpay";

// POST /api/razorpay/order
// body: { amount: number (in rupees) }
// Creates a Razorpay order and returns the order id to the client,
// which is then opened in Razorpay Checkout.
export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 }
    );
  }
}
