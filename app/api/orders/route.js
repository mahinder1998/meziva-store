import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { addOrder, getNextOrderNumber } from "@/lib/orders";
import { sendOrderEmailAlert } from "@/lib/notifications";

// POST /api/orders — create a new order (COD or paid)
export async function POST(req) {
  try {
    const payload = await req.json();

    const order = {
      id: uuidv4(),
      orderNumber: await getNextOrderNumber(),
      createdAt: new Date().toISOString(),
      status: payload.paymentMethod === "COD" ? "pending" : "paid",
      ...payload,
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

    // Notify the store owner by email. Same rule as Shiprocket above: this
    // must NEVER fail or delay the customer's order — if email sending is
    // down or misconfigured, the order is still saved and the customer
    // still sees "order placed".
    try {
      await sendOrderEmailAlert(order);
    } catch (emailErr) {
      console.error("Order email alert failed:", emailErr.message);
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