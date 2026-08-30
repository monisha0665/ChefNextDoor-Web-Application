"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

interface Profile {
  name: string;
  role: "customer" | "chef" | "admin" | "delivery_partner";
  phone: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(user: User) {
    const { data } = await supabase.from("tbl_profile").select("name, role, phone").eq("user_id", user.id).maybeSingle();
    if (data) {
      setProfile(data as Profile);
    } else {
      // Fallback for when profile row isn't created yet or we're using a mock session
      setProfile({
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        role: user.user_metadata?.role || "customer",
        phone: null,
      });
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
        loadProfile(data.session.user);
      } else {
        try {
          const raw = window.localStorage.getItem("chefnextdoor_demo_user");
          if (raw) {
            const parsed = JSON.parse(raw);
            setUser(parsed as any);
            setProfile({
              name: parsed.user_metadata?.name || parsed.email?.split("@")[0] || "User",
              role: parsed.user_metadata?.role || "customer",
              phone: null,
            });
          }
        } catch {
          // ignore storage error
        }
      }
      setLoading(false);
    });

    const checkLocalAuth = () => {
      try {
        const raw = window.localStorage.getItem("chefnextdoor_demo_user");
        if (raw) {
          const parsed = JSON.parse(raw);
          setUser(parsed as any);
          setProfile({
            name: parsed.user_metadata?.name || parsed.email?.split("@")[0] || "User",
            role: parsed.user_metadata?.role || "customer",
            phone: null,
          });
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch {
        setUser(null);
        setProfile(null);
      }
    };

    window.addEventListener("local-auth-change", checkLocalAuth);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user);
      } else {
        checkLocalAuth();
      }
    });

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("local-auth-change", checkLocalAuth);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile: async () => {
          if (user) await loadProfile(user);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
