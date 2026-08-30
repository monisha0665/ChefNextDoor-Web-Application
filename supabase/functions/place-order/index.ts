// supabase/functions/place-order/index.ts
// Deploy: supabase functions deploy place-order
//
// Why this isn't just a direct supabase-js insert from the frontend:
// placing an order touches 3 tables (order, order_items, payment) and
// needs a payment method processed via Strategy — that's exactly the
// kind of multi-step, must-not-half-fail logic that belongs server-side
// even in a "backend-less" Supabase app.
import { supabaseAdmin, corsHeaders } from "../_shared/supabaseAdmin.ts";
import { PaymentProcessor, type PaymentMethod, type PaymentMeta } from "../_shared/patterns/strategy.ts";

const DELIVERY_FEE = 40.0;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    // The caller's JWT identifies the customer — verify it against the
    // anon-key client so we never trust a customer_id sent in the body.
    const authHeader = req.headers.get("Authorization") ?? "";
    const admin = supabaseAdmin();
    const { data: userData, error: authErr } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authErr || !userData.user) {
      return json({ error: "Not authenticated." }, 401);
    }
    const customerId = userData.user.id;

    const body = await req.json();
    const {
      chefId,
      deliveryAddress,
      items,
      paymentMethod,
      paymentMeta,
      discount = 0,
    } = body as {
      chefId: string;
      deliveryAddress: string;
      items: { menuItemId: number; quantity: number }[];
      paymentMethod: PaymentMethod;
      paymentMeta?: PaymentMeta;
      discount?: number;
    };

    if (!chefId || !deliveryAddress || !items?.length || !paymentMethod) {
      return json({ error: "chefId, deliveryAddress, items, and paymentMethod are required." }, 400);
    }

    // Look up current prices server-side — never trust client-sent prices
    const menuItemIds = items.map((i) => i.menuItemId);
    const { data: menuRows, error: menuErr } = await admin
      .from("tbl_menu_item")
      .select("menu_item_id, price")
      .in("menu_item_id", menuItemIds);
    if (menuErr || !menuRows) {
      return json({ error: "Could not load menu items." }, 400);
    }

    const priceById = new Map(menuRows.map((r: { menu_item_id: number; price: number }) => [r.menu_item_id, r.price]));
    let subtotal = 0;
    const orderItemRows = items.map((i) => {
      const price = priceById.get(i.menuItemId);
      if (price === undefined) throw new Error(`Menu item ${i.menuItemId} not found.`);
      subtotal += price * i.quantity;
      return { menu_item_id: i.menuItemId, quantity: i.quantity, unit_price: price };
    });

    const total = subtotal + DELIVERY_FEE - discount;

    const { data: order, error: orderErr } = await admin
      .from("tbl_order")
      .insert({
        customer_id: customerId,
        chef_id: chefId,
        delivery_address: deliveryAddress,
        subtotal,
        delivery_fee: DELIVERY_FEE,
        discount,
        total,
        status: "Pending",
      })
      .select()
      .single();
    if (orderErr || !order) {
      return json({ error: orderErr?.message ?? "Could not create order." }, 400);
    }

    const { error: itemsErr } = await admin
      .from("tbl_order_item")
      .insert(orderItemRows.map((r) => ({ ...r, order_id: order.order_id })));
    if (itemsErr) {
      return json({ error: itemsErr.message }, 400);
    }

    // ---- Strategy pattern: process payment via whichever method was chosen ----
    const processor = new PaymentProcessor(paymentMethod);
    const result = processor.checkout(order.order_id, total, paymentMeta ?? {});

    await admin.from("tbl_payment").insert({
      order_id: order.order_id,
      method: paymentMethod,
      status: result.success ? "paid" : "failed",
      transaction_id: result.transactionId,
      amount: total,
      paid_at: result.success ? new Date().toISOString() : null,
    });

    if (!result.success) {
      return json({ order, payment_error: result.message }, 402);
    }

    return json({ order, payment_message: result.message }, 201);
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
