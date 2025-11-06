import { renderHook, act } from '@testing-library/react-native';
import { useEmotionStore } from '../src/stores/emotionStore';

jest.mock('../src/api/client', () => ({
  api: {
    createEmotion: jest.fn((data) =>
      Promise.resolve({ id: '1', ...data, timestamp: new Date().toISOString(), tags: [] })
    ),
    getEmotions: jest.fn(() => Promise.resolve([])),
  },
}));

describe('EmotionStore', () => {
  it('should create emotion entry', async () => {
    const { result } = renderHook(() => useEmotionStore());

    await act(async () => {
      await result.current.createEntry({
        emotionLabel: 'happy',
        intensity: 8,
      });
    });

    expect(result.current.entries.length).toBe(1);
    expect(result.current.entries[0].emotionLabel).toBe('happy');
  });

  it('should fetch entries', async () => {
    const { result } = renderHook(() => useEmotionStore());

    await act(async () => {
      await result.current.fetchEntries();
    });

    expect(result.current.isLoading).toBe(false);
  });
});
