// Learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');

// Import mock environment variables
require('./__tests__/setup/mockEnv');

// Mock the console.error in tests to avoid noisy logs
global.console.error = jest.fn();

// Set a fixed time for Date.now() to make tests deterministic
const fixedDate = new Date('2023-01-01T00:00:00Z');
global.Date.now = jest.fn(() => fixedDate.getTime());
global.Date = class extends Date {
  constructor() {
    super();
    return fixedDate;
  }
};