import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy — Meziva Beauty",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updatedDate="July 2026">
      <p>
        This Privacy Policy explains how Meziva Beauty ("we", "us", "our")
        collects, uses, and protects the personal information you share
        with us when you visit or make a purchase from this website.
      </p>

      <section>
        <h2>Information We Collect</h2>
        <p>
          When you place an order, we collect your name, email address,
          phone number, shipping address, and payment details necessary to
          process your order. Payment information (card/UPI/netbanking
          details) is processed directly by our payment partner, Razorpay,
          and is never stored on our servers.
        </p>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information you provide to process and deliver your
          orders, communicate order updates, respond to customer service
          requests, and — where you've consented — send you updates about
          new products and offers.
        </p>
      </section>

      <section>
        <h2>Sharing Your Information</h2>
        <p>
          We share order details with our logistics partner (Shiprocket)
          solely to fulfil and deliver your order, and with our payment
          partner (Razorpay) to process payments. We do not sell your
          personal information to third parties.
        </p>
      </section>

      <section>
        <h2>Cookies & Analytics</h2>
        <p>
          We use cookies and similar technologies (via Google Tag Manager
          and Google Analytics) to understand how visitors use our site —
          for example, which pages are viewed and how customers move from
          product pages to checkout — so we can improve the shopping
          experience. This data is aggregated and does not personally
          identify you.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>
          You can request access to, correction of, or deletion of your
          personal data at any time by contacting us at{" "}
          <a href="mailto:support@meziva.in">support@meziva.in</a>.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will
          be posted on this page with an updated revision date.
        </p>
      </section>
    </LegalPageLayout>
  );
}
