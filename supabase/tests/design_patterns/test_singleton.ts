import { assertEquals, assertNotEquals, assertThrows } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { SupabaseSingleton } from "../../functions/_shared/patterns/singleton.ts";

Deno.test("SupabaseSingleton Pattern", async (t) => {
  // Setup mock environment variables for Deno
  const originalUrl = Deno.env.get("SUPABASE_URL");
  const originalKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  Deno.env.set("SUPABASE_URL", "https://mock-project.supabase.co");
  Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "mock-service-key-12345");

  await t.step("throws error if environment variables are missing", () => {
    SupabaseSingleton.resetInstance();
    Deno.env.delete("SUPABASE_URL");
    Deno.env.delete("SUPABASE_SERVICE_ROLE_KEY");

    assertThrows(
      () => {
        SupabaseSingleton.getInstance();
      },
      Error,
      "Missing Supabase environment variables."
    );

    // Restore for next tests
    Deno.env.set("SUPABASE_URL", "https://mock-project.supabase.co");
    Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "mock-service-key-12345");
  });

  await t.step("returns the same instance across multiple calls", () => {
    SupabaseSingleton.resetInstance();
    
    const instance1 = SupabaseSingleton.getInstance();
    const instance2 = SupabaseSingleton.getInstance();

    // In JavaScript/TypeScript, objects are compared by reference
    assertEquals(instance1 === instance2, true);
    assertNotEquals(instance1, null);
  });

  // Cleanup
  if (originalUrl) Deno.env.set("SUPABASE_URL", originalUrl);
  else Deno.env.delete("SUPABASE_URL");

  if (originalKey) Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", originalKey);
  else Deno.env.delete("SUPABASE_SERVICE_ROLE_KEY");
});
