"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalQty, setMiniCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-charcoal/10">
      <div className="container-x flex items-center justify-between h-20">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-charcoal"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </button>

        <Link
          href="/"
          className="relative w-[130px] h-[44px] text-2xl tracking-widest2 text-charcoal"
        >
          <Image
            src="/images/meziva-logo-final.png"
            alt="meziva"
            fill
            sizes="140px"
            className="object-contain"
          />
        </Link>

        <nav className="hidden md:flex gap-12">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium uppercase tracking-widest2 text-charcoal/80 hover:text-wine transition-colors duration-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMiniCartOpen(true)}
          className="relative text-charcoal hover:text-wine transition-colors duration-300"
          aria-label="Open cart"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 7h12l-1 12H7L6 7Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9 7a3 3 0 1 1 6 0"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-wine text-white text-[11px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col border-t border-charcoal/10 bg-cream">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-5 py-5 text-base font-medium uppercase tracking-widest2 text-charcoal border-b border-charcoal/5 hover:text-wine transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}