import { api } from '../src/api/client';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn(),
    get: jest.fn(),
  })),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

describe('API Client', () => {
  it('should have auth methods', () => {
    expect(api.requestMagicLink).toBeDefined();
    expect(api.verifyMagicLink).toBeDefined();
  });

  it('should have emotion methods', () => {
    expect(api.createEmotion).toBeDefined();
    expect(api.getEmotions).toBeDefined();
  });

  it('should have mascot methods', () => {
    expect(api.getMascotToday).toBeDefined();
    expect(api.getWeeklyReport).toBeDefined();
  });
});
