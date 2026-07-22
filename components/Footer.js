import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="container-x py-8 flex justify-center  gap-10 md:gap-20">
        {/* <div>
          <h3 className="text-2xl tracking-widest2 mb-4">meziva</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Modern luxury, made to last.
          </p>
        </div> */}

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest2 mb-4 text-white/80">
            Policies
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-white">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-white">
                Refund &amp; Return Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest2 mb-4 text-white/80">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <Link href="/contact-us" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              {/* <a href="tel:+919999999999" className="hover:text-white">
                +91 99999 99999
              </a> */}
            </li>
            <li>
              <a href="mailto:support@meziva.in" className="hover:text-white">
                support@meziva.in
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-4 mt-6">
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white/60 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.94 8.44-9.94Z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/60 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.96.04-1.48.2-1.82.33-.46.18-.78.39-1.13.73-.34.35-.55.67-.73 1.13-.13.34-.29.86-.33 1.82C3.21 8.5 3.2 8.86 3.2 12s.01 3.5.07 4.74c.04.96.2 1.48.33 1.82.18.46.39.78.73 1.13.35.34.67.55 1.13.73.34.13.86.29 1.82.33 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.96-.04 1.48-.2 1.82-.33.46-.18.78-.39 1.13-.73.34-.35.55-.67.73-1.13.13-.34.29-.86.33-1.82.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.96-.2-1.48-.33-1.82a2.9 2.9 0 0 0-.73-1.13 2.9 2.9 0 0 0-1.13-.73c-.34-.13-.86-.29-1.82-.33C15.5 4.01 15.14 4 12 4Zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.8-2a1.08 1.08 0 1 1 0 2.16 1.08 1.08 0 0 1 0-2.16Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} meziva. All rights reserved.
      </div>
    </footer>
  );
}
