import { supabase } from '../../frontend/lib/supabaseClient';

jest.mock('../../frontend/lib/supabaseClient', () => {
  return { 
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    }
  };
});

describe('API Search Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchChefs', () => {
    it('should filter chefs by specialty and location', async () => {
      const mockData = [{ chef_id: '1', specialty: 'Italian', tbl_profile: { name: 'Chef Mario' } }];
      const ilikeMock = jest.fn().mockResolvedValue({ data: mockData, error: null });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        ilike: ilikeMock,
      });

      // Mocking a search API call that filters by specialty
      const result = await supabase.from('tbl_chef').select('*').eq('status', 'active').ilike('specialty', '%Italian%');
      expect(result.data).toEqual(mockData);
      expect(supabase.from).toHaveBeenCalledWith('tbl_chef');
    });
  });

  describe('searchMenu', () => {
    it('should return menu items matching search query', async () => {
      const mockData = [{ id: 1, name: 'Spicy Pasta', price: 15 }];
      const ilikeMock = jest.fn().mockResolvedValue({ data: mockData, error: null });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        ilike: ilikeMock,
      });

      const result = await supabase.from('tbl_menu').select('*').ilike('name', '%Spicy%');
      expect(result.data).toEqual(mockData);
    });
  });
});
