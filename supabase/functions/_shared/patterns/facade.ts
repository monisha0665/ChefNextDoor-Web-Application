import { PaymentProcessor, PaymentMeta, PaymentResult } from "./strategy.ts";

/**
 * FACADE PATTERN
 * --------------
 * Provides a simplified interface to a complex subsystem. Instead of the Edge Function 
 * having to manually orchestrate inventory checking, payment processing, and final 
 * database insertion, the OrderFacade handles this orchestration cleanly.
 */
export class OrderFacade {
  private paymentProcessor: PaymentProcessor;
  
  constructor(paymentMethod: "cash" | "online" | "bkash") {
    // Initializes the complex strategy subsystem behind the scenes
    this.paymentProcessor = new PaymentProcessor(paymentMethod);
  }

  public async placeOrder(
    orderId: number, 
    totalAmount: number, 
    paymentMeta: PaymentMeta
  ): Promise<{ success: boolean; message: string }> {
    
    // Step 1: Subsystem - Check Inventory (Mocked logic for facade demonstration)
    const inventoryAvailable = this.checkInventory(orderId);
    if (!inventoryAvailable) {
      return { success: false, message: "Items are out of stock." };
    }

    // Step 2: Subsystem - Process Payment
    const paymentResult: PaymentResult = this.paymentProcessor.checkout(
      orderId, 
      totalAmount, 
      paymentMeta
    );

    if (!paymentResult.success) {
      return { success: false, message: `Payment failed: ${paymentResult.message}` };
    }

    // Step 3: Subsystem - Finalize Order in Database (Mocked logic)
    const finalizationResult = await this.finalizeOrder(orderId, paymentResult.transactionId);

    return {
      success: finalizationResult,
      message: finalizationResult 
        ? `Order #${orderId} placed successfully. Transaction: ${paymentResult.transactionId}` 
        : "Failed to finalize order in the database."
    };
  }

  // Private subsystem methods hidden from the client
  private checkInventory(_orderId: number): boolean {
    return true; // Simplified for demonstration
  }

  private async finalizeOrder(_orderId: number, _transactionId: string): Promise<boolean> {
    // Would normally contain Supabase database insertion logic
    return Promise.resolve(true); 
  }
}
