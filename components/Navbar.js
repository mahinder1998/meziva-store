"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { totalQty, setMiniCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu automatically if route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-charcoal/10">
      <div className="container-x flex items-center justify-between h-20">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-charcoal p-1 -ml-1"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <Link
          href="/"
          className="relative w-[120px] h-[40px] md:w-[130px] md:h-[44px] shrink-0"
          aria-label="Meziva Beauty — Home"
        >
          <Image
            src="/images/meziva-logo-final.png"
            alt="Meziva Beauty"
            fill
            sizes="140px"
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex gap-12">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium uppercase tracking-widest2 transition-colors duration-300 pb-1 ${
                  active ? "text-wine" : "text-charcoal/80 hover:text-wine"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute left-0 -bottom-0.5 w-full h-[1.5px] bg-wine" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setMiniCartOpen(true)}
          className="relative text-charcoal hover:text-wine transition-colors duration-300 p-1 -mr-1"
          aria-label={`Open cart, ${totalQty} items`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 7h12l-1 12H7L6 7Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 7a3 3 0 1 1 6 0" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-wine text-white text-[11px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-cream border-t border-charcoal/10 ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-5 py-4 text-base font-medium uppercase tracking-widest2 border-b border-charcoal/5 transition-colors ${
                  active ? "text-wine" : "text-charcoal hover:text-wine"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}