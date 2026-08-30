"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";
import { placeOrder } from "@/lib/api";
import { DISH_IMAGES } from "@/lib/images";

export default function CartPage() {
  const router = useRouter();
  const { lines, changeQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [payMethod, setPayMethod] = useState<"cash" | "online" | "bkash">("cash");
  const [placing, setPlacing] = useState(false);

  const discount = Math.round(subtotal * 0.2);
  const total = subtotal + (lines.length > 0 ? 40 : 0) - discount;

  async function handlePlaceOrder() {
    if (!user) {
      router.push("/login");
      return;
    }
    if (lines.length === 0) return;
    setPlacing(true);
    try {
      await placeOrder({
        chefId: lines[0].chefId || "chef-amina",
        deliveryAddress: "Sobhanighat Road, Sylhet",
        items: lines.map((l) => ({ menuItemId: l.menuItemId, quantity: l.quantity })),
        paymentMethod: payMethod,
        paymentMeta:
          payMethod === "bkash" ? { bkashNumber: "01812345678" } : { cardNumber: "4111111111111111" },
        discount,
      });
    } catch (err) {
      console.warn("API order placement fallback mode:", err);
    } finally {
      clearCart();
      setPlacing(false);
      router.push("/tracking");
    }
  }

  if (lines.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-5 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-sm text-sage-700 mb-6">Browse recipes or chefs nearby and add something delicious.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/recipes" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-apricot shadow-sm hover:bg-apricot-dark">
            Explore recipes
          </Link>
          <Link href="/chefs" className="px-5 py-2.5 rounded-full text-sm font-semibold border border-sage-200 hover:bg-sage-100">
            Browse chefs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold">Your cart ({lines.length} item{lines.length === 1 ? "" : "s"})</h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sage-100 text-berry hover:bg-sage-200 transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3">
          {lines.map((item) => {
            const itemTotal = item.price * item.quantity;
            return (
              <div key={item.menuItemId} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-sage-200 hover:shadow-sm transition-all">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center bg-sage-100 flex-shrink-0">
                  <img
                    src={DISH_IMAGES[String(item.menuItemId)] || DISH_IMAGES.default}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs mb-1 text-sage-700">from {item.chefName}</p>
                  <p className="text-sm font-semibold text-sage-900">
                    ৳{item.price} × {item.quantity} = <span className="font-bold text-emerald-700">৳{itemTotal}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-sage-100 p-1 rounded-xl border border-sage-200">
                    <button
                      onClick={() => changeQuantity(item.menuItemId, -1)}
                      className="w-7 h-7 rounded-full font-bold bg-sage-100 text-sage-900 border border-sage-300"
                      title="Decrease quantity"
                    >
                      –
                    </button>
                    <span className="text-xs w-4 text-center font-bold text-sage-900">{item.quantity}</span>
                    <button
                      onClick={() => changeQuantity(item.menuItemId, 1)}
                      className="w-7 h-7 rounded-full font-bold bg-sage-100 text-sage-900 border border-sage-300"
                      title="Add / Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.menuItemId)}
                    className="p-2 rounded-xl text-xs text-berry hover:bg-red-50 transition-colors"
                    title="Delete item from cart"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="rounded-2xl p-5 h-fit bg-white border border-sage-200">
          <h3 className="font-display text-lg font-semibold mb-4">Order summary</h3>
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Delivery fee</span>
            <span>৳40</span>
          </div>
          <div className="flex justify-between text-sm mb-1 text-apricot-dark">
            <span>FIRSTBITE20</span>
            <span>-৳{discount}</span>
          </div>
          <div className="flex justify-between font-bold text-base mb-5 pt-2 border-t border-sage-200">
            <span>Total</span>
            <span>৳{total}</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-sage-700">
            Payment method
          </p>
          <div className="flex gap-2 mb-5">
            {(["cash", "online", "bkash"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setPayMethod(m)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold border ${payMethod === m ? "border-sage-400" : "border-sage-200"
                  }`}
              >
                {m === "cash" ? "Cash" : m === "online" ? "Card" : "bKash"}
              </button>
            ))}
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-apricot disabled:opacity-50"
          >
            {placing ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </div>
    </main>
  );
}
