import { listChefs, getChefMenu, addMenuItem, uploadMenuItemImage, updateProfile, updateCustomerAddress, updateChefBio, uploadProfileImage } from '../../frontend/lib/api';
import { supabase } from '../../frontend/lib/supabaseClient';

jest.mock('../../frontend/lib/supabaseClient', () => {
  return { 
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      }
    }
  };
});

describe('API Chef & Profile Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listChefs & getChefMenu', () => {
    it('should list active chefs', async () => {
      const mockData = [{ chef_id: '1', status: 'active', tbl_profile: { name: 'Chef 1' } }];
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });
      const result = await listChefs();
      expect(result[0].name).toBe('Chef 1');
    });

    it('should get chef menu', async () => {
      const mockData = [{ id: 1, name: 'Burger' }];
      const eqMock = jest.fn();
      eqMock.mockReturnValueOnce({ eq: jest.fn().mockResolvedValue({ data: mockData, error: null }) });
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({ eq: eqMock })
      });
      const result = await getChefMenu('1');
      expect(result).toEqual(mockData);
    });
  });

  describe('updateProfile', () => {
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
  });

  describe('Storage Uploads', () => {
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
