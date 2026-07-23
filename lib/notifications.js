import nodemailer from "nodemailer";
import { formatPrice } from "@/data/products";

// ---------------------------------------------------------------------
// EMAIL ALERT
// ---------------------------------------------------------------------
// Uses plain SMTP so it works with ANY provider — your own domain email
// (e.g. support@meziva.in via Hostinger's Email hosting), Gmail (with an
// App Password, not your normal password), or any transactional email
// service that gives you SMTP credentials.
//
// Required env vars (see .env.example):
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, ADMIN_NOTIFY_EMAIL
let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null; // not configured — caller should skip sending
  }

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587/others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return cachedTransporter;
}

function buildOrderSummaryText(order) {
  const itemLines = (order.items || [])
    .map((item) => `  • ${item.name}${item.size ? ` (${item.size})` : ""} × ${item.qty} — ${formatPrice(item.price * item.qty)}`)
    .join("\n");

  return [
    `New order placed on meziva.in`,
    ``,
    `Order #${order.orderNumber || "—"} (ref: ${order.id})`,
    `Payment: ${order.paymentMethod} (${order.status})`,
    `Total: ${formatPrice(order.total)}`,
    ``,
    `Customer: ${order.customer?.name}`,
    `Phone: ${order.customer?.phone}`,
    `Email: ${order.customer?.email}`,
    `Address: ${order.customer?.address}, ${order.customer?.city}, ${order.customer?.state} - ${order.customer?.pincode}`,
    ``,
    `Items:`,
    itemLines,
    ``,
    `View full details: https://meziva.in/admin/orders`,
  ].join("\n");
}

export async function sendOrderEmailAlert(order) {
  const transporter = getTransporter();
  const to = process.env.ADMIN_NOTIFY_EMAIL;

  if (!transporter || !to) {
    throw new Error(
      "Email alert not configured — missing SMTP_HOST/SMTP_USER/SMTP_PASSWORD or ADMIN_NOTIFY_EMAIL"
    );
  }

  await transporter.sendMail({
    from: `"meziva Orders" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Order #${order.orderNumber || ""} — ${formatPrice(order.total)} (${order.paymentMethod})`,
    text: buildOrderSummaryText(order),
  });
}

// ---------------------------------------------------------------------
// WHATSAPP ALERT (via CallMeBot — free, personal-use API)
// ---------------------------------------------------------------------
// Setup (one-time, ~2 minutes):
//   1. Save +34 644 91 96 80 (CallMeBot's number) to your phone contacts.
//   2. From YOUR WhatsApp, message that contact: "I allow callmebot to send me messages"
//   3. Within ~2 min you'll get a reply with your APIKEY.
//   4. Put that key + your own WhatsApp number (with country code) below.
//
// Required env vars (see .env.example):
//   WHATSAPP_NOTIFY_PHONE (e.g. +919999999999), CALLMEBOT_API_KEY
//
// Note: this is a free personal-use API meant for self-notifications (i.e.
// alerting yourself, the store owner) — not for messaging customers. For
// customer-facing WhatsApp (order confirmations, shipping updates), you'd
// need an official provider like Meta's WhatsApp Cloud API or Twilio.
export async function sendOrderWhatsAppAlert(order) {
  const phone = process.env.WHATSAPP_NOTIFY_PHONE;
  const apikey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apikey) {
    throw new Error(
      "WhatsApp alert not configured — missing WHATSAPP_NOTIFY_PHONE or CALLMEBOT_API_KEY"
    );
  }

  const itemsSummary = (order.items || [])
    .map((item) => `${item.name} x${item.qty}`)
    .join(", ");

  const message = [
    `🛍️ New Order #${order.orderNumber || "—"} — ${formatPrice(order.total)}`,
    `${itemsSummary}`,
    `Customer: ${order.customer?.name} (${order.customer?.phone})`,
    `Payment: ${order.paymentMethod}`,
  ].join("\n");

  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(message)}` +
    `&apikey=${encodeURIComponent(apikey)}`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok || /error/i.test(text)) {
    throw new Error(`CallMeBot request failed: ${text.slice(0, 200)}`);
  }
}
