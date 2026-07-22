export const metadata = {
  title: "Contact Us — meziva",
};

export default function ContactUsPage() {
  return (
    <div className="container-x py-16 max-w-2xl">
      <h1 className="section-heading mb-4">Contact Us</h1>
      <p className="text-sm text-charcoal/70 mb-10">
        Have a question about an order, a product, or anything else? We're
        happy to help.
      </p>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <span className="text-xs uppercase tracking-widest2 text-charcoal/50 w-24 shrink-0 pt-0.5">
            Email
          </span>
          <a
            href="mailto:support@meziva.in"
            className="text-sm font-medium underline"
          >
            support@meziva.in
          </a>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-xs uppercase tracking-widest2 text-charcoal/50 w-24 shrink-0 pt-0.5">
            Phone
          </span>
          <a href="tel:+919999999999" className="text-sm font-medium underline">
            +91 9217912201
          </a>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-xs uppercase tracking-widest2 text-charcoal/50 w-24 shrink-0 pt-0.5">
            Hours
          </span>
          <p className="text-sm text-charcoal/70">
            Monday – Saturday, 10:00 AM – 6:00 PM IST
          </p>
        </div>
      </div>
    </div>
  );
}
