/**
 * OBSERVER PATTERN
 * ----------------
 * The tbl_notification fan-out itself is handled by a Postgres trigger
 * (see supabase/migrations/0001_init.sql) so it fires no matter how the
 * row gets updated — not just through this function. What belongs here,
 * at the application layer, is anything a database trigger can't do:
 * calling OUT to external services (push notifications, SMS, email).
 * Each observer below is a stand-in for one of those integrations.
 */

export type OrderStatus = "Pending" | "Accepted" | "Preparing" | "On the Way" | "Delivered" | "Cancelled";

export interface OrderSnapshot {
  orderId: number;
  customerId: string;
  chefId: string;
  partnerId: string | null;
}

export interface OrderObserver {
  update(order: OrderSnapshot, status: OrderStatus): void | Promise<void>;
}

export class CustomerPushNotifier implements OrderObserver {
  async update(order: OrderSnapshot, status: OrderStatus): Promise<void> {
    // TODO: call a push-notification provider (e.g. OneSignal, FCM)
    console.log(`[push -> customer ${order.customerId}] Order #${order.orderId} is now '${status}'.`);
  }
}

export class ChefDashboardNotifier implements OrderObserver {
  async update(order: OrderSnapshot, status: OrderStatus): Promise<void> {
    // Supabase Realtime already pushes the row change to any chef dashboard
    // subscribed via `supabase.channel(...)`; this observer is where you'd
    // add anything extra, e.g. an SMS alert for a new/urgent order.
    console.log(`[chef dashboard] Order #${order.orderId} status changed to '${status}'.`);
  }
}

export class DeliveryPartnerNotifier implements OrderObserver {
  async update(order: OrderSnapshot, status: OrderStatus): Promise<void> {
    if (order.partnerId && (status === "Preparing" || status === "On the Way")) {
      // TODO: ping the delivery partner's app / SMS
      console.log(`[delivery app -> partner ${order.partnerId}] Order #${order.orderId} is '${status}'.`);
    }
  }
}

export class OrderStatusSubject {
  private observers: OrderObserver[] = [
    new CustomerPushNotifier(),
    new ChefDashboardNotifier(),
    new DeliveryPartnerNotifier(),
  ];

  async broadcast(order: OrderSnapshot, status: OrderStatus): Promise<void> {
    await Promise.all(this.observers.map((o) => o.update(order, status)));
  }
}
