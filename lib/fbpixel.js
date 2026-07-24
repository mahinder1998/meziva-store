// Facebook Pixel ID — from Meta Events Manager.
export const FB_PIXEL_ID = "901919249291418";

// Safe wrapper around window.fbq — no-ops if the pixel script hasn't
// loaded yet (e.g. called too early, or a browser blocking it) instead of
// throwing and breaking the checkout/cart flow.
export function fbqTrack(event, params) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
