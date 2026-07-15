export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-24">
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-serif text-2xl tracking-widest2 mb-4">LUXE</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Modern luxury, made to last. Crafted in small batches, built for
            years of daily use.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest2 mb-4 text-white/80">
            Shop
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Timepieces</li>
            <li>Leather Goods</li>
            <li>Fragrance</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest2 mb-4 text-white/80">
            Support
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>Shipping & Returns</li>
            <li>Track Order</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest2 mb-4 text-white/80">
            Payments
          </h4>
          <p className="text-sm text-white/60">
            Razorpay (Cards / UPI / Netbanking) & Cash on Delivery accepted.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} LUXE. All rights reserved.
      </div>
    </footer>
  );
}
