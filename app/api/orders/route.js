import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// NOTE: This is a minimal file-based order store for demo purposes only.
// In production, replace this with a real database (Postgres, MongoDB, etc).
// On most serverless hosts the filesystem is not persistent/writable —
// see the Hostinger notes for how this behaves there.

const ORDERS_FILE = path.join(process.cwd(), "orders.json");

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
