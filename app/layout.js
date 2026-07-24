import "./globals.css";
import { Suspense } from "react";
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

export const metadata = {
  title: "meziva Beauty — Hydrating Lip Balms with SPF 30",
  description:
    "Cherry Blast and Berry Blast Hydrating Lip Balms — real fruit extracts, Vitamin E, and SPF 30 protection for soft, naturally tinted lips.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManagerHead />
        <FacebookPixelHead />
      </head>
      <body className="font-sans antialiased">
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