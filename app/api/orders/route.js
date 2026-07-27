import { NextResponse } from "next/server";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { addOrder, getNextOrderNumber } from "@/lib/orders";
import { sendOrderEmailAlert, sendOrderWhatsAppAlert } from "@/lib/notifications";

// COD orders require this much to be paid upfront via Razorpay before the
// order is accepted. This filters out fake/prank COD orders — someone
// entering random details to place a COD order won't bother completing a
// real (if small) payment. The amount is adjusted against the order total,
// not charged extra; the rest is still collected as cash on delivery.
const COD_ADVANCE_AMOUNT = 19;

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
    const { codAdvance, razorpay: fullPaymentRazorpay, ...rest } = payload;

    let razorpayInfo = null;

    if (payload.paymentMethod === "COD") {
      const isValid =
        codAdvance &&
        codAdvance.amount === COD_ADVANCE_AMOUNT &&
        isValidRazorpaySignature(
          codAdvance.razorpay_order_id,
          codAdvance.razorpay_payment_id,
          codAdvance.razorpay_signature
        );

      if (!isValid) {
        return NextResponse.json(
          {
            success: false,
            error:
              "₹19 advance payment could not be verified. Please complete the advance payment to confirm your COD order.",
          },
          { status: 400 }
        );
      }

      razorpayInfo = {
        type: "cod_advance",
        amount: COD_ADVANCE_AMOUNT,
        remaining: Math.max((rest.total ?? 0) - COD_ADVANCE_AMOUNT, 0),
        razorpay_order_id: codAdvance.razorpay_order_id,
        razorpay_payment_id: codAdvance.razorpay_payment_id,
        razorpay_signature: codAdvance.razorpay_signature,
        verifiedAt: new Date().toISOString(),
      };
    } else if (fullPaymentRazorpay) {
      razorpayInfo = { type: "full_payment", ...fullPaymentRazorpay };
    }

    const order = {
      id: uuidv4(),
      orderNumber: await getNextOrderNumber(),
      createdAt: new Date().toISOString(),
      // COD orders still show as "pending" (cash collection / delivery is
      // pending) even though the ₹19 advance has already been verified and
      // captured above — that detail is carried in order.razorpay.
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
