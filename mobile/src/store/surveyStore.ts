/**
 * 설문 상태 관리 (Zustand)
 */

import { create } from 'zustand';
import { SurveyResult, SurveyType, SurveyResponse, SurveySeverity, interpretPHQ9Score, interpretGAD7Score } from '../types/survey';

interface SurveyStore {
  results: SurveyResult[];
  currentSurvey: {
    type: SurveyType | null;
    responses: SurveyResponse[];
  };

  // Actions
  startSurvey: (type: SurveyType) => void;
  answerQuestion: (questionId: string, value: number) => void;
  completeSurvey: (userId: string) => SurveyResult | null;
  cancelSurvey: () => void;
  getLatestResult: (type: SurveyType) => SurveyResult | undefined;
  getResultsByType: (type: SurveyType) => SurveyResult[];
  getTrendData: (type: SurveyType, weeks: number) => number[];
}

export const useSurveyStore = create<SurveyStore>((set, get) => ({
  results: [],
  currentSurvey: {
    type: null,
    responses: [],
  },

  startSurvey: (type: SurveyType) => {
    set({
      currentSurvey: {
        type,
        responses: [],
      },
    });
  },

  answerQuestion: (questionId: string, value: number) => {
    const { currentSurvey } = get();
    const existingIndex = currentSurvey.responses.findIndex(r => r.questionId === questionId);

    const newResponses = [...currentSurvey.responses];
    if (existingIndex >= 0) {
      newResponses[existingIndex] = { questionId, value };
    } else {
      newResponses.push({ questionId, value });
    }

    set({
      currentSurvey: {
        ...currentSurvey,
        responses: newResponses,
      },
    });
  },

  completeSurvey: (userId: string) => {
    const { currentSurvey, results } = get();

    if (!currentSurvey.type || currentSurvey.responses.length === 0) {
      return null;
    }

    // 총점 계산
    const totalScore = currentSurvey.responses.reduce((sum, r) => sum + r.value, 0);

    // 심각도 판정
    let severity: SurveySeverity;
    if (currentSurvey.type === SurveyType.PHQ9) {
      severity = interpretPHQ9Score(totalScore);
    } else {
      severity = interpretGAD7Score(totalScore);
    }

    const result: SurveyResult = {
      id: `survey_${Date.now()}`,
      userId,
      type: currentSurvey.type,
      responses: currentSurvey.responses,
      totalScore,
      severity,
      completedAt: new Date(),
    };

    set({
      results: [result, ...results],
      currentSurvey: {
        type: null,
        responses: [],
      },
    });

    return result;
  },

  cancelSurvey: () => {
    set({
      currentSurvey: {
        type: null,
        responses: [],
      },
    });
  },

  getLatestResult: (type: SurveyType) => {
    const { results } = get();
    return results.find(r => r.type === type);
  },

  getResultsByType: (type: SurveyType) => {
    const { results } = get();
    return results.filter(r => r.type === type);
  },

  getTrendData: (type: SurveyType, weeks: number) => {
    const results = get().getResultsByType(type);
    return results.slice(0, weeks).map(r => r.totalScore).reverse();
  },
}));
