export const metadata = {
  title: "Refund & Return Policy — meziva",
};

export default function RefundPolicyPage() {
  return (
    <div className="container-x py-16 max-w-3xl">
      <h1 className="section-heading mb-8">Refund &amp; Return Policy</h1>

      <div className="space-y-6 text-sm text-charcoal/70 leading-relaxed">
        <section>
          <h2 className="text-charcoal font-medium mb-2">Return Window</h2>
          <p>
            We accept returns within 7 days of delivery, provided the
            product is unused, in its original packaging, and accompanied by
            the invoice. Certain categories (e.g. opened cosmetics/personal
            care items) may not be eligible for return due to hygiene
            reasons unless the item arrived damaged or defective.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">
            How to Request a Return
          </h2>
          <p>
            Email{" "}
            <a href="mailto:support@meziva.in" className="underline">
              support@meziva.in
            </a>{" "}
            with your order ID and reason for return. Our team will guide
            you through pickup or drop-off, depending on your location.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">Refunds</h2>
          <p>
            Once the returned item is received and inspected, refunds are
            processed within 5–7 business days to the original payment
            method (for prepaid/Razorpay orders) or via bank transfer/UPI
            (for Cash on Delivery orders, where account details will be
            requested).
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">
            Damaged or Wrong Item Received
          </h2>
          <p>
            If you receive a damaged, defective, or incorrect product,
            please contact us within 48 hours of delivery with photos of the
            item and packaging. We'll arrange a free replacement or full
            refund — no return shipping cost to you in this case.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">
            Non-Returnable Items
          </h2>
          <p>
            Items marked "final sale," gift cards, and used/opened personal
            care products (unless defective) are not eligible for return or
            refund.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">Order Cancellation</h2>
          <p>
            Orders can be cancelled free of charge before they are shipped.
            Once an order has been handed to our courier partner, it cannot
            be cancelled — you're welcome to initiate a return instead once
            delivered.
          </p>
        </section>

        <p className="text-xs text-charcoal/40 pt-4">
          Last updated: July 2026
        </p>
      </div>
    </div>
  );
}
