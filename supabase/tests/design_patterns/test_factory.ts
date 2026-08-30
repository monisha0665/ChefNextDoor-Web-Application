import { assertEquals, assertThrows } from "https://deno.land/std@0.204.0/assert/mod.ts";
import { UserProfileFactory } from "../../functions/_shared/patterns/factory.ts";

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
