"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalQty, setMiniCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    // { href: "/collection/watches", label: "Timepieces" },
    // { href: "/collection/bags", label: "Leather Goods" },
    // { href: "/collection/fragrance", label: "Fragrance" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white backdrop-blur">
      <div className="container-x flex items-center justify-between h-20">
        {/* Mobile menu button */}
        {/* <button
          className="md:hidden text-charcoal"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button> */}

        <Link
          href="/"
          className=" text-2xl tracking-widest2 text-charcoal"
        >
          <Image
            src="https://meziva.sirv.com/Images/meziva-logo-final.png"
            alt="meziva"
            fill
            sizes="130px"
            className="object-contain !relative"
          />
        </Link>

        <nav className="hidden md:flex gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-widest2 text-charcoal hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMiniCartOpen(true)}
          className="relative text-charcoal"
          aria-label="Open cart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
            <span className="absolute -top-2 -right-2 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col border-t border-black/10 bg-cream">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-5 py-4 text-xs uppercase tracking-widest2 border-b border-black/5"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
