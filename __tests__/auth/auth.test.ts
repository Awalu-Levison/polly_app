import { signUp, signIn } from '@/lib/actions/auth';
import { getSupabaseAdmin } from '@/lib/supabase/server';

// Mock the Supabase client
jest.mock('@/lib/supabase/server', () => ({
  getSupabaseAdmin: jest.fn(),
}));

// Mock Next.js redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('Authentication Functions', () => {
  let mockSupabase: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock Supabase client
    mockSupabase = {
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        getUser: jest.fn(),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
    };
    
    (getSupabaseAdmin as jest.Mock).mockReturnValue(mockSupabase);
  });
  
  describe('signUp', () => {
    it('should successfully register a new user', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('fullName', 'Test User');
      
      // Mock Supabase responses
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });
      
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: null,
      });
      
      mockSupabase.from().insert.mockResolvedValue({
        error: null,
      });
      
      // Call the function
      const result = await signUp(null, formData);
      
      // Assertions
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith([{
        id: 'user-123',
        full_name: 'Test User',
      }]);
      
      expect(result).toEqual({
        message: 'Sign-up successful! Please check your email to verify your account.',
      });
    });
    
    it('should return an error if sign-up fails', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('fullName', 'Test User');
      
      // Mock Supabase error response
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'Email already in use' },
      });
      
      // Call the function
      const result = await signUp(null, formData);
      
      // Assertions
      expect(result).toEqual({
        error: 'Email already in use',
      });
    });
    
    it('should return an error if profile creation fails', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('fullName', 'Test User');
      
      // Mock Supabase responses
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });
      
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: null,
      });
      
      mockSupabase.from().insert.mockResolvedValue({
        error: { message: 'Database error' },
      });
      
      // Call the function
      const result = await signUp(null, formData);
      
      // Assertions
      expect(result).toEqual({
        error: 'Database error',
      });
    });
  });
  
  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      
      // Mock Supabase response
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });
      
      // Call the function
      const result = await signIn(null, formData);
      
      // Assertions
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      
      expect(result).toBeUndefined(); // Function redirects on success
    });
    
    it('should return an error if sign-in fails', async () => {
      // Mock form data
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'wrong-password');
      
      // Mock Supabase error response
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });
      
      // Call the function
      const result = await signIn(null, formData);
      
      // Assertions
      expect(result).toEqual({
        error: 'Invalid login credentials',
      });
    });
  });
});