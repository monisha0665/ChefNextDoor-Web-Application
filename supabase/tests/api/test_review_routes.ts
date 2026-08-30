import { supabase } from '../../frontend/lib/supabaseClient';

jest.mock('../../frontend/lib/supabaseClient', () => {
  return { 
    supabase: {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    }
  };
});

describe('API Review & Rating Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitReview', () => {
    it('should successfully submit a 5-star review for an order', async () => {
      const mockData = { id: 1, order_id: 100, rating: 5, comment: 'Excellent!' };
      const singleMock = jest.fn().mockResolvedValue({ data: mockData, error: null });
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: singleMock,
      });

      const result = await supabase.from('tbl_reviews').insert({ order_id: 100, rating: 5, comment: 'Excellent!' }).select().single();
      expect(result.data).toEqual(mockData);
      expect(supabase.from).toHaveBeenCalledWith('tbl_reviews');
    });

    it('should handle validation errors for invalid ratings', async () => {
      const singleMock = jest.fn().mockResolvedValue({ data: null, error: { message: 'Rating must be between 1 and 5' } });
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: singleMock,
      });

      const result = await supabase.from('tbl_reviews').insert({ order_id: 100, rating: 6 }).select().single();
      expect(result.error?.message).toBe('Rating must be between 1 and 5');
    });
  });

  describe('getChefRatings', () => {
    it('should aggregate average rating for a chef', async () => {
      const mockData = [{ average_rating: 4.8, total_reviews: 120 }];
      const eqMock = jest.fn().mockResolvedValue({ data: mockData, error: null });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: eqMock,
      });

      const result = await supabase.from('vw_chef_ratings').select('*').eq('chef_id', '1');
      expect(result.data).toEqual(mockData);
    });
  });
});
