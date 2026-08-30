"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cartContext";
import DownloadableImage from "@/components/DownloadableImage";
import { CHEF_IMAGES, DISH_IMAGES } from "@/lib/images";

interface MenuItem {
  menu_item_id: string | number;
  name: string;
  price: number;
  desc: string;
  imageUrl: string;
}

interface ChefProfile {
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  story: string;
  banner: string;
  menu: MenuItem[];
}

const CHEFS_DATA: Record<string, ChefProfile> = {
  "1": {
    name: "Chef Amina's Kitchen",
    specialty: "Traditional Sylheti Bengali",
    rating: 4.9,
    reviews: 612,
    distance: "1.2km away",
    story: "I started cooking for my building's WhatsApp group during lockdown — 40 orders became 400. Every recipe here is one my mother taught me.",
    banner: CHEF_IMAGES["1"],
    menu: [
      { menu_item_id: 101, name: "Beef Bhuna", price: 280, desc: "Slow-cooked beef, mustard oil, five-spice.", imageUrl: DISH_IMAGES["101"] },
      { menu_item_id: 102, name: "Shorshe Ilish", price: 350, desc: "Hilsa in mustard gravy, served with rice.", imageUrl: DISH_IMAGES["102"] },
      { menu_item_id: 103, name: "Chicken Rezala", price: 240, desc: "Creamy white gravy, cardamom, cashew.", imageUrl: DISH_IMAGES["202"] },
    ],
  },
  "2": {
    name: "Wei's Wok Corner",
    specialty: "Chinese & Cantonese Wok",
    rating: 4.7,
    reviews: 420,
    distance: "2.4km away",
    story: "Mastering the wok burn is an art passed down through three generations in our family restaurant.",
    banner: CHEF_IMAGES["2"],
    menu: [
      { menu_item_id: 201, name: "Dim Sum & Dumplings", price: 220, desc: "Steamed chicken & prawn dumplings.", imageUrl: DISH_IMAGES["201"] },
      { menu_item_id: 202, name: "Wonton Noodle Soup", price: 190, desc: "Rich broth, hand-folded wontons, egg noodles.", imageUrl: DISH_IMAGES["202"] },
    ],
  },
  "3": {
    name: "Tania's Bakehouse",
    specialty: "Artisan Bakery & Desserts",
    rating: 4.8,
    reviews: 380,
    distance: "1.8km away",
    story: "Freshly baked sourdough every morning, hand-crafted pastries, and warm desserts made with love.",
    banner: CHEF_IMAGES["3"],
    menu: [
      { menu_item_id: 301, name: "Artisan Sourdough Loaf", price: 250, desc: "Naturally fermented sourdough with crusty golden top.", imageUrl: DISH_IMAGES["301"] },
      { menu_item_id: 302, name: "Chocolate Fondant", price: 150, desc: "Molten center chocolate cake with vanilla bean cream.", imageUrl: DISH_IMAGES["602"] },
    ],
  },
  "4": {
    name: "Green Bowl by Nusrat",
    specialty: "Healthy Vegan Bowls",
    rating: 4.6,
    reviews: 290,
    distance: "3.1km away",
    story: "Plant-based food should be colorful, nutrient-packed, and absolutely delicious every single day.",
    banner: CHEF_IMAGES["4"],
    menu: [
      { menu_item_id: 401, name: "Avocado Grain Bowl", price: 230, desc: "Quinoa, avocado, edamame, tahini dressing.", imageUrl: DISH_IMAGES["401"] },
    ],
  },
  "5": {
    name: "Grill & Chill",
    specialty: "BBQ & Smoked Meats",
    rating: 4.5,
    reviews: 310,
    distance: "2.9km away",
    story: "Low and slow smoked beef ribs, charred tikka kebabs, and authentic BBQ spice rubs.",
    banner: CHEF_IMAGES["5"],
    menu: [
      { menu_item_id: 501, name: "Smoked BBQ Ribs", price: 420, desc: "Slow smoked ribs in house special hickory sauce.", imageUrl: DISH_IMAGES["501"] },
    ],
  },
  "6": {
    name: "Rahim's Rooti House",
    specialty: "Bengali Breakfast & Snacks",
    rating: 4.9,
    reviews: 510,
    distance: "0.8km away",
    story: "Hot paratas straight off the tawa, spiced lentil bhaji, and authentic sweet roshogolla.",
    banner: CHEF_IMAGES["6"],
    menu: [
      { menu_item_id: 601, name: "Special Parata & Bhaji", price: 120, desc: "Flaky layered parata with spiced chana dal bhaji.", imageUrl: DISH_IMAGES["601"] },
    ],
  },
};

