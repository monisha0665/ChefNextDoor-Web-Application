"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { logoutUser } from "@/lib/api";

export default function LogoutPage() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    logoutUser().finally(() => setDone(true));
  }, []);

  return (
    <main className="min-h-[calc(100vh-92px)] flex items-center justify-center px-5">
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 bg-sage-100">
          {done ? "👋" : "🍲"}
        </div>
        <h1 className="font-display text-2xl font-semibold mb-2">
          {done ? "You've been logged out" : "Signing you out…"}
        </h1>
        <p className="text-sm text-sage-700 mb-8">
          {done
            ? "Thanks for stopping by ChefNextDoor. Your cart is saved for next time."
            : "Just a moment while we close your session."}
        </p>
        {done && (
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-sage-900">
              Back to home
            </Link>
            <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-semibold border border-sage-200">
              Log in again
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
