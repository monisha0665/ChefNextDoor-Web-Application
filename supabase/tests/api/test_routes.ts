import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  listChefs, 
  getChefMenu, 
  addMenuItem,
  placeOrder,
  updateOrderStatus,
  getCustomerOrders,
  subscribeToOrder,
  uploadMenuItemImage,
  updateProfile,
  updateCustomerAddress,
  updateChefBio,
  changePassword,
  uploadProfileImage
} from '../lib/api';
import { supabase } from '../lib/supabaseClient';

jest.mock('../lib/supabaseClient', () => {
  const mSupabase = {
    functions: {
      invoke: jest.fn(),
    },
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
    },
    channel: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn().mockReturnThis(),
    removeChannel: jest.fn(),
  };
  return { supabase: mSupabase };
});

describe('api.ts tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  });

  describe('registerUser', () => {
    it('should invoke register-user edge function successfully', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { user: 'test' }, error: null });
      
      const payload = { role: 'customer' as const, email: 'test@example.com', password: 'password', name: 'Test' };
      const result = await registerUser(payload);
      
      expect(supabase.functions.invoke).toHaveBeenCalledWith('register-user', { body: payload });
      expect(result).toEqual({ user: 'test' });
    });

    it('should fallback to local auth signup if edge function fails', async () => {
      (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error('offline'));
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({ data: { user: 'local' }, error: null });
      
      const payload = { role: 'customer' as const, email: 'test@example.com', password: 'password', name: 'Test' };
      const result = await registerUser(payload);
      
      expect(supabase.auth.signUp).toHaveBeenCalled();
      expect(result).toEqual({ user: 'local' });
    });

    it('should log warning if local auth signup fails with unexpected error', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error('offline'));
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({ data: null, error: { message: 'some error' } });
      
      const payload = { role: 'customer' as const, email: 'test2@example.com', password: 'password', name: 'Test' };
      const result = await registerUser(payload);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith("Local auth signup notice:", { message: 'some error' });
      expect(result).toEqual({ user: { email: 'test2@example.com', id: expect.any(String) } });
      consoleWarnSpy.mockRestore();
    });
  });

  describe('loginUser', () => {
    it('should sign in with password successfully', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ data: { user: 'test' }, error: null });
      
      const result = await loginUser('test@example.com', 'password');
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
      expect(result).toEqual({ user: 'test' });
    });

    it('should fallback to local mock user if signin fails in dev', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockRejectedValue(new Error('offline'));
      
      const result = await loginUser('test@example.com', 'password');
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('logoutUser', () => {
    it('should sign out successfully', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
      await logoutUser();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('Chefs / Menu', () => {
    it('should list active chefs', async () => {
      const mockData = [{ chef_id: '1', status: 'active', tbl_profile: { name: 'Chef 1' } }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });
      
      const result = await listChefs();
      expect(supabase.from).toHaveBeenCalledWith('tbl_chef');
      expect(result[0].name).toBe('Chef 1');
    });

    it('should get chef menu', async () => {
      const mockData = [{ id: 1, name: 'Burger' }];
      const eqMock = jest.fn();
      eqMock.mockReturnValueOnce({ eq: jest.fn().mockResolvedValue({ data: mockData, error: null }) });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: eqMock
        })
      });
      
      const result = await getChefMenu('1');
      expect(result).toEqual(mockData);
    });

    it('should add menu item', async () => {
      const mockData = { id: 1, name: 'Burger' };
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });
      
      const result = await addMenuItem({ chef_id: '1', name: 'Burger', price: 10 });
      expect(result).toEqual(mockData);
    });
  });

  describe('Orders', () => {
    it('should place an order', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { orderId: 1 }, error: null });
      const payload = { chefId: '1', deliveryAddress: '123 St', items: [], paymentMethod: 'cash' as const };
      
      const result = await placeOrder(payload);
      expect(result).toEqual({ orderId: 1 });
      expect(supabase.functions.invoke).toHaveBeenCalledWith('place-order', { body: payload });
    });

    it('should update order status', async () => {
      (supabase.functions.invoke as jest.Mock).mockResolvedValue({ data: { success: true }, error: null });
      
      const result = await updateOrderStatus(1, 'preparing');
      expect(result).toEqual({ success: true });
    });

    it('should get customer orders', async () => {
      const mockData = [{ order_id: 1 }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });
      
      const result = await getCustomerOrders();
      expect(result).toEqual(mockData);
    });

    it('should subscribe to order', () => {
      const unsub = subscribeToOrder(1, jest.fn());
      expect(supabase.channel).toHaveBeenCalledWith('order-1');
      expect(typeof unsub).toBe('function');
      unsub();
      expect(supabase.removeChannel).toHaveBeenCalled();
    });
  });

  describe('Storage', () => {
    it('should upload menu item image', async () => {
      const mockFile = new File([''], 'test.png');
      (supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'http://test.png' } }),
      });
      
      const url = await uploadMenuItemImage('1', mockFile);
      expect(url).toBe('http://test.png');
    });
  });

  describe('Profile settings', () => {
    it('should update profile', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { name: 'New' }, error: null }),
      });
      
      const result = await updateProfile('1', { name: 'New' });
      expect(result).toEqual({ name: 'New' });
    });

    it('should update customer address', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      });
      
      await updateCustomerAddress('1', 'New Address');
      expect(supabase.from).toHaveBeenCalledWith('tbl_customer');
    });

    it('should update chef bio', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      });
      
      await updateChefBio('1', { bio: 'New Bio' });
      expect(supabase.from).toHaveBeenCalledWith('tbl_chef');
    });

    it('should change password', async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });
      
      await changePassword('newpass');
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'newpass' });
    });

    it('should upload profile image', async () => {
      const mockFile = new File([''], 'profile.png');
      (supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'http://profile.png' } }),
      });
      
      const url = await uploadProfileImage('1', mockFile);
      expect(url).toBe('http://profile.png');
    });
  });
});
