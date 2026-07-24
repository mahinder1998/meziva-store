// Orders now live in MySQL — see db/schema.sql for the table structure.
//
// This replaces the old file-based orders.json approach, which had a
// serious risk on GitHub-deploy hosting: since orders.json was intentionally
// gitignored (it holds customer PII), every redeploy rebuilt the app from a
// fresh git checkout and wiped out any orders written since the last
// deploy. A real database persists independently of deploys/redeploys.
import { query, toMySQLDatetime } from "@/lib/db";

function mapOrderRow(row) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    status: row.status,
    paymentMethod: row.payment_method,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      address: row.customer_address,
      city: row.customer_city,
      state: row.customer_state,
      pincode: row.customer_pincode,
    },
    items: row.items || [],
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    razorpay: row.razorpay || null,
    shiprocket: row.shiprocket || null,
  };
}

export async function getAllOrders() {
  const rows = await query("SELECT * FROM orders ORDER BY order_number ASC");
  return rows.map(mapOrderRow);
}

export async function addOrder(order) {
  await query(
    `INSERT INTO orders
      (id, order_number, created_at, status, payment_method,
       customer_name, customer_email, customer_phone, customer_address,
       customer_city, customer_state, customer_pincode,
       items, subtotal, shipping, total, razorpay, shiprocket)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.id,
      order.orderNumber,
      toMySQLDatetime(order.createdAt),
      order.status,
      order.paymentMethod,
      order.customer?.name || null,
      order.customer?.email || null,
      order.customer?.phone || null,
      order.customer?.address || null,
      order.customer?.city || null,
      order.customer?.state || null,
      order.customer?.pincode || null,
      JSON.stringify(order.items || []),
      order.subtotal ?? 0,
      order.shipping ?? 0,
      order.total ?? 0,
      order.razorpay ? JSON.stringify(order.razorpay) : null,
      order.shiprocket ? JSON.stringify(order.shiprocket) : null,
    ]
  );
  return order;
}

// Human-friendly sequential order number (#101, #102, ...).
const STARTING_ORDER_NUMBER = 101;

export async function getNextOrderNumber() {
  const rows = await query("SELECT MAX(order_number) AS maxNum FROM orders");
  const highest = rows[0]?.maxNum;
  return (highest || STARTING_ORDER_NUMBER - 1) + 1;
}
