import "./globals.css";
import { Suspense } from "react";
import { Fraunces, Manrope } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MiniCart from "@/components/MiniCart";
import {
  GoogleTagManagerHead,
  GoogleTagManagerBody,
} from "@/components/GoogleTagManager";
import { FacebookPixelHead, FacebookPixelBody } from "@/components/FacebookPixel";
import RouteChangeTracker from "@/components/RouteChangeTracker";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "Cambria", "serif"],
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata = {
  title: "Meziva Beauty — Hydrating Lip Balms with SPF 30",
  description:
    "Cherry Blast and Berry Blast Hydrating Lip Balms — real fruit extracts, Vitamin E, and SPF 30 protection for soft, naturally tinted lips.",
  metadataBase: new URL("https://www.meziva.in"),
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable}`}
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
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}