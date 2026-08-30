"use client";
import { useState } from "react";
import Link from "next/link";
import type { Chef } from "@/lib/types";
import DownloadableImage from "./DownloadableImage";
import { CHEF_IMAGES } from "@/lib/images";
import { useCart } from "@/lib/cartContext";
import { useFavorites } from "@/lib/favoritesContext";
import { Heart } from "lucide-react";

export default function ChefCard({ chef, badge }: { chef: Chef; badge?: string }) {
  const { addToCart, lines, changeQuantity } = useCart();
  const { toggleFavoriteChef, isFavoriteChef } = useFavorites();
  const [added, setAdded] = useState(false);
  const chefImageUrl = chef.image_url || CHEF_IMAGES[chef.chef_id] || CHEF_IMAGES.default;

  const defaultDishId = `chef-dish-${chef.chef_id}`;
  const defaultDishName = `${chef.specialty} Special Platter`;
  const defaultDishPrice = 280;

  const existingLine = lines.find((l) => l.menuItemId === defaultDishId);
  const qty = existingLine?.quantity ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      menuItemId: defaultDishId,
      name: defaultDishName,
      price: defaultDishPrice,
      chefId: chef.chef_id,
      chefName: chef.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="block rounded-2xl overflow-hidden border border-sage-200 bg-white group hover:shadow-md transition-all flex flex-col">
      <DownloadableImage
        imageUrl={chefImageUrl}
        filename={`${chef.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-profile.jpg`}
        buttonPosition="top-right"
        buttonText="Save"
      >
        <div className="h-44 relative bg-sage-200 overflow-hidden">
          <img
            src={chefImageUrl}
            alt={chef.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full text-white bg-apricot shadow-sm z-10">
              {badge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavoriteChef({
                id: chef.chef_id,
                name: chef.name,
                specialty: chef.specialty,
                rating: chef.rating_avg,
                image: chefImageUrl
              });
            }}
            className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${isFavoriteChef(chef.chef_id) ? "fill-rose-500 text-rose-500" : "fill-white text-sage-400"
                }`}
            />
          </button>
        </div>
      </DownloadableImage>
      <div className="p-4 flex flex-col flex-1">
        <p className="font-semibold text-sm mb-1">{chef.name}</p>
        <p className="text-xs text-sage-700 mb-3">
          {chef.specialty} • ⭐ {chef.rating_avg.toFixed(1)}
        </p>

        <div className="mt-auto grid grid-cols-2 gap-2">
          {qty === 0 ? (
            <button
              onClick={handleAddToCart}
              type="button"
              className={`py-2 px-3 rounded-lg text-xs font-bold text-white transition-all shadow-sm flex items-center justify-center gap-1 ${added ? "bg-emerald-600" : "bg-apricot hover:bg-apricot-dark"
                }`}
            >
              <span>🛒</span>
              <span>{added ? "Added ✓" : "Add to Cart"}</span>
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 bg-sage-100 rounded-lg py-1 px-2 border border-sage-200">
              <button
                type="button"
                onClick={() => changeQuantity(defaultDishId, -1)}
                className="w-6 h-6 rounded-full font-bold bg-white text-sage-900 flex items-center justify-center text-xs shadow-sm hover:bg-sage-200"
              >
                –
              </button>
              <span className="text-xs font-bold text-sage-900 w-6 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => changeQuantity(defaultDishId, 1)}
                className="w-6 h-6 rounded-full font-bold bg-white text-sage-900 flex items-center justify-center text-xs shadow-sm hover:bg-sage-200"
              >
                +
              </button>
            </div>
          )}

          <Link
            href={`/chefs/${chef.chef_id}`}
            className="py-2 px-3 rounded-lg text-xs font-semibold bg-sage-100 text-sage-900 hover:bg-sage-200 text-center flex items-center justify-center"
          >
            View menu →
          </Link>
        </div>
      </div>
    </div>
  );
}
