import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/polls/route';
import { apiResolver } from 'next/dist/server/api-utils/node';


// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn((data, options) => ({
        data,
        options,
      })),
    },
  };
});

// Helper to create a mock request with JSON body
function createMockRequest(body: any): NextRequest {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

describe('Polls API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/polls', () => {
    // Unit test 1: Valid input validation
    it('should create a new poll with valid input', async () => {
      // Arrange
      const validPoll = {
        title: 'Test Poll',
        description: 'This is a test poll',
        options: ['Option 1', 'Option 2', 'Option 3'],
      };
      const req = createMockRequest(validPoll);

      // Act
      const response = await POST(req);

      // Assert
      expect(response.data.poll).toBeDefined();
      expect(response.data.poll.title).toBe(validPoll.title);
      expect(response.data.poll.description).toBe(validPoll.description);
      expect(response.data.poll.options.length).toBe(validPoll.options.length);
      expect(response.options.status).toBe(201);
    });

    // Unit test 2: Invalid input validation
    it('should return 400 error when input is invalid', async () => {
      // Test cases for invalid input
      const invalidInputCases = [
        { title: '', options: ['Option 1', 'Option 2'] }, // Empty title
        { title: 'Test Poll', options: [] }, // No options
        { title: 'Test Poll', options: ['Option 1'] }, // Only one option
        { description: 'Only description', options: ['Option 1', 'Option 2'] }, // Missing title
      ];

      for (const invalidInput of invalidInputCases) {
        // Arrange
        const req = createMockRequest(invalidInput);

        // Act
        const response = await POST(req);

        // Assert
        expect(response.data.error).toBeDefined();
        expect(response.options.status).toBe(400);
      }
    });

    // Integration test: Error handling
    it('should handle errors and return 500 status', async () => {
      // Arrange
      const req = createMockRequest({});
      req.json = jest.fn().mockRejectedValue(new Error('Test error'));

      // Act
      const response = await POST(req);

      // Assert
      expect(response.data.error).toBe('Failed to create poll');
      expect(response.options.status).toBe(500);
    });
  });
});