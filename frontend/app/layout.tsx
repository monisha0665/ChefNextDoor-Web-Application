import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/authContext";
import { CartProvider } from "@/lib/cartContext";
import { ChefProvider } from "@/lib/chefContext";
import { FavoritesProvider } from "@/lib/favoritesContext";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "ChefNextDoor — Home-cooked, delivered by neighbours",
  description: "Order real home-cooked food from chefs near you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${jakarta.variable} font-body`}>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <ChefProvider>
                <Navbar />
                {children}
              </ChefProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
