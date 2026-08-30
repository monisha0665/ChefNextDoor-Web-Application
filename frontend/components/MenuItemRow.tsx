"use client";
import type { MenuItem } from "@/lib/types";
import DownloadableImage from "./DownloadableImage";
import { useFavorites } from "@/lib/favoritesContext";
import { Heart } from "lucide-react";

export default function MenuItemRow({
  item,
  quantity,
  onChange,
}: {
  item: MenuItem;
  quantity: number;
  onChange: (id: number, delta: number) => void;
}) {
  const { toggleFavoriteDish, isFavoriteDish } = useFavorites();

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-sage-200 hover:shadow-sm transition-shadow">
      <DownloadableImage
        imageUrl={item.image_url}
        emoji="🍲"
        filename={`${item.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-dish.png`}
        title={item.name}
        buttonPosition="center"
        buttonText="Save"
      >
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-sage-100 flex-shrink-0 relative overflow-hidden group">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            "🍲"
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavoriteDish({
                id: item.menu_item_id.toString(),
                name: item.name,
                chefName: "Chef", // We don't have chef name here easily accessible, could pass it down if needed
                price: item.price,
                prepTime: "45 min", // Mocked as it's not in the type
                image: item.image_url || ""
              });
            }}
            className="absolute bottom-0 right-0 p-0.5 rounded-tl-lg bg-white/80 backdrop-blur-sm z-10"
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-colors duration-300 ${
                isFavoriteDish(item.menu_item_id.toString()) ? "fill-rose-500 text-rose-500" : "fill-white text-sage-400"
              }`} 
            />
          </button>
        </div>
      </DownloadableImage>
      <div className="flex-1">
        <p className="font-semibold text-sm">{item.name}</p>
        <p className="text-xs mb-1 text-sage-700">{item.description}</p>
        <p className="text-sm font-semibold text-sage-700">৳{item.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(item.menu_item_id, -1)}
          className="w-7 h-7 rounded-full font-bold bg-sage-100 hover:bg-sage-200"
        >
          –
        </button>
        <span className="text-sm w-4 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => onChange(item.menu_item_id, 1)}
          className="w-6 h-6 rounded-full font-bold bg-white text-sage-900 flex items-center justify-center text-xs shadow-sm hover:bg-sage-200"
        >
          +
        </button>
      </div>
    </div>
  );
}

