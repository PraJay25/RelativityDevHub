import { ConfigModule } from '@nestjs/config';

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DB_DATABASE = 'relativity_devhub_test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only-32-chars';
  process.env.REDIS_DB = '1';
});

// Global test teardown
afterAll(async () => {
  // Cleanup
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
