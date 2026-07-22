export const metadata = {
  title: "Shipping Policy — meziva",
};

export default function ShippingPolicyPage() {
  return (
    <div className="container-x py-16 max-w-3xl">
      <h1 className="section-heading mb-8">Shipping Policy</h1>

      <div className="space-y-6 text-sm text-charcoal/70 leading-relaxed">
        <section>
          <h2 className="text-charcoal font-medium mb-2">
            Order Processing Time
          </h2>
          <p>
            Orders are processed within 1–2 business days of confirmation.
            You'll receive an email/SMS once your order has been packed and
            handed over to our courier partner.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">Delivery Time</h2>
          <p>
            Once shipped, orders are typically delivered within 3–7 business
            days depending on your location. Metro cities usually receive
            orders faster; remote areas may take slightly longer.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">Shipping Charges</h2>
          <p>
            We offer free shipping on all prepaid and COD orders above the
            threshold shown at checkout. Orders below that amount are
            charged a flat shipping fee, calculated automatically at
            checkout.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">
            Order Tracking
          </h2>
          <p>
            Once your order is shipped, you'll receive a tracking link via
            email/SMS so you can follow your package until it's delivered.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">
            Delays & Undeliverable Addresses
          </h2>
          <p>
            Occasionally, deliveries may be delayed due to courier
            constraints, weather, or regional restrictions beyond our
            control. If a package is returned to us as undeliverable (e.g.
            incorrect address or repeated failed delivery attempts), we will
            contact you to arrange re-shipping, which may involve an
            additional shipping charge.
          </p>
        </section>

        <section>
          <h2 className="text-charcoal font-medium mb-2">Need Help?</h2>
          <p>
            For any shipping-related questions, reach us at{" "}
            <a href="mailto:support@meziva.in" className="underline">
              support@meziva.in
            </a>{" "}
            or call us — details on our{" "}
            <a href="/contact-us" className="underline">
              Contact Us
            </a>{" "}
            page.
          </p>
        </section>

        <p className="text-xs text-charcoal/40 pt-4">
          Last updated: July 2026
        </p>
      </div>
    </div>
  );
}
