import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createShiprocketOrder } from "@/lib/shiprocket";

// NOTE: This is a minimal file-based order store for demo purposes only.
// In production, replace this with a real database (Postgres, MongoDB, etc).
// On most serverless hosts the filesystem is not persistent/writable —
// see the Hostinger notes for how this behaves there.

const ORDERS_FILE = path.join(process.cwd(), "orders.json");
console.log("Orders will be saved at:", ORDERS_FILE); // TEMP — hata dena baad me

async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// POST /api/orders — create a new order (COD or paid)
export async function POST(req) {
  try {
    const payload = await req.json();

    const order = {
      id: uuidv4(),
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
    // on the order so it can be retried/pushed manually from /admin later.
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

    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Order save failed:", err);
    return NextResponse.json(
      { success: false, error: "Could not save order" },
      { status: 500 }
    );
  }
}

// GET /api/orders — list orders (e.g. for a simple admin view)
export async function GET() {
  const orders = await readOrders();
  return NextResponse.json({ orders });
}
