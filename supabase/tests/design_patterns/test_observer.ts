import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { OrderSubject, EmailNotificationObserver, PushNotificationObserver } from "../../functions/_shared/patterns/observer.ts";

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
