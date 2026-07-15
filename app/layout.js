import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MiniCart from "@/components/MiniCart";

export const metadata = {
  title: "LUXE — Modern Luxury, Made to Last",
  description:
    "Timepieces, leather goods, and fragrance crafted for the long term.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
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
