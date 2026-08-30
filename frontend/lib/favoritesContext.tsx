"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface FavoriteChef {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
}

export interface FavoriteDish {
  id: string;
  name: string;
  chefName: string;
  price: number;
  prepTime: string;
  image: string;
}

interface FavoritesContextType {
  favoriteChefs: FavoriteChef[];
  favoriteDishes: FavoriteDish[];
  toggleFavoriteChef: (chef: FavoriteChef) => void;
  toggleFavoriteDish: (dish: FavoriteDish) => void;
  isFavoriteChef: (id: string) => boolean;
  isFavoriteDish: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Dummy initial data
const initialFavoriteChefs: FavoriteChef[] = [
  {
    id: "chef-1",
    name: "Chef Nusrat",
    specialty: "Authentic Bengali Cuisine",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "chef-2",
    name: "Chef Rahman",
    specialty: "Italian & Continental",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&auto=format&fit=crop&q=60",
  }
];

const initialFavoriteDishes: FavoriteDish[] = [
  {
    id: "dish-1",
    name: "Kacchi Biryani",
    chefName: "Chef Nusrat",
    price: 350,
    prepTime: "45 min",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "dish-2",
    name: "Beef Kala Bhuna",
    chefName: "Chef Ali",
    price: 450,
    prepTime: "60 min",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "dish-3",
    name: "Pasta Alfredo",
    chefName: "Chef Rahman",
    price: 300,
    prepTime: "30 min",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60",
  }
];

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteChefs, setFavoriteChefs] = useState<FavoriteChef[]>([]);
  const [favoriteDishes, setFavoriteDishes] = useState<FavoriteDish[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // In a real app, you would load from localStorage or an API here.
    // We'll initialize with our dummy data for demonstration purposes.
    const storedChefs = localStorage.getItem("favoriteChefs");
    const storedDishes = localStorage.getItem("favoriteDishes");
    
    if (storedChefs) {
        setFavoriteChefs(JSON.parse(storedChefs));
    } else {
        setFavoriteChefs(initialFavoriteChefs);
    }
    
    if (storedDishes) {
        setFavoriteDishes(JSON.parse(storedDishes));
    } else {
        setFavoriteDishes(initialFavoriteDishes);
    }
    
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem("favoriteChefs", JSON.stringify(favoriteChefs));
        localStorage.setItem("favoriteDishes", JSON.stringify(favoriteDishes));
    }
  }, [favoriteChefs, favoriteDishes, isLoaded]);

  const toggleFavoriteChef = (chef: FavoriteChef) => {
    setFavoriteChefs((prev) => {
      const exists = prev.find((c) => c.id === chef.id);
      if (exists) {
        return prev.filter((c) => c.id !== chef.id);
      }
      return [...prev, chef];
    });
  };

  const toggleFavoriteDish = (dish: FavoriteDish) => {
    setFavoriteDishes((prev) => {
      const exists = prev.find((d) => d.id === dish.id);
      if (exists) {
        return prev.filter((d) => d.id !== dish.id);
      }
      return [...prev, dish];
    });
  };

  const isFavoriteChef = (id: string) => !!favoriteChefs.find((c) => c.id === id);
  const isFavoriteDish = (id: string) => !!favoriteDishes.find((d) => d.id === id);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteChefs,
        favoriteDishes,
        toggleFavoriteChef,
        toggleFavoriteDish,
        isFavoriteChef,
        isFavoriteDish,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
