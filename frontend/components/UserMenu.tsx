"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";

export default function UserMenu() {
  const { user, profile, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-sage-100 animate-pulse" />;
  }

  const initial = user ? (profile?.name || user.email || "?").charAt(0).toUpperCase() : "";

  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="hidden sm:inline text-sm font-semibold text-sage-700">
        Log in
      </Link>
      <Link href="/register" className="text-sm font-semibold px-4 py-2 rounded-full text-white bg-apricot">
        Sign up free
      </Link>

      {user && (
        <div className="relative ml-2" ref={menuRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-white bg-sage-700"
          >
            {initial}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-sage-200 shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-sage-200">
                <p className="text-sm font-semibold truncate">{profile?.name ?? "Your account"}</p>
                <p className="text-xs text-sage-700 truncate">{user.email}</p>
              </div>
              <Link href="/profile" className="block px-4 py-2.5 text-sm hover:bg-sage-100" onClick={() => setOpen(false)}>
                ⚙️ Profile settings
              </Link>
              {profile?.role === "chef" && (
                <Link href="/chef/dashboard" className="block px-4 py-2.5 text-sm hover:bg-sage-100" onClick={() => setOpen(false)}>
                  👩‍🍳 Chef dashboard
                </Link>
              )}
              {profile?.role === "admin" && (
                <Link href="/admin/dashboard" className="block px-4 py-2.5 text-sm hover:bg-sage-100" onClick={() => setOpen(false)}>
                  🛠️ Admin panel
                </Link>
              )}
              <Link href="/tracking" className="block px-4 py-2.5 text-sm hover:bg-sage-100" onClick={() => setOpen(false)}>
                📦 My orders
              </Link>
              <Link
                href="/logout"
                className="block px-4 py-2.5 text-sm font-semibold text-berry hover:bg-sage-100 border-t border-sage-200"
                onClick={() => setOpen(false)}
              >
                🚪 Log out
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
