/**
 * FACTORY METHOD PATTERN
 * ----------------------
 * Supabase Auth already creates the auth.users row (email/password).
 * What differs per role is which PROFILE table gets the follow-up row —
 * a Customer needs delivery_address, a Chef needs specialty/bio, a
 * DeliveryPartner needs vehicle_type. This factory hides that branching
 * from the register-user Edge Function so it stays a thin HTTP handler.
 */

export type Role = "customer" | "chef" | "admin" | "delivery_partner";

export interface RegisterFields {
  userId: string; // auth.users.id, already created by supabase.auth.admin.createUser
  name: string;
  phone?: string;
  // role-specific, all optional at the type level — validated per role below
  deliveryAddress?: string;
  specialty?: string;
  bio?: string;
  vehicleType?: string;
  accessLevel?: string;
}

export interface ProfileInsert {
  table: string;
  row: Record<string, unknown>;
}

export class UserProfileFactory {
  static build(role: Role, fields: RegisterFields): { profile: ProfileInsert; roleTable: ProfileInsert } {
    const profile: ProfileInsert = {
      table: "tbl_profile",
      row: { user_id: fields.userId, role, name: fields.name, phone: fields.phone ?? null },
    };

    switch (role) {
      case "customer":
        return {
          profile,
          roleTable: {
            table: "tbl_customer",
            row: { customer_id: fields.userId, delivery_address: fields.deliveryAddress ?? null },
          },
        };

      case "chef":
        if (!fields.specialty) {
          throw new Error("Chef registration requires 'specialty'.");
        }
        return {
          profile,
          roleTable: {
            table: "tbl_chef",
            row: {
              chef_id: fields.userId,
              specialty: fields.specialty,
              bio: fields.bio ?? null,
              status: "pending",
            },
          },
        };

      case "delivery_partner":
        if (!fields.vehicleType) {
          throw new Error("Delivery partner registration requires 'vehicleType'.");
        }
        return {
          profile,
          roleTable: {
            table: "tbl_delivery_partner",
            row: { partner_id: fields.userId, vehicle_type: fields.vehicleType },
          },
        };

      case "admin":
        return {
          profile,
          roleTable: {
            table: "tbl_admin",
            row: { admin_id: fields.userId, access_level: fields.accessLevel ?? "standard" },
          },
        };

      default: {
        const _exhaustive: never = role;
        throw new Error(`Unknown role '${_exhaustive}'`);
      }
    }
  }
}
