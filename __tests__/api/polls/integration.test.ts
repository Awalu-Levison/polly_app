import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/polls/route';

// Mock NextResponse.json
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn((data, options) => ({
        data,
        status: options?.status || 200,
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
      })),
    },
  };
});

// Helper to create a mock request with JSON body
function createMockRequest(body: any): NextRequest {
  return {
    json: jest.fn().mockResolvedValue(body),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    method: 'POST',
    url: 'http://localhost:3000/api/polls'
  } as unknown as NextRequest;
}

describe('Polls API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new poll with valid data', async () => {
    // Arrange
    const validPoll = {
      title: 'Integration Test Poll',
      description: 'This is an integration test',
      options: ['Option A', 'Option B', 'Option C'],
    };
    const req = createMockRequest(validPoll);

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(201);
    expect(response.data.poll).toBeDefined();
    expect(response.data.poll.title).toBe(validPoll.title);
    expect(response.data.poll.description).toBe(validPoll.description);
    expect(response.data.poll.options.length).toBe(validPoll.options.length);
    expect(response.data.poll.options[0].text).toBe(validPoll.options[0]);
    expect(response.data.poll.options[0].votes).toBe(0);
    expect(response.data.poll.id).toBeDefined();
    expect(response.data.poll.createdAt).toBeDefined();
  });

  it('should return 400 for invalid poll data', async () => {
    // Arrange
    const invalidPoll = {
      title: '', // Empty title
      options: ['Option A', 'Option B'],
    };
    const req = createMockRequest(invalidPoll);

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(400);
    expect(response.data.error).toBeDefined();
  });

  it('should handle edge case with exactly two options', async () => {
    // Arrange - minimum required options
    const minimumOptionsPoll = {
      title: 'Minimum Options Poll',
      description: 'Testing with exactly two options',
      options: ['Yes', 'No'],
    };
    const req = createMockRequest(minimumOptionsPoll);

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(201);
    expect(response.data.poll.options.length).toBe(2);
  });

  it('should handle edge case with very long title and options', async () => {
    // Arrange
    const longContentPoll = {
      title: 'A'.repeat(500), // Very long title
      description: 'B'.repeat(1000), // Very long description
      options: [
        'C'.repeat(200),
        'D'.repeat(200),
        'E'.repeat(200),
      ],
    };
    const req = createMockRequest(longContentPoll);

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(201);
    expect(response.data.poll.title).toBe(longContentPoll.title);
    expect(response.data.poll.description).toBe(longContentPoll.description);
    expect(response.data.poll.options[0].text).toBe(longContentPoll.options[0]);
  });

  it('should handle errors and return 500 status', async () => {
    // Arrange
    const req = createMockRequest({});
    req.json = jest.fn().mockRejectedValue(new Error('Test error'));

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(500);
    expect(response.data.error).toBe('Failed to create poll');
  });
});