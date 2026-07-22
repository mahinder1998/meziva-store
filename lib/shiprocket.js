// Shiprocket integration.
// Docs: https://apidocs.shiprocket.in/
//
// Required env vars (see .env.example):
//   SHIPROCKET_EMAIL
//   SHIPROCKET_PASSWORD
//   SHIPROCKET_PICKUP_LOCATION   — the exact "Pickup location" nickname you
//                                  set under Shiprocket > Settings > Pickup
//                                  Addresses (NOT your company name/address,
//                                  the short nickname Shiprocket assigns).
//
// NOTE ON THE TOKEN CACHE: Shiprocket's auth token is valid for ~10 days.
// This in-memory cache works fine as long as your server process stays
// alive (a normal Node/VPS server does). On serverless platforms (Vercel,
// etc.) each cold start loses this cache and simply logs in again — that's
// fine, Shiprocket doesn't rate-limit login calls aggressively. If you
// outgrow this, cache the token in your database/Redis instead.

const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let cachedToken = null;
let cachedTokenExpiry = 0;

async function getShiprocketToken() {
  if (cachedToken && Date.now() < cachedTokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    throw new Error(
      `Shiprocket auth failed: ${data.message || res.statusText}`
    );
  }

  cachedToken = data.token;
  // Token is valid ~10 days server-side; refresh a little early to be safe.
  cachedTokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;

  return cachedToken;
}

// Maps our internal order object -> Shiprocket's "create adhoc order"
// payload and pushes it to Shiprocket.
// Returns Shiprocket's response (shipment_id, order_id, status, ...) or
// throws on failure — the caller decides whether that should block the
// customer-facing order or just be logged.
export async function createShiprocketOrder(order) {
  const token = await getShiprocketToken();

  const nameParts = (order.customer?.name || "Customer").trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || firstName;

  const orderDate = (order.createdAt || new Date().toISOString())
    .slice(0, 16)
    .replace("T", " ");

  const payload = {
    order_id: order.id,
    order_date: orderDate,
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: order.customer?.address,
    billing_city: order.customer?.city,
    billing_pincode: order.customer?.pincode,
    billing_state: order.customer?.state,
    billing_country: "India",
    billing_email: order.customer?.email,
    billing_phone: order.customer?.phone,
    shipping_is_billing: true,
    order_items: (order.items || []).map((item) => ({
      name: `${item.name}${item.size ? ` (${item.size})` : ""}`,
      sku: item.key || item.id,
      units: item.qty,
      selling_price: item.price,
    })),
    payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: order.subtotal,
    // Package dimensions in cm / weight in kg — these are rough defaults.
    // For accurate shipping rates, store real dimensions/weight per SKU in
    // data/products.js and compute per-order totals here instead.
    length: 20,
    breadth: 15,
    height: 10,
    weight: 0.5,
  };

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `Shiprocket order creation failed: ${data.message || res.statusText}`
    );
  }

  return data;
}
