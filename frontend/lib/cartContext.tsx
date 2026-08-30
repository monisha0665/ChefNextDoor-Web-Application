"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartLine {
  menuItemId: string | number;
  name: string;
  price: number;
  chefId: string;
  chefName: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  addToCart: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  changeQuantity: (menuItemId: string | number, delta: number) => void;
  removeFromCart: (menuItemId: string | number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "chefnextdoor_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt local storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function addToCart(item: Omit<CartLine, "quantity">, qty = 1) {
    setLines((prev) => {
      const existing = prev.find((l) => l.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((l) => (l.menuItemId === item.menuItemId ? { ...l, quantity: l.quantity + qty } : l));
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }

  function changeQuantity(menuItemId: number, delta: number) {
    setLines((prev) =>
      prev
        .map((l) => (l.menuItemId === menuItemId ? { ...l, quantity: Math.max(0, l.quantity + delta) } : l))
        .filter((l) => l.quantity > 0),
    );
  }

  function removeFromCart(menuItemId: number) {
    setLines((prev) => prev.filter((l) => l.menuItemId !== menuItemId));
  }

  function clearCart() {
    setLines([]);
  }

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.price, 0);

  return (
    <CartContext.Provider
      value={{ lines, addToCart, changeQuantity, removeFromCart, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
