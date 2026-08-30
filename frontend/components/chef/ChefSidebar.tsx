"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  User,
  Star,
  CircleDollarSign,
  BadgePercent,
  BarChart3,
  Settings,
  LogOut,
  ChefHat
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

const navItems = [
  { name: "Dashboard", href: "/chef/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/chef/orders", icon: ClipboardList, badge: 12 },
  { name: "Menu Management", href: "/chef/menu", icon: Utensils },
  { name: "My Profile", href: "/chef/profile", icon: User },
  { name: "Reviews", href: "/chef/reviews", icon: Star, badge: 8 },
  { name: "Earnings", href: "/chef/earnings", icon: CircleDollarSign },
  { name: "Promotion & Offers", href: "/chef/promotions", icon: BadgePercent },
  { name: "Analytics", href: "/chef/analytics", icon: BarChart3 },
  { name: "Settings", href: "/chef/settings", icon: Settings },
];

export function ChefSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-[#1a2e20] text-white flex flex-col sticky top-0 h-screen z-30">
      {/* Profile summary */}
      <div className="px-6 py-4 flex flex-col items-center border-b border-sage-800/50 mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-sage-500/30 mb-3 bg-sage-800">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80"
            alt="Chef Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="font-semibold text-[15px]">{profile?.name || "Farhana Rahman"}</h2>
        <p className="text-xs text-sage-300 mb-1">Bengali Cuisine Specialist</p>
        <div className="flex items-center gap-1 text-xs">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="font-medium text-amber-400">4.8</span>
          <span className="text-sage-400">(128 reviews)</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          // Temporarily treat everything matching "/chef/dashboard" as active for this mockup if other routes don't exist yet, 
          // but we'll use exact match for actual routing.
          const isActive = pathname === item.href || (pathname === '/chef/dashboard' && item.href === '/chef/dashboard');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isActive
                ? "bg-sage-500/20 text-white font-medium"
                : "text-sage-300 hover:text-white hover:bg-sage-800/30"
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={isActive ? "text-sage-200" : "text-sage-400"} />
                <span className="text-sm">{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-sage-800 text-sage-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sage-800/50 mt-auto">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
