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
import RouteChangeTracker from "@/components/RouteChangeTracker";

export const metadata = {
  title: "meziva — Modern Luxury, Made to Last",
  description:
    "Timepieces, leather goods, and fragrance crafted for the long term.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManagerHead />
      </head>
      <body className="font-sans antialiased">
        <GoogleTagManagerBody />
        <Suspense fallback={null}>
          <RouteChangeTracker />
        </Suspense>
        <CartProvider>
          <Navbar />
          <MiniCart />
          <main className="min-h-max">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
