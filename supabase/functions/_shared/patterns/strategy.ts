/**
 * STRATEGY PATTERN
 * ----------------
 * Checkout supports Cash / Online card / bKash. Each validates and
 * "processes" differently. Adding Nagad later = one new class, zero
 * changes to place-order/index.ts.
 */

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

export interface PaymentMeta {
  cardNumber?: string;
  bkashNumber?: string;
}

export interface PaymentStrategy {
  pay(orderId: number, amount: number, meta: PaymentMeta): PaymentResult;
}

export class CashOnDeliveryStrategy implements PaymentStrategy {
  pay(orderId: number, _amount: number, _meta: PaymentMeta): PaymentResult {
    return { success: true, transactionId: `COD-${orderId}`, message: "Cash will be collected on delivery." };
  }
}

export class OnlineCardStrategy implements PaymentStrategy {
  pay(orderId: number, amount: number, meta: PaymentMeta): PaymentResult {
    const cardNumber = meta.cardNumber ?? "";
    if (cardNumber.length < 12) {
      return { success: false, transactionId: "", message: "Invalid card details." };
    }
    // TODO: replace with a real gateway call (Stripe / SSLCOMMERZ)
    return {
      success: true,
      transactionId: `CARD-${orderId}`,
      message: `Charged ${amount} to card ending ${cardNumber.slice(-4)}.`,
    };
  }
}

export class BkashStrategy implements PaymentStrategy {
  pay(orderId: number, amount: number, meta: PaymentMeta): PaymentResult {
    const bkashNumber = meta.bkashNumber ?? "";
    if (bkashNumber.length !== 11) {
      return { success: false, transactionId: "", message: "Invalid bKash number." };
    }
    // TODO: replace with a real bKash checkout API call
    return { success: true, transactionId: `BKASH-${orderId}`, message: `bKash payment of ${amount} confirmed.` };
  }
}

export type PaymentMethod = "cash" | "online" | "bkash";

export class PaymentProcessor {
  private strategy: PaymentStrategy;

  private static readonly STRATEGIES: Record<PaymentMethod, PaymentStrategy> = {
    cash: new CashOnDeliveryStrategy(),
    online: new OnlineCardStrategy(),
    bkash: new BkashStrategy(),
  };

  constructor(method: PaymentMethod) {
    this.strategy = PaymentProcessor.STRATEGIES[method];
    if (!this.strategy) {
      throw new Error(`Unsupported payment method '${method}'`);
    }
  }

  checkout(orderId: number, amount: number, meta: PaymentMeta = {}): PaymentResult {
    return this.strategy.pay(orderId, amount, meta);
  }
}
