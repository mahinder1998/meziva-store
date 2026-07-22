// Google Tag Manager helper.
//
// GTM_ID is the container ID shown in your GTM dashboard install snippet
// (Admin > Install Google Tag Manager). Replace it if you ever create a
// new container.
export const GTM_ID = "GTM-TQMFKQ2K";

// Safely push an event to the dataLayer. Works even before GTM has fully
// loaded, since window.dataLayer is initialised by the GTM snippet itself
// as an array — this just guards against calling it before that snippet
// has run (e.g. very early client-side code).
export function pushToDataLayer(data) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

// Formats a cart/order line item into the shape GA4 ecommerce events expect.
// `price` in this store is stored in whole rupees (see formatPrice in
// data/products.js), so no /100 conversion is needed here.
export function toGA4Item(item, index = 0) {
  return {
    item_id: item.id,
    item_name: item.name,
    item_variant: item.size,
    price: item.price,
    quantity: item.qty || 1,
    index,
  };
}
