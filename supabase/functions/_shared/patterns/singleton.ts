import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

/**
 * SINGLETON PATTERN
 * -----------------
 * Ensures that the Supabase Service Role client is initialized exactly once 
 * during the execution lifecycle of the Edge Function, preventing multiple 
 * network handshakes or memory leaks from redundant client instantiations.
 */
export class SupabaseSingleton {
  private static instance: SupabaseClient | null = null;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  public static getInstance(): SupabaseClient {
    if (!SupabaseSingleton.instance) {
      const url = Deno.env.get("SUPABASE_URL");
      const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (!url || !key) {
        throw new Error("Missing Supabase environment variables.");
      }

      SupabaseSingleton.instance = createClient(url, key);
    }
    return SupabaseSingleton.instance;
  }

  // Exposed for testing purposes
  public static resetInstance() {
    SupabaseSingleton.instance = null;
  }
}
