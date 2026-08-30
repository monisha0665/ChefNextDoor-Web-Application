"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import ChefCard from "@/components/ChefCard";
import PromoBanner from "@/components/PromoBanner";
import AnimatedHeroFood from "@/components/AnimatedHeroFood";
import type { Chef } from "@/lib/types";
import { CHEF_IMAGES } from "@/lib/images";

const trendingChefs: Chef[] = [
  { chef_id: "1", name: "Chef Amina's Kitchen", specialty: "Bengali", status: "active", rating_avg: 4.9, image_url: CHEF_IMAGES["1"] },
  { chef_id: "2", name: "Wei's Wok Corner", specialty: "Chinese", status: "active", rating_avg: 4.7, image_url: CHEF_IMAGES["2"] },
  { chef_id: "3", name: "Tania's Bakehouse", specialty: "Bakery", status: "active", rating_avg: 4.8, image_url: CHEF_IMAGES["3"] },
];

const trendingFoods = [
  { id: 901, name: "Burger", price: 350, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", rating: 4.8, chefName: "Chef Grill" },
  { id: 902, name: "Shutki Vorta", price: 150, image: "https://cdx.dhakamail.com/media/images/2023May/vorta2-20230501142349.jpg", rating: 4.9, chefName: "Chef Amina's Kitchen" },
  { id: 903, name: "Mutton Curry", price: 450, image: "https://myfoodstory.com/wp-content/uploads/2016/12/Easy-Mutton-Curry-1.jpg", rating: 4.9, chefName: "Rahim's Rooti House" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { addToCart, changeQuantity, lines } = useCart();
  const [justAdded, setJustAdded] = useState<number | null>(null);

  function handleAdd(food: any) {
    addToCart({
      menuItemId: food.id,
      name: food.name,
      price: food.price,
      chefId: "trending-chef",
      chefName: food.chefName,
    });
    setJustAdded(food.id);
    setTimeout(() => setJustAdded(null), 1200);
  }

  function quantityFor(id: number) {
    return lines.find((l) => l.menuItemId === id)?.quantity ?? 0;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/chefs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/chefs");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-5">
      <div className="grid md:grid-cols-2 gap-10 items-center pt-14 pb-16">
        <div>
          <span className="inline-block text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-5 bg-sage-200 text-sage-700">
            Trusted by 12,400+ neighbours in Sylhet
          </span>
          <h1 className="font-display text-5xl leading-[1.05] font-semibold mb-5 text-sage-900">
            Your next favorite meal might be cooking next door.
          </h1>
          <p className="text-lg mb-7 text-sage-700">
            ChefNextDoor connects you with home chefs nearby — real recipes, real stories,
            delivered warm.
          </p>
          <form onSubmit={handleSearch} className="flex gap-3 p-2 rounded-2xl mb-4 bg-white border border-sage-200 shadow-sm focus-within:ring-2 focus-within:ring-sage-400 transition-all">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chef, cuisine, or area — e.g. Amina, Bengali, Zindabazar"
              className="flex-1 px-3 py-2 outline-none bg-transparent text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-semibold text-sm text-white bg-sage-700 hover:bg-sage-800 transition-colors flex items-center gap-1.5"
            >
              🔍 Find chefs
            </button>
          </form>
          <div className="flex items-center gap-5 text-sm text-sage-700">
            <div>⭐ <b>4.8</b> avg rating</div>
            <div>🚴 <b>28 min</b> avg delivery</div>
            <div>👩‍🍳 <b>340+</b> home chefs</div>
          </div>
        </div>

        <AnimatedHeroFood />
      </div>

      {/* Trending Food Section */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-semibold">Trending food this week</h2>
        <Link href="/recipes" className="text-sm font-semibold text-sage-700 hover:underline">
          See all recipes →
        </Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-5 mb-16">
        {trendingFoods.map((food) => {
          const qty = quantityFor(food.id);
          return (
            <div key={food.id} className="rounded-2xl overflow-hidden bg-white border border-sage-200 flex flex-col hover:shadow-md transition-shadow">
              <div className="h-44 relative bg-sage-200 overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm">{food.name}</p>
                  <span className="text-xs font-semibold text-sage-700 whitespace-nowrap">⭐ {food.rating}</span>
                </div>
                <p className="text-xs text-sage-700 mb-1">Highly rated by customers this week.</p>
                <p className="text-xs text-sage-700 mb-3">by {food.chefName}</p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="font-semibold text-sm">৳{food.price}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => handleAdd(food)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors shadow-sm ${justAdded === food.id ? "bg-emerald-600" : "bg-apricot hover:bg-apricot-dark"
                        }`}
                    >
                      {justAdded === food.id ? "Added ✓" : "+ Add to cart"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-sage-100 px-2.5 py-1 rounded-xl border border-sage-200">
                      <button
                        onClick={() => changeQuantity(food.id, -1)}
                        className="w-6 h-6 rounded-full font-bold bg-white text-sage-900 flex items-center justify-center text-xs shadow-sm hover:bg-sage-200"
                        title="Decrease quantity"
                      >
                        –
                      </button>
                      <span className="text-xs w-4 text-center font-bold text-sage-900">{qty}</span>
                      <button
                        onClick={() => changeQuantity(food.id, 1)}
                        className="w-6 h-6 rounded-full font-bold text-white bg-sage-800 hover:bg-emerald-600 flex items-center justify-center text-xs shadow-sm"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-semibold">Trending this week</h2>
        <Link href="/chefs" className="text-sm font-semibold text-sage-700 hover:underline">
          See all chefs →
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mb-16">
        {trendingChefs.map((c) => (
          <ChefCard key={c.chef_id} chef={c} badge={c.chef_id === "1" ? "15% off today" : undefined} />
        ))}
      </div>

      <PromoBanner />
    </main>
  );
}

