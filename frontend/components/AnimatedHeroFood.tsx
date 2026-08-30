"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DISH_IMAGES } from "@/lib/images";

const dishes = [
  DISH_IMAGES["401"], // Green Bowl
  DISH_IMAGES["101"], // Beef Bhuna
  DISH_IMAGES["502"], // Wonton Noodle Soup
  DISH_IMAGES["602"], // Chocolate Fondant
];

// Coordinates for the 4 thumbnails on the left arc of the dashed circle
const THUMB_POSITIONS = [
  { top: "11.7%", left: "17.9%" }, // 230 deg
  { top: "32.9%", left: "3.1%" },  // 200 deg
  { top: "67.1%", left: "3.1%" },  // 160 deg
  { top: "88.3%", left: "17.9%" }, // 130 deg
];

export default function AnimatedHeroFood() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % dishes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full aspect-square relative flex items-center justify-center">
      {/* Background large circle with dashed border (The "youtube video background color") */}
      <div className="absolute top-0 right-[-5%] w-[105%] h-[105%] rounded-full bg-[#AFCEC2] border border-dashed border-sage-300 z-0">

        {/* Orbiting thumbnails (placed exactly on the boundary of this circle) */}
        {dishes.map((dish, i) => {
          const isActive = i === index;
          return (
            <motion.div
              key={i}
              className={`absolute w-12 h-12 md:w-16 md:h-16 -ml-6 -mt-6 md:-ml-8 md:-mt-8 rounded-full border-[3px] shadow-lg overflow-hidden transition-all duration-500 bg-white cursor-pointer z-20 ${isActive ? "border-sage-600 scale-125 shadow-sage-200" : "border-white scale-100 opacity-70 hover:scale-110 hover:opacity-100"
                }`}
              style={{ top: THUMB_POSITIONS[i].top, left: THUMB_POSITIONS[i].left }}
              onClick={() => setIndex(i)}
            >
              <img src={dish} alt={`Dish ${i}`} className="w-full h-full object-cover" />
            </motion.div>
          );
        })}
      </div>

      {/* Main Container - The plate itself */}
      {/* 75% width centered inside the 105% background circle. Background center is at right: 47.5%. So right: 10% perfectly centers it. */}
      <div className="absolute w-[75%] h-[75%] right-[10%] top-[12.5%] rounded-full overflow-hidden shadow-2xl z-10 bg-cream border-[6px] border-white">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={index}
            src={dishes[index]}
            alt="Premium Homemade Food"
            initial={{ opacity: 0, x: 150, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, x: -150, rotate: -90, scale: 0.8 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 w-full h-full object-cover rounded-full"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 z-20 pointer-events-none rounded-full" />
      </div>

      {/* Decorative floating leaves/elements */}
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 5, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[15%] w-8 h-8 bg-sage-400 rounded-full blur-[1px] opacity-60 z-30 pointer-events-none"
        style={{ borderRadius: '0 50% 50% 50%' }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[15%] left-[25%] w-6 h-6 bg-apricot rounded-full blur-[1px] opacity-50 z-30 pointer-events-none"
        style={{ borderRadius: '50% 0 50% 50%' }}
      />
      <motion.div
        animate={{ y: [0, -10, 0], x: [0, -15, 0], rotate: [0, 30, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-[5%] w-10 h-10 bg-emerald-300 rounded-full blur-[1px] opacity-70 z-30 pointer-events-none"
        style={{ borderRadius: '50% 50% 0 50%' }}
      />
    </div>
  );
}
