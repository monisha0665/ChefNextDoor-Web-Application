import { placeOrder, updateOrderStatus, getCustomerOrders, subscribeToOrder } from '../../frontend/lib/api';
import { supabase } from '../../frontend/lib/supabaseClient';

jest.mock('../../frontend/lib/supabaseClient', () => {
  return { 
    supabase: {
      functions: { invoke: jest.fn() },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      channel: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      removeChannel: jest.fn(),
    }
  };
});

describe('API Order Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('placeOrder', () => {
    it('should place an order successfully', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { orderId: 1 }, error: null });
      const payload = { chefId: '1', deliveryAddress: '123 St', items: [], paymentMethod: 'cash' as const };
      
      const result = await placeOrder(payload);
      expect(result).toEqual({ orderId: 1 });
      expect(supabase.functions.invoke).toHaveBeenCalledWith('place-order', { body: payload });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { success: true }, error: null });
      const result = await updateOrderStatus(1, 'preparing');
      expect(result).toEqual({ success: true });
    });
  });

  describe('getCustomerOrders', () => {
    it('should fetch customer orders', async () => {
      const mockData = [{ order_id: 1 }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });
      const result = await getCustomerOrders();
      expect(result).toEqual(mockData);
    });
  });

  describe('subscribeToOrder', () => {
    it('should subscribe to realtime order updates', () => {
      const unsub = subscribeToOrder(1, jest.fn());
      expect(supabase.channel).toHaveBeenCalledWith('order-1');
      expect(typeof unsub).toBe('function');
      unsub();
      expect(supabase.removeChannel).toHaveBeenCalled();
    });
  });
});
