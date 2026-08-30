"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CHEF_IMAGES } from "@/lib/images";

export type GlobalChef = {
  id: number;
  name: string;
  specialty: string;
  status: string;
  img: string;
  bio?: string;
  rating_avg?: number;
};

// Use the same initial chefs that Admin Dashboard had
const INITIAL_CHEFS: GlobalChef[] = [
  { id: 1, name: "Chef Amina", specialty: "Bengali", status: "Active", img: CHEF_IMAGES["1"], bio: "Traditional home cooked Sylheti dishes with fresh ingredients.", rating_avg: 4.9 },
  { id: 2, name: "Wei's Wok", specialty: "Chinese", status: "Active", img: CHEF_IMAGES["2"], bio: "Authentic Cantonese and Sichuan wok dishes cooked fresh.", rating_avg: 4.7 },
  { id: 3, name: "Nusrat's Bakehouse", specialty: "Bakery", status: "Active", img: CHEF_IMAGES["3"], bio: "Artisan sourdough, pastries and custom cakes.", rating_avg: 4.8 },
  { id: 4, name: "Nusrat's Green Bowl", specialty: "Vegan", status: "Active", img: CHEF_IMAGES["4"], bio: "Healthy, vibrant plant-based meal bowls.", rating_avg: 4.6 },
  { id: 5, name: "Chef Grill", specialty: "BBQ", status: "Active", img: CHEF_IMAGES["5"], bio: "Smoked beef ribs, charred chicken tikka, and bbq feast.", rating_avg: 4.5 },
  { id: 6, name: "Rahim's Rooti", specialty: "Bengali", status: "Active", img: CHEF_IMAGES["6"], bio: "Fresh paratas, rooti, and spiced lentil bhaji.", rating_avg: 4.9 },

];

type ChefContextType = {
  chefs: GlobalChef[];
  addChef: (chef: Omit<GlobalChef, "id">) => void;
  deleteChef: (id: number) => void;

};

const ChefContext = createContext<ChefContextType | undefined>(undefined);

export function ChefProvider({ children }: { children: React.ReactNode }) {
  const [chefs, setChefs] = useState<GlobalChef[]>(INITIAL_CHEFS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedChefs = localStorage.getItem("chefnextdoor_global_chefs");
    if (savedChefs) {
      try {
        setChefs(JSON.parse(savedChefs));
      } catch (e) {
        console.error("Failed to parse chefs from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever chefs array changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("chefnextdoor_global_chefs", JSON.stringify(chefs));
    }
  }, [chefs, isLoaded]);

  const addChef = (newChefData: Omit<GlobalChef, "id">) => {
    const newChef: GlobalChef = {
      ...newChefData,
      id: Date.now(), // Generate unique ID
    };
    setChefs((prev) => [...prev, newChef]);
  };

  const deleteChef = (id: number) => {
    setChefs((prev) => prev.filter((chef) => chef.id !== id));
  };

  return (
    <ChefContext.Provider value={{ chefs, addChef, deleteChef }}>
      {children}
    </ChefContext.Provider>
  );
}

export function useChefContext() {
  const context = useContext(ChefContext);
  if (context === undefined) {
    throw new Error("useChefContext must be used within a ChefProvider");
  }
  return context;
}
