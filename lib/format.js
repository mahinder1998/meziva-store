export function formatPrice(paise) {
  // prices stored in whole rupees here for simplicity
  return "₹" + Number(paise).toLocaleString("en-IN");
}
