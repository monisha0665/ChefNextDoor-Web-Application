"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChefHat, Utensils, Trash2, Star, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/authContext";
import { useFavorites } from "@/lib/favoritesContext";
import { useCart } from "@/lib/cartContext";

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<"chefs" | "dishes">("chefs");
  const { favoriteChefs, favoriteDishes, toggleFavoriteChef, toggleFavoriteDish } = useFavorites();
  const [isLoaded, setIsLoaded] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    // Simulate loading from local storage or API
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const removeChef = (id: string) => {
    const chef = favoriteChefs.find(c => c.id === id);
    if (chef) toggleFavoriteChef(chef);
  };

  const removeDish = (id: string) => {
    const dish = favoriteDishes.find(d => d.id === id);
    if (dish) toggleFavoriteDish(dish);
  };

  return (
    <div className="min-h-screen bg-sage-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-sage-900 mb-4 flex items-center justify-center gap-3">
              <Heart className="w-10 h-10 text-apricot fill-apricot/20" />
              Your Favorites
            </h1>
            <p className="text-lg text-sage-700 max-w-2xl mx-auto">
              {profile 
                ? "Welcome back! Here are the chefs and dishes you love." 
                : "Save your favorite home chefs and mouth-watering dishes in one place. Log in to sync them across devices!"}
            </p>
          </motion.div>
        </div>

        {/* Custom Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-sage-200/60 shadow-sm inline-flex relative">
            <button
              onClick={() => setActiveTab("chefs")}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "chefs" ? "text-white" : "text-sage-600 hover:text-sage-900"
              }`}
            >
              <ChefHat className="w-5 h-5" />
              Chefs
            </button>
            <button
              onClick={() => setActiveTab("dishes")}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "dishes" ? "text-white" : "text-sage-600 hover:text-sage-900"
              }`}
            >
              <Utensils className="w-5 h-5" />
              Dishes
            </button>
            
            {/* Sliding Background */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-full bg-emerald-600 shadow-md"
              initial={false}
              animate={{
                left: activeTab === "chefs" ? "6px" : "50%",
                width: "calc(50% - 6px)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {!isLoaded ? (
            <div className="flex justify-center items-center h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "chefs" && (
                <motion.div
                  key="chefs"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {favoriteChefs.length === 0 ? (
                    <EmptyState type="chefs" />
                  ) : (
                    favoriteChefs.map(chef => (
                      <ChefCard key={chef.id} chef={chef} onRemove={removeChef} />
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === "dishes" && (
                <motion.div
                  key="dishes"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {favoriteDishes.length === 0 ? (
                    <EmptyState type="dishes" />
                  ) : (
                    favoriteDishes.map(dish => (
                      <DishCard key={dish.id} dish={dish} onRemove={removeDish} />
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: "chefs" | "dishes" }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white/40 backdrop-blur-sm rounded-3xl border border-sage-200 border-dashed">
      <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mb-4">
        {type === "chefs" ? (
          <ChefHat className="w-10 h-10 text-sage-400" />
        ) : (
          <Utensils className="w-10 h-10 text-sage-400" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-sage-900 mb-2">
        No favorite {type} yet
      </h3>
      <p className="text-sage-600 text-center max-w-md mb-6">
        When you discover {type === "chefs" ? "a talented home chef" : "a dish you can't resist"}, click the heart icon to save it here.
      </p>
      <Link
        href={type === "chefs" ? "/chefs" : "/recipes"}
        className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg"
      >
        Browse {type === "chefs" ? "Chefs" : "Menu"}
      </Link>
    </div>
  );
}

function ChefCard({ chef, onRemove }: { chef: any; onRemove: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sage-100 group relative"
    >
      <div className="relative h-48 w-full">
        <Image
          src={chef.image}
          alt={chef.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        {/* Remove Button */}
        <button 
          onClick={() => onRemove(chef.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-rose-500 hover:text-white hover:bg-rose-500 transition-colors shadow-sm"
          title="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-sage-900">{chef.name}</h3>
          <div className="flex items-center gap-1 bg-apricot/20 px-2 py-1 rounded-md text-apricot-dark font-semibold text-sm">
            <Star className="w-3.5 h-3.5 fill-apricot text-apricot" />
            {chef.rating}
          </div>
        </div>
        <p className="text-sage-600 text-sm mb-4">{chef.specialty}</p>
        <Link 
          href={`/chefs/${chef.id}`}
          className="block w-full text-center py-2.5 bg-sage-100 text-sage-800 font-medium rounded-xl hover:bg-emerald-600 hover:text-white transition-colors"
        >
          View Kitchen
        </Link>
      </div>
    </motion.div>
  );
}

function DishCard({ dish, onRemove }: { dish: any; onRemove: (id: string) => void }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      menuItemId: Number(dish.id),
      name: dish.name,
      price: dish.price,
      chefId: "chef", // Fallback since we don't store chefId in favorites
      chefName: dish.chefName,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sage-100 group relative"
    >
      <div className="relative h-48 w-full">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        <button 
          onClick={() => onRemove(dish.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-rose-500 hover:text-white hover:bg-rose-500 transition-colors shadow-sm"
          title="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="absolute bottom-3 left-3 flex gap-2">
          <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-sage-900 flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3 text-emerald-600" />
            {dish.prepTime}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-sage-900 line-clamp-1">{dish.name}</h3>
          <span className="font-bold text-emerald-700">৳{dish.price}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sage-500 text-sm mb-4">
          <ChefHat className="w-3.5 h-3.5" />
          By {dish.chefName}
        </div>
        <button 
          onClick={handleAddToCart}
          className={`block w-full text-center py-2.5 font-medium rounded-xl transition-colors ${
            justAdded 
              ? "bg-emerald-600 text-white" 
              : "bg-sage-100 text-sage-800 hover:bg-emerald-600 hover:text-white"
          }`}
        >
          {justAdded ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}