export default function ChefProfilePage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { addToCart, changeQuantity, lines } = useCart();
  const [resolvedId, setResolvedId] = useState<string>("1");

  useEffect(() => {
    if (params) {
      if (typeof (params as any).then === "function") {
        (params as Promise<{ id: string }>).then((res) => {
          if (res?.id) setResolvedId(String(res.id));
        });
      } else if ((params as { id: string }).id) {
        setResolvedId(String((params as { id: string }).id));
      }
    }
  }, [params]);

  const chef = CHEFS_DATA[resolvedId] || CHEFS_DATA["1"];
  const chefLines = lines.filter((l) => String(l.chefId) === String(resolvedId) || l.chefName === chef.name);
  const chefSubtotal = chefLines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  function quantityFor(id: string | number) {
    return lines.find((l) => String(l.menuItemId) === String(id))?.quantity ?? 0;
  }

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <Link href="/chefs" className="inline-flex items-center text-xs font-semibold text-sage-700 hover:text-sage-900 mb-4">
        ← Back to all chefs
      </Link>

      <DownloadableImage
        imageUrl={chef.banner}
        filename={`${chef.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-banner.jpg`}
        buttonPosition="top-right"
        buttonText="Download Banner 📥"
        showAlways={true}
        className="mb-6 rounded-[3rem] overflow-hidden shadow-lg"
      >
        <div className="rounded-[3rem] h-64 md:h-80 flex items-end p-8 relative overflow-hidden bg-sage-900 group">
          <img
            src={chef.banner}
            alt={chef.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="text-white relative z-10">
            <span className="inline-block text-xs font-bold px-3 py-1 mb-2 rounded-full bg-apricot shadow-sm">
              ⭐ Top rated home chef
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-1">{chef.name}</h1>
            <p className="text-sm opacity-95">
              {chef.specialty} • {chef.rating} ★ ({chef.reviews} reviews) • {chef.distance}
            </p>
          </div>
        </div>
      </DownloadableImage>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="font-display text-xl font-semibold mb-2">{chef.name}&apos;s story</h2>
          <p className="text-sm mb-8 leading-relaxed text-sage-700 font-serif italic border-l-4 border-sage-300 pl-4 py-1">
            &quot;{chef.story}&quot;
          </p>

          <h2 className="font-display text-xl font-semibold mb-4">Menu</h2>
          <div className="space-y-3">
            {chef.menu.map((item) => {
              const qty = quantityFor(item.menu_item_id);
              return (
                <div
                  key={item.menu_item_id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-sage-200 hover:shadow-sm transition-shadow"
                >
                  <DownloadableImage
                    imageUrl={item.imageUrl}
                    filename={`${item.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-item.jpg`}
                    buttonPosition="center"
                    buttonText="Save"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-sage-100 flex-shrink-0 relative">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </DownloadableImage>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs mb-1 text-sage-700">{item.desc}</p>
                    <p className="text-sm font-semibold text-sage-900">৳{item.price}</p>
                  </div>
                  {qty === 0 ? (
                    <button
                      onClick={() =>
                        addToCart({
                          menuItemId: item.menu_item_id,
                          name: item.name,
                          price: item.price,
                          chefId: resolvedId,
                          chefName: chef.name,
                        })
                      }
                      className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-apricot hover:bg-apricot-dark transition-colors shadow-sm cursor-pointer"
                    >
                      + Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-sage-100 px-3 py-1.5 rounded-xl border border-sage-200">
                      <button
                        onClick={() => changeQuantity(item.menu_item_id, -1)}
                        className="w-7 h-7 rounded-full font-bold bg-white text-sage-900 flex items-center justify-center text-sm shadow-sm hover:bg-sage-200 cursor-pointer"
                        title="Decrease quantity"
                      >
                        –
                      </button>
                      <span className="text-sm w-6 text-center font-bold text-sage-900">{qty}</span>
                      <button
                        onClick={() => changeQuantity(item.menu_item_id, 1)}
                        className="w-7 h-7 rounded-full font-bold bg-sage-100 text-sage-900 border border-sage-300"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-2xl p-5 h-fit sticky top-24 bg-sage-100 border border-sage-200 shadow-sm">
          <p className="text-sm font-semibold mb-3">Your cart</p>
          {chefLines.length === 0 ? (
            <p className="text-sm text-sage-700 mb-4">No items yet — add something from the menu.</p>
          ) : (
            <div className="text-sm space-y-1 mb-4">
              {chefLines.map((l) => (
                <div key={l.menuItemId} className="flex justify-between items-center text-sage-800 text-xs">
                  <span>{l.quantity}× {l.name}</span>
                  <span className="font-semibold">৳{l.price * l.quantity}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-sage-200 mb-4 text-sage-900">
            <span>Subtotal</span>
            <span className="text-emerald-700">৳{chefSubtotal}</span>
          </div>
          <Link
            href="/cart"
            className="block w-full text-center py-3 rounded-xl font-semibold text-sm text-white bg-sage-900 hover:bg-emerald-600 transition-colors shadow-sm"
          >
            Order now →
          </Link>
        </aside>
      </div>
    </main>
  );
}
