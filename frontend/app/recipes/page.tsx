"use client";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cartContext";
import DownloadableImage from "@/components/DownloadableImage";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favoritesContext";

import { DISH_IMAGES } from "@/lib/images";

// In production, replace with a Supabase query joining tbl_menu_item +
// tbl_category + tbl_chef, e.g.:
//   supabase.from("tbl_menu_item").select("*, tbl_category(name), tbl_chef(chef_id, tbl_profile(name))")
const CUISINES = ["All", "Bengali", "Chinese", "Bakery", "Vegan", "Grill", "Desserts"] as const;
type Cuisine = (typeof CUISINES)[number];

interface Dish {
  menuItemId: number;
  name: string;
  cuisine: Exclude<Cuisine, "All">;
  price: number;
  emoji: string;
  imageUrl?: string;
  desc: string;
  chefId: string;
  chefName: string;
  rating: number;
}

const dishes: Dish[] = [
  { menuItemId: 101, name: "Beef Bhuna", cuisine: "Bengali", price: 280, emoji: "🍛", imageUrl: DISH_IMAGES["101"], desc: "Slow-cooked beef, mustard oil, five-spice.", chefId: "chef-amina", chefName: "Chef Amina's Kitchen", rating: 4.9 },
  { menuItemId: 102, name: "Shorshe Ilish", cuisine: "Bengali", price: 350, emoji: "🐟", imageUrl: DISH_IMAGES["102"], desc: "Hilsa in mustard gravy, served with rice.", chefId: "chef-amina", chefName: "Chef Amina's Kitchen", rating: 4.9 },
  { menuItemId: 103, name: "Rooti & Alu Bhaji", cuisine: "Bengali", price: 120, emoji: "🫓", imageUrl: DISH_IMAGES["103"], desc: "Flatbread with spiced potato curry.", chefId: "chef-rahim", chefName: "Rahim's Rooti House", rating: 4.8 },
  { menuItemId: 201, name: "Wonton Noodle Soup", cuisine: "Chinese", price: 260, emoji: "🍜", imageUrl: DISH_IMAGES["201"], desc: "Hand-folded wontons, clear broth, bok choy.", chefId: "chef-wei", chefName: "Wei's Wok Corner", rating: 4.7 },
  { menuItemId: 202, name: "Chicken Roast", cuisine: "Chinese", price: 300, emoji: "🥡", imageUrl: DISH_IMAGES["202"], desc: "Peanuts, dried chili, Sichuan pepper.", chefId: "chef-wei", chefName: "Wei's Wok Corner", rating: 4.7 },
  { menuItemId: 301, name: "Biriyani", cuisine: "Bakery", price: 220, emoji: "🍞", imageUrl: DISH_IMAGES["301"], desc: "48-hour fermented, crackling crust.", chefId: "chef-tania", chefName: "Tania's Bakehouse", rating: 4.8 },
  { menuItemId: 302, name: "Butter Croissant", cuisine: "Bakery", price: 90, emoji: "🥐", imageUrl: DISH_IMAGES["302"], desc: "Laminated by hand, baked to order.", chefId: "chef-tania", chefName: "Tania's Bakehouse", rating: 4.8 },
  { menuItemId: 401, name: "Green Bowl", cuisine: "Vegan", price: 240, emoji: "🥗", imageUrl: DISH_IMAGES["401"], desc: "Quinoa, roasted chickpeas, tahini dressing.", chefId: "chef-nusrat", chefName: "Green Bowl by Nusrat", rating: 4.6 },
  { menuItemId: 402, name: "Coconut Dal", cuisine: "Vegan", price: 180, emoji: "🍲", imageUrl: DISH_IMAGES["402"], desc: "Red lentils, coconut milk, curry leaf.", chefId: "chef-nusrat", chefName: "Green Bowl by Nusrat", rating: 4.6 },
  { menuItemId: 501, name: "Smoked Beef Ribs", cuisine: "Grill", price: 420, emoji: "🍖", imageUrl: DISH_IMAGES["501"], desc: "6-hour smoke, house BBQ glaze.", chefId: "chef-grill", chefName: "Grill & Chill", rating: 4.5 },
  { menuItemId: 502, name: "Chicken Tikka Skewers", cuisine: "Grill", price: 260, emoji: "🍗", imageUrl: DISH_IMAGES["502"], desc: "Charred over open flame, mint chutney.", chefId: "chef-grill", chefName: "Grill & Chill", rating: 4.5 },
  { menuItemId: 601, name: "Roshogolla", cuisine: "Desserts", price: 60, emoji: "🍡", imageUrl: DISH_IMAGES["601"], desc: "Soft cheese balls in light sugar syrup.", chefId: "chef-amina", chefName: "Chef Amina's Kitchen", rating: 4.9 },
  { menuItemId: 602, name: "Chocolate Fondant", cuisine: "Desserts", price: 150, emoji: "🍫", imageUrl: DISH_IMAGES["602"], desc: "Molten center, vanilla bean ice cream.", chefId: "chef-tania", chefName: "Tania's Bakehouse", rating: 4.8 },
];

