import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SurveyResult, SurveyResponse, SurveyType, Severity } from '../types';

interface SurveyState {
  results: SurveyResult[];
  addResult: (type: SurveyType, responses: SurveyResponse[]) => void;
  getLatestResult: (type: SurveyType) => SurveyResult | undefined;
  getAllResults: (type: SurveyType) => SurveyResult[];
  clear: () => void;
}

const calculateScore = (responses: SurveyResponse[]): number => {
  return responses.reduce((sum, response) => sum + response.value, 0);
};

const getSeverity = (score: number, type: SurveyType): Severity => {
  if (type === 'phq9') {
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
  } else {
    // GAD-7
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
  }
};

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      results: [],
      addResult: (type, responses) => {
        const totalScore = calculateScore(responses);
        const severity = getSeverity(totalScore, type);
        const result: SurveyResult = {
          id: `survey_${Date.now()}`,
          type,
          responses,
          totalScore,
          severity,
          completedAt: new Date(),
        };
        set((state) => ({
          results: [...state.results, result],
        }));
      },
      getLatestResult: (type) => {
        const results = get().results.filter((r) => r.type === type);
        return results[results.length - 1];
      },
      getAllResults: (type) => {
        return get().results.filter((r) => r.type === type);
      },
      clear: () => set({ results: [] }),
    }),
    {
      name: 'sellery-surveys',
    }
  )
);
