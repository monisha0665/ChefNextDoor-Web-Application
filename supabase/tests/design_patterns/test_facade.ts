import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { OrderFacade } from "../../functions/_shared/patterns/facade.ts";

Deno.test("OrderFacade Pattern", async (t) => {
  await t.step("orchestrates successful online card order", async () => {
    const facade = new OrderFacade("online");
    
    // Passing valid 12-digit mock card number
    const result = await facade.placeOrder(5001, 1200, { cardNumber: "123456789012" });
    
    assertEquals(result.success, true);
    assertEquals(result.message.includes("placed successfully"), true);
    assertEquals(result.message.includes("Transaction: CARD-5001"), true);
  });

  await t.step("handles failed payment subsystem gracefully", async () => {
    const facade = new OrderFacade("bkash");
    
    // Passing invalid 3-digit bKash number to force failure in strategy subsystem
    const result = await facade.placeOrder(5002, 1200, { bkashNumber: "123" });
    
    assertEquals(result.success, false);
    assertEquals(result.message, "Payment failed: Invalid bKash number.");
  });
});
