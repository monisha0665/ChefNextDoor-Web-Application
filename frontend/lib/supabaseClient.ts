import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single browser client, safe to import anywhere in the app — it only
// ever holds the anon key, never the service role key (that lives only
// inside Edge Functions, server-side).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
