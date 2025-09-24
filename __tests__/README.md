# Polly App Tests

This directory contains unit tests for the Polly App, focusing on user authentication, poll creation, and QR code sharing functionality.

## Test Structure

- `auth/auth.test.ts`: Tests for user registration and sign-in functionality
- `polls/polls.test.ts`: Tests for poll creation, retrieval, and voting functionality
- `components/QRCodeShare.test.tsx`: Tests for the QR code sharing component
- `pages/PollDetailPage.test.tsx`: Tests for the poll detail page with QR code integration
- `setup/mockEnv.ts`: Mock environment variables for testing

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

## Test Coverage

The tests are configured to ensure at least 70% coverage for:
- Branches
- Functions
- Lines
- Statements

## Key Features Tested

1. **User Authentication**
   - User registration with profile creation
   - User sign-in with proper error handling

2. **Poll Management**
   - Poll creation with options
   - Poll retrieval with options
   - Vote submission

3. **QR Code Sharing**
   - QR code generation for poll URLs
   - Copy-to-clipboard functionality
   - Integration with poll detail page

4. **Project Status**
   - Ongoing project

5. **Team members**
   - Awalu Levison (Frontend Engineer)

