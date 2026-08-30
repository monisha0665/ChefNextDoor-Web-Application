import { assertEquals, assertThrows } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { PaymentProcessor } from "../../functions/_shared/patterns/strategy.ts";

Deno.test("PaymentProcessor Strategy Pattern", async (t) => {
  await t.step("processes Cash On Delivery successfully", () => {
    const processor = new PaymentProcessor("cash");
    const result = processor.checkout(101, 500);
    assertEquals(result.success, true);
    assertEquals(result.transactionId, "COD-101");
  });

  await t.step("validates bKash payment length", () => {
    const processor = new PaymentProcessor("bkash");
    const failResult = processor.checkout(102, 500, { bkashNumber: "123" });
    assertEquals(failResult.success, false);
    
    const passResult = processor.checkout(102, 500, { bkashNumber: "01812345678" });
    assertEquals(passResult.success, true);
    assertEquals(passResult.transactionId, "BKASH-102");
  });

  await t.step("throws on invalid payment method", () => {
    assertThrows(
      () => {
        new PaymentProcessor("crypto" as any);
      },
      Error,
      "Unsupported payment method 'crypto'"
    );
  });
});
