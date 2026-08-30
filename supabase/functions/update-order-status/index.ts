// supabase/functions/update-order-status/index.ts
// Deploy: supabase functions deploy update-order-status
//
// The Postgres trigger (fn_notify_order_status_change) already handles
// writing tbl_notification rows and Supabase Realtime already pushes
// those out live — this function's job is only the parts a trigger
// can't do: authorizing WHO may change status, and firing any external
// side effects via the Observer classes (push/SMS/email stubs).
import { supabaseAdmin, corsHeaders } from "../_shared/supabaseAdmin.ts";
import { OrderStatusSubject, type OrderStatus } from "../_shared/patterns/observer.ts";

const VALID_STATUSES: OrderStatus[] = ["Pending", "Accepted", "Preparing", "On the Way", "Delivered", "Cancelled"];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const admin = supabaseAdmin();
    const { data: userData, error: authErr } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !userData.user) {
      return json({ error: "Not authenticated." }, 401);
    }

    const { orderId, status } = (await req.json()) as { orderId: number; status: OrderStatus };
    if (!orderId || !VALID_STATUSES.includes(status)) {
      return json({ error: "orderId and a valid status are required." }, 400);
    }

    const { data: order, error: fetchErr } = await admin
      .from("tbl_order")
      .select("order_id, customer_id, chef_id, partner_id")
      .eq("order_id", orderId)
      .single();
    if (fetchErr || !order) {
      return json({ error: "Order not found." }, 404);
    }

    // Only the assigned chef, the assigned delivery partner, or an admin
    // may move an order's status forward.
    const callerId = userData.user.id;
    const { data: profile } = await admin.from("tbl_profile").select("role").eq("user_id", callerId).single();
    const isAllowed =
      callerId === order.chef_id || callerId === order.partner_id || profile?.role === "admin";
    if (!isAllowed) {
      return json({ error: "Not authorized to update this order." }, 403);
    }

    const { data: updated, error: updateErr } = await admin
      .from("tbl_order")
      .update({ status })
      .eq("order_id", orderId)
      .select()
      .single();
    if (updateErr || !updated) {
      return json({ error: updateErr?.message ?? "Could not update order." }, 400);
    }

    // ---- Observer pattern: fan out any external side effects ----
    const subject = new OrderStatusSubject();
    await subject.broadcast(
      { orderId: order.order_id, customerId: order.customer_id, chefId: order.chef_id, partnerId: order.partner_id },
      status,
    );

    return json({ order: updated }, 200);
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