export default function RecipesPage() {
  const [activeCuisine, setActiveCuisine] = useState<Cuisine>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const { addToCart, changeQuantity, lines } = useCart();
  const { toggleFavoriteDish, isFavoriteDish } = useFavorites();

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      if (activeCuisine !== "All" && d.cuisine !== activeCuisine) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = d.name.toLowerCase().includes(q);
        const matchDesc = d.desc.toLowerCase().includes(q);
        const matchChef = d.chefName.toLowerCase().includes(q);
        const matchCuisine = d.cuisine.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchChef && !matchCuisine) {
          return false;
        }
      }
      return true;
    });
  }, [activeCuisine, searchQuery]);

  function handleAdd(dish: Dish) {
    addToCart({
      menuItemId: dish.menuItemId,
      name: dish.name,
      price: dish.price,
      chefId: dish.chefId,
      chefName: dish.chefName,
    });
    setJustAdded(dish.menuItemId);
    setTimeout(() => setJustAdded(null), 1200);
  }

  function quantityFor(id: number) {
    return lines.find((l) => l.menuItemId === id)?.quantity ?? 0;
  }

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <span className="inline-block text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full mb-4 bg-sage-200 text-sage-700">
        Recipes from every kitchen on the street
      </span>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1">Explore by cuisine</h1>
          <p className="text-sm text-sage-700">
            {filtered.length} dish{filtered.length === 1 ? "" : "es"} {activeCuisine !== "All" && `in ${activeCuisine}`} — cooked fresh to order.
          </p>
        </div>

        <div className="relative max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, dishes, or chefs..."
            className="w-full pl-9 pr-8 py-2.5 rounded-full border border-sage-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-sm"
          />
          <span className="absolute left-3 top-2.5 text-sage-400 text-sm">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-sage-400 hover:text-sage-700 font-bold"
              title="Clear"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        {CUISINES.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCuisine(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border ${activeCuisine === c ? "bg-sage-900 text-white border-sage-900" : "border-sage-200 text-sage-900 hover:bg-sage-100"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dish) => {
            const qty = quantityFor(dish.menuItemId);
            return (
              <div key={dish.menuItemId} className="rounded-2xl overflow-hidden bg-white border border-sage-200 flex flex-col hover:shadow-md transition-shadow">
                <DownloadableImage
                  imageUrl={dish.imageUrl}
                  filename={`${dish.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-recipe.jpg`}
                  buttonPosition="top-right"
                  buttonText="Save"
                >
                  <div className="h-44 relative bg-sage-200 overflow-hidden">
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavoriteDish({
                          id: dish.menuItemId.toString(),
                          name: dish.name,
                          chefName: dish.chefName,
                          price: dish.price,
                          prepTime: "45 min",
                          image: dish.imageUrl || ""
                        });
                      }}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm z-10 shadow-sm transition-transform hover:scale-110"
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isFavoriteDish(dish.menuItemId.toString()) ? "fill-rose-500 text-rose-500" : "fill-transparent text-sage-600 hover:text-rose-500"
                        }`} 
                      />
                    </button>
                  </div>
                </DownloadableImage>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm">{dish.name}</p>
                    <span className="text-xs font-semibold text-sage-700 whitespace-nowrap">⭐ {dish.rating}</span>
                  </div>
                  <p className="text-xs text-sage-700 mb-1">{dish.desc}</p>
                  <p className="text-xs text-sage-700 mb-3">by {dish.chefName}</p>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-semibold text-sm">৳{dish.price}</span>
                    {qty === 0 ? (
                      <button
                        onClick={() => handleAdd(dish)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors shadow-sm ${justAdded === dish.menuItemId ? "bg-emerald-600" : "bg-apricot hover:bg-apricot-dark"
                          }`}
                      >
                        {justAdded === dish.menuItemId ? "Added ✓" : "+ Add to cart"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-sage-100 px-2.5 py-1 rounded-xl border border-sage-200">
                        <button
                          onClick={() => changeQuantity(dish.menuItemId, -1)}
                          className="w-6 h-6 rounded-full font-bold bg-white text-sage-900 flex items-center justify-center text-xs shadow-sm hover:bg-sage-200"
                          title="Decrease quantity"
                        >
                          –
                        </button>
                        <span className="text-xs w-4 text-center font-bold text-sage-900">{qty}</span>
                        <button
                          onClick={() => changeQuantity(dish.menuItemId, 1)}
                          className="w-7 h-7 rounded-full font-bold bg-sage-100 text-sage-900 border border-sage-300"
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
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-sage-300 p-8">
          <div className="text-5xl mb-3">🍲</div>
          <h3 className="font-display text-xl font-semibold mb-2 text-sage-900">No dishes found</h3>
          <p className="text-sage-600 text-sm max-w-md mx-auto mb-6">
            No recipes matching &quot;<span className="font-semibold">{searchQuery}</span>&quot; in this category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCuisine("All");
            }}
            className="px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-sage-800 hover:bg-sage-900 transition-colors"
          >
            Clear recipe search
          </button>
        </div>
      )}
    </main>
  );
}
