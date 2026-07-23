import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "meziva_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function sign(value) {
  return crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "")
    .update(value)
    .digest("hex");
}

// token format: "<expiryTimestamp>.<hmacSignatureOfExpiry>"
export function createSessionToken() {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiry);
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token) {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);

  // timing-safe comparison so response time can't leak the correct signature
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  return Date.now() < Number(payload);
}

export const ADMIN_COOKIE_MAX_AGE = SESSION_DURATION_MS / 1000;

// Call at the very top of any admin-only server component.
// Redirects to /admin/login if there's no valid session cookie.
export function requireAdminSession() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }
}
