import { promises as fs } from "fs";
import path from "path";

// NOTE: This is a minimal file-based order store for demo purposes only.
// In production, replace this with a real database (Postgres, MySQL, etc).
//
// IMPORTANT — persistence risk: on GitHub-based deploy platforms (including
// Hostinger's Node.js Web Apps), each redeploy typically rebuilds the app
// from a fresh copy of the git repository. Since orders.json is intentionally
// gitignored (it contains customer PII and shouldn't be committed), a
// redeploy MAY wipe out any orders written here since the last deploy.
//
// Test this yourself: place a test order, then trigger any redeploy, then
// check /admin/orders again. If the order is gone, you should migrate this
// to Hostinger's MySQL database (Websites > Databases > MySQL Databases —
// already available on your plan) before relying on this for real orders.
const ORDERS_FILE = path.join(process.cwd(), "orders.json");

export async function getAllOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function addOrder(order) {
  const orders = await getAllOrders();
  orders.push(order);
  await saveOrders(orders);
  return order;
}

// Human-friendly sequential order number (#101, #102, ...) shown to
// customers and in the admin panel. The UUID `id` field remains the real
// internal identifier used for Razorpay/Shiprocket — this is just a
// friendlier label layered on top.
const STARTING_ORDER_NUMBER = 101;

export async function getNextOrderNumber() {
  const orders = await getAllOrders();
  const highest = orders.reduce(
    (max, o) => (o.orderNumber && o.orderNumber > max ? o.orderNumber : max),
    STARTING_ORDER_NUMBER - 1
  );
  return highest + 1;
}
