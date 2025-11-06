import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../src/stores/authStore';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock API client
jest.mock('../src/api/client', () => ({
  api: {
    getMe: jest.fn(() => Promise.resolve({ id: '1', email: 'test@test.com' })),
  },
}));

describe('AuthStore', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle login', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('fake-token');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('fake-token');
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
