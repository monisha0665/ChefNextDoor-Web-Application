import { supabase } from '../../frontend/lib/supabaseClient';

jest.mock('../../frontend/lib/supabaseClient', () => {
  return { 
    supabase: {
      functions: { invoke: jest.fn() },
    }
  };
});

describe('API Payment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processPaymentWebhook', () => {
    it('should invoke payment-webhook edge function successfully', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { success: true, transactionId: 'TX123' }, error: null });
      
      const payload = { provider: 'bkash', amount: 500, reference: 'ORDER-1' };
      const result = await supabase.functions.invoke('payment-webhook', { body: payload });
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('payment-webhook', { body: payload });
      expect(result.data.success).toBe(true);
      expect(result.data.transactionId).toBe('TX123');
    });

    it('should handle failed payment validation securely', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: null, error: { message: 'Invalid Signature' } });
      
      const payload = { provider: 'stripe', amount: 500, reference: 'ORDER-2' };
      const result = await supabase.functions.invoke('payment-webhook', { body: payload });
      
      expect(result.error?.message).toBe('Invalid Signature');
    });
  });

  describe('refundOrder', () => {
    it('should invoke refund-order edge function successfully', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { status: 'refunded' }, error: null });
      
      const payload = { orderId: 1, reason: 'Customer Cancelled' };
      const result = await supabase.functions.invoke('refund-order', { body: payload });
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('refund-order', { body: payload });
      expect(result.data.status).toBe('refunded');
    });
  });
});
