"use client";

import { useAuth } from "@/lib/authContext";
import { Menu, Bell, Search, Star } from "lucide-react";

export function ChefHeader() {
  const { profile } = useAuth();

  return (
    <header className="h-[88px] bg-sage-900 px-6 flex items-center justify-between sticky top-0 z-40 w-full shadow-md">
      {/* Left section */}
      <div className="flex items-center gap-6">
        <button className="p-2.5 bg-sage-800/50 border border-sage-700 rounded-lg text-sage-200 hover:bg-sage-800 transition-colors">
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-2xl font-display font-semibold text-white mb-0.5">Welcome back, {profile?.name || "Farhana"}! 👋</h1>
          <p className="text-sage-300 text-sm">Here&apos;s what&apos;s happening in your kitchen today.</p>
        </div>
      </div>

      {/* Middle section (Search) */}
      <div className="hidden md:flex items-center max-w-md w-full relative mx-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" size={18} />
        <input
          type="text"
          placeholder="Search orders, customers, menu..."
          className="w-full bg-sage-800/40 border border-sage-700/50 rounded-xl py-2.5 pl-10 pr-16 text-sm text-sage-100 placeholder:text-sage-400 outline-none focus:border-sage-500 focus:bg-sage-800 transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-sage-800 border border-sage-700 rounded text-[10px] font-medium text-sage-300 px-1.5 py-0.5">
          Ctrl + K
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 ml-2">
        <button className="relative p-2 text-white hover:text-sage-100 transition-colors">
          <Bell size={24} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-sage-900 text-[9px] font-bold text-white flex items-center justify-center">
            4
          </span>
        </button>


      </div>

    </header>
  );
}
