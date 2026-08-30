import { assertEquals, assertThrows } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { UserProfileFactory } from "../functions/_shared/patterns/factory.ts";
import { PaymentProcessor } from "../functions/_shared/patterns/strategy.ts";
import { OrderSubject, EmailNotificationObserver, PushNotificationObserver } from "../functions/_shared/patterns/observer.ts";

Deno.test("UserProfileFactory Pattern", async (t) => {
  await t.step("creates customer profile and role table", () => {
    const result = UserProfileFactory.build("customer", {
      userId: "u1",
      name: "John Doe",
      deliveryAddress: "123 St",
    });
    assertEquals(result.profile.table, "tbl_profile");
    assertEquals(result.profile.row.user_id, "u1");
    assertEquals(result.roleTable.table, "tbl_customer");
    assertEquals(result.roleTable.row.delivery_address, "123 St");
  });

  await t.step("creates chef profile and throws if specialty missing", () => {
    assertThrows(
      () => {
        UserProfileFactory.build("chef", { userId: "u2", name: "Chef" });
      },
      Error,
      "Chef registration requires 'specialty'."
    );

    const result = UserProfileFactory.build("chef", {
      userId: "u2",
      name: "Chef",
      specialty: "Italian",
    });
    assertEquals(result.roleTable.table, "tbl_chef");
    assertEquals(result.roleTable.row.specialty, "Italian");
  });
});

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

Deno.test("OrderSubject Observer Pattern", async (t) => {
  await t.step("notifies attached observers", () => {
    const subject = new OrderSubject(999, "pending");
    
    // We mock the update method to verify calls
    let emailCalled = false;
    let pushCalled = false;
    
    const emailObs = new EmailNotificationObserver();
    emailObs.update = (orderId, status) => { emailCalled = true; };
    
    const pushObs = new PushNotificationObserver();
    pushObs.update = (orderId, status) => { pushCalled = true; };

    subject.attach(emailObs);
    subject.attach(pushObs);
    
    subject.setStatus("preparing");
    
    assertEquals(emailCalled, true);
    assertEquals(pushCalled, true);
    assertEquals(subject.getStatus(), "preparing");
  });
});
