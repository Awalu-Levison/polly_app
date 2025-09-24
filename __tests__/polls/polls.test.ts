import { createPollAction, getPoll, submitVote } from '@/lib/actions/polls';
import { getSupabaseAdmin } from '@/lib/supabase/server';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  getSupabaseAdmin: jest.fn(),
}));

// Mock Next.js redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Poll Functions', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock Supabase client
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    };
    
    (getSupabaseAdmin as jest.Mock).mockReturnValue(mockSupabase);
  });
  
  describe('createPollAction', () => {
    it('should successfully create a poll with options', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('title', 'Test Poll');
      formData.append('description', 'This is a test poll');
      formData.append('options', 'Option 1');
      formData.append('options', 'Option 2');
      formData.append('userId', 'user-123');
      
      // Mock Supabase responses
      mockSupabase.from().insert.mockResolvedValueOnce({
        data: [{ id: 'poll-123' }],
        error: null,
      });
      
      mockSupabase.from().insert.mockResolvedValueOnce({
        error: null,
      });
      
      // Call the function
      const result = await createPollAction(null, formData);
      
      // Assertions
      expect(mockSupabase.from).toHaveBeenCalledWith('polls');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        question: 'Test Poll',
        description: 'This is a test poll',
        user_id: 'user-123',
        is_active: true,
        is_public: true,
      });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('poll_options');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith([
        { poll_id: 'poll-123', option_text: 'Option 1' },
        { poll_id: 'poll-123', option_text: 'Option 2' },
      ]);
      
      expect(result).toBeUndefined(); // Function redirects on success
    });
    
    it('should return an error if poll creation fails', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('title', 'Test Poll');
      formData.append('description', 'This is a test poll');
      formData.append('options', 'Option 1');
      formData.append('options', 'Option 2');
      formData.append('userId', 'user-123');
      
      // Mock Supabase error response
      mockSupabase.from().insert.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' },
      });
      
      // Call the function
      const result = await createPollAction(null, formData);
      
      // Assertions
      expect(result).toEqual({
        error: 'Database error',
      });
    });
    
    it('should return an error if poll options creation fails', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('title', 'Test Poll');
      formData.append('description', 'This is a test poll');
      formData.append('options', 'Option 1');
      formData.append('options', 'Option 2');
      formData.append('userId', 'user-123');
      
      // Mock Supabase responses
      mockSupabase.from().insert.mockResolvedValueOnce({
        data: [{ id: 'poll-123' }],
        error: null,
      });
      
      mockSupabase.from().insert.mockResolvedValueOnce({
        error: { message: 'Options error' },
      });
      
      // Call the function
      const result = await createPollAction(null, formData);
      
      // Assertions
      expect(result).toEqual({
        error: 'Options error',
      });
    });
  });
  
  describe('getPoll', () => {
    it('should successfully retrieve a poll with its options', async () => {
      const pollId = 'poll-123';
      const mockPoll = {
        id: pollId,
        question: 'Test Poll',
        description: 'This is a test poll',
        user_id: 'user-123',
        created_at: '2023-01-01T00:00:00Z',
        options: [
          { id: 'option-1', option_text: 'Option 1' },
          { id: 'option-2', option_text: 'Option 2' },
        ],
      };
      
      // Mock Supabase response
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: mockPoll,
        error: null,
      });
      
      // Call the function
      const result = await getPoll(pollId);
      
      // Assertions
      expect(mockSupabase.from).toHaveBeenCalledWith('polls');
      expect(mockSupabase.select).toHaveBeenCalledWith('*, options:poll_options(*)');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', pollId);
      expect(result).toEqual(mockPoll);
    });
    
    it('should return null if poll does not exist', async () => {
      const pollId = 'non-existent-poll';
      
      // Mock Supabase response
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });
      
      // Call the function
      const result = await getPoll(pollId);
      
      // Assertions
      expect(result).toBeNull();
    });
  });
  
  describe('submitVote', () => {
    it('should successfully submit a vote', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('pollId', 'poll-123');
      formData.append('optionId', 'option-1');
      formData.append('userId', 'user-123');
      
      // Mock Supabase response
      mockSupabase.from().insert.mockResolvedValue({
        error: null,
      });
      
      // Call the function
      const result = await submitVote(null, formData);
      
      // Assertions
      expect(mockSupabase.from).toHaveBeenCalledWith('votes');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith({
        poll_id: 'poll-123',
        option_id: 'option-1',
        user_id: 'user-123',
      });
      
      expect(result).toBeUndefined(); // Function redirects on success
    });
    
    it('should return an error if vote submission fails', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('pollId', 'poll-123');
      formData.append('optionId', 'option-1');
      formData.append('userId', 'user-123');
      
      // Mock Supabase error response
      mockSupabase.from().insert.mockResolvedValue({
        error: { message: 'User already voted' },
      });
      
      // Call the function
      const result = await submitVote(null, formData);
      
      // Assertions
      expect(result).toEqual({
        error: 'User already voted',
      });
    });
  });
});