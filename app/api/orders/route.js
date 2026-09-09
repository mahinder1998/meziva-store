import { NextResponse } from "next/server";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { addOrder, getNextOrderNumber } from "@/lib/orders";
import { sendOrderEmailAlert, sendOrderWhatsAppAlert } from "@/lib/notifications";

// Same signature check as /api/razorpay/verify. Re-verified here,
// server-side, because the client's "payment succeeded" callback can never
// be trusted on its own — someone could hit this endpoint directly with
// paymentMethod "COD" and fake codAdvance fields, skipping the actual
// Razorpay popup entirely. This is what actually stops a fake COD order
// from being created, not the checkout page UI.
function isValidRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return false;
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expectedSignature === razorpay_signature;
}

// POST /api/orders — create a new order (COD or paid)
export async function POST(req) {
  try {
    const payload = await req.json();
    const { razorpay: fullPaymentRazorpay, ...rest } = payload;

    let razorpayInfo = null;

    // COD orders are accepted directly — no advance payment required.
    // The full order amount is collected in cash on delivery.
    if (payload.paymentMethod !== "COD" && fullPaymentRazorpay) {
      if (
        !isValidRazorpaySignature(
          fullPaymentRazorpay.razorpay_order_id,
          fullPaymentRazorpay.razorpay_payment_id,
          fullPaymentRazorpay.razorpay_signature
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Payment could not be verified. Please contact support.",
          },
          { status: 400 }
        );
      }
      razorpayInfo = { type: "full_payment", ...fullPaymentRazorpay };
    }

    const order = {
      id: uuidv4(),
      orderNumber: await getNextOrderNumber(),
      createdAt: new Date().toISOString(),
      // COD orders show as "pending" until cash is collected on delivery.
      // Prepaid (Razorpay) orders show as "paid" immediately since the
      // signature has already been verified above.
      status: payload.paymentMethod === "COD" ? "pending" : "paid",
      ...rest,
      razorpay: razorpayInfo,
    };

    // Push the order to Shiprocket so it shows up on the Shiprocket
    // dashboard and can be assigned a courier / AWB there.
    //
    // IMPORTANT: this must never block or fail the customer's order — if
    // Shiprocket is down or misconfigured, the order is still saved and
    // the customer still sees "order placed". We just record the failure
    // on the order so it can be reviewed from /admin/orders.
    try {
      const shiprocketResponse = await createShiprocketOrder(order);
      order.shiprocket = {
        synced: true,
        shipment_id: shiprocketResponse.shipment_id,
        shiprocket_order_id: shiprocketResponse.order_id,
        status: shiprocketResponse.status,
      };
    } catch (shiprocketErr) {
      console.error("Shiprocket sync failed for order", order.id, shiprocketErr);
      order.shiprocket = {
        synced: false,
        error: shiprocketErr.message,
      };
    }

    await addOrder(order);

    // Notify the store owner — email + WhatsApp. Same rule as Shiprocket
    // above: these must NEVER fail or delay the customer's order. Each is
    // wrapped separately so one failing (e.g. email misconfigured) doesn't
    // stop the other from sending.
    try {
      await sendOrderEmailAlert(order);
    } catch (emailErr) {
      console.error("Order email alert failed:", emailErr.message);
    }

    try {
      await sendOrderWhatsAppAlert(order);
    } catch (waErr) {
      console.error("Order WhatsApp alert failed:", waErr.message);
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order save failed:", err);
    return NextResponse.json(
      { success: false, error: "Could not save order" },
      { status: 500 }
    );
  }
}

// NOTE: There used to be a GET handler here returning every order,
// unauthenticated — anyone who knew the URL could see all customers' names,
// phone numbers, and addresses. That's been removed. To view orders, log in
// at /admin/orders instead (password-protected via ADMIN_PASSWORD).
