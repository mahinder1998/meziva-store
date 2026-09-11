import "./globals.css";
import { Suspense } from "react";
import { Fraunces, Roboto } from "next/font/google";

import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MiniCart from "@/components/MiniCart";

import {
  GoogleTagManagerHead,
  GoogleTagManagerBody,
} from "@/components/GoogleTagManager";

import {
  FacebookPixelHead,
  FacebookPixelBody,
} from "@/components/FacebookPixel";

import RouteChangeTracker from "@/components/RouteChangeTracker";


/* =========================================================
   DISPLAY / HEADING FONT
   ========================================================= */

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-fraunces",
  display: "swap",
});


/* =========================================================
   BODY / UI FONT
   ========================================================= */

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  display: "swap",
});

/* =========================================================
   METADATA
   ========================================================= */

export const metadata = {
  title: "Meziva Beauty — Hydrating Lip Balms with SPF 30",

  description:
    "Cherry Blast and Berry Blast Hydrating Lip Balms — real fruit extracts, Vitamin E, and SPF 30 protection for soft, naturally tinted lips.",

  metadataBase: new URL("https://www.meziva.in"),
};


/* =========================================================
   ROOT LAYOUT
   ========================================================= */

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <head>
        <GoogleTagManagerHead />
        <FacebookPixelHead />
      </head>

      <body className="font-sans antialiased bg-cream text-charcoal">
        <GoogleTagManagerBody />
        <FacebookPixelBody />

        <Suspense fallback={null}>
          <RouteChangeTracker />
        </Suspense>

        <CartProvider>
          <Navbar />

          <MiniCart />

          <main className="min-h-screen">
            {children}
          </main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}