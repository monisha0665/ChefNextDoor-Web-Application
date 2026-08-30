import { registerUser, loginUser, logoutUser, changePassword } from '../../frontend/lib/api';
import { supabase } from '../../frontend/lib/supabaseClient';

jest.mock('../../frontend/lib/supabaseClient', () => {
  return { 
    supabase: {
      functions: { invoke: jest.fn() },
      auth: { signUp: jest.fn(), signInWithPassword: jest.fn(), signOut: jest.fn(), updateUser: jest.fn() },
    }
  };
});

describe('API Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (typeof window !== 'undefined') window.localStorage.clear();
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
  });

  describe('loginUser', () => {
    it('should sign in with password successfully', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ data: { user: 'test' }, error: null });
      const result = await loginUser('test@example.com', 'password');
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
      expect(result).toEqual({ user: 'test' });
    });
  });

  describe('logoutUser', () => {
    it('should sign out successfully', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
      await logoutUser();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValue({ error: null });
      await changePassword('newpass');
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'newpass' });
    });
  });
});
