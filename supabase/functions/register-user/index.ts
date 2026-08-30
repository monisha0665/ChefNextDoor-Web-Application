// supabase/functions/register-user/index.ts
// Deploy: supabase functions deploy register-user
//
// Flow: create the auth.users row via the Admin API, then use
// UserProfileFactory (Factory pattern) to build the correct follow-up
// rows for whichever role was requested, and insert both in one go.
import { supabaseAdmin, corsHeaders } from "../_shared/supabaseAdmin.ts";
import { UserProfileFactory, type Role, type RegisterFields } from "../_shared/patterns/factory.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const body = await req.json();
    const { role, email, password, name, phone, deliveryAddress, specialty, bio, vehicleType } = body as {
      role: Role;
      email: string;
      password: string;
      name: string;
      phone?: string;
      deliveryAddress?: string;
      specialty?: string;
      bio?: string;
      vehicleType?: string;
    };

    if (!role || !email || !password || !name) {
      return json({ error: "role, email, password, and name are required." }, 400);
    }

    const admin = supabaseAdmin();

    // 1. Create the actual auth user (Supabase Auth owns password hashing)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, name },
    });
    if (createErr || !created.user) {
      return json({ error: createErr?.message ?? "Could not create user." }, 400);
    }

    const fields: RegisterFields = {
      userId: created.user.id,
      name,
      phone,
      deliveryAddress,
      specialty,
      bio,
      vehicleType,
    };

    // 2. Factory builds the two rows this role needs
    let built;
    try {
      built = UserProfileFactory.build(role, fields);
    } catch (validationErr) {
      // Roll back the auth user so we don't leave an orphaned account
      await admin.auth.admin.deleteUser(created.user.id);
      return json({ error: (validationErr as Error).message }, 400);
    }

    const { error: profileErr } = await admin.from(built.profile.table).insert(built.profile.row);
    if (profileErr) {
      await admin.auth.admin.deleteUser(created.user.id);
      return json({ error: profileErr.message }, 400);
    }

    const { error: roleErr } = await admin.from(built.roleTable.table).insert(built.roleTable.row);
    if (roleErr) {
      await admin.auth.admin.deleteUser(created.user.id);
      return json({ error: roleErr.message }, 400);
    }

    return json({ user_id: created.user.id, role, name }, 201);
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}
