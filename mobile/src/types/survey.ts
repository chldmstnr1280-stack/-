/**
 * PHQ-9 및 GAD-7 설문 관련 타입 정의
 */

export enum SurveyType {
  PHQ9 = 'phq9', // 우울증 평가
  GAD7 = 'gad7', // 불안감 평가
}

export interface SurveyQuestion {
  id: string;
  text: string;
  options: SurveyOption[];
}

export interface SurveyOption {
  value: number;
  label: string;
}

export interface SurveyResponse {
  questionId: string;
  value: number;
}

export interface SurveyResult {
  id: string;
  userId: string;
  type: SurveyType;
  responses: SurveyResponse[];
  totalScore: number;
  severity: SurveySeverity;
  completedAt: Date;
  feedback?: string;
}

export type SurveySeverity = 'minimal' | 'mild' | 'moderate' | 'severe';

// PHQ-9 질문 (우울증)
export const PHQ9_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'phq9_1',
    text: '일에 대한 흥미나 즐거움이 거의 없음',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'phq9_2',
    text: '기분이 가라앉거나, 우울하거나, 희망이 없음',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'phq9_3',
    text: '잠들기 어렵거나 자주 깨거나 또는 너무 많이 잠',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'phq9_4',
    text: '피곤하고 기력이 거의 없음',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'phq9_5',
    text: '식욕이 줄었거나 과식을 함',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'phq9_6',
    text: '자신이 실패자라고 느끼거나 자신 또는 가족을 실망시킴',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'phq9_7',
    text: '신문을 읽거나 TV를 보는 것과 같은 일에 집중하기 어려움',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'phq9_8',
    text: '다른 사람들이 알아챌 정도로 느리게 움직이거나 말을 함. 또는 반대로 평소보다 많이 움직여서 안절부절못하거나 들떠 있음',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'phq9_9',
    text: '자신을 해치거나 차라리 죽는 것이 낫다는 생각',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
];

// GAD-7 질문 (불안감)
export const GAD7_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'gad7_1',
    text: '초조하거나 불안하거나 긴장됨',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'gad7_2',
    text: '걱정하는 것을 멈추거나 조절할 수 없음',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'gad7_3',
    text: '여러 가지 일에 대해 너무 많이 걱정함',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'gad7_4',
    text: '편하게 쉬기 어려움',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'gad7_5',
    text: '너무 안절부절못해서 가만히 있기 어려움',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'gad7_6',
    text: '쉽게 짜증이 나거나 쉽게 성을 냄',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
  {
    id: 'gad7_7',
    text: '마치 끔찍한 일이 일어날 것처럼 두려움',
    options: [
      { value: 0, label: '전혀 아니다' },
      { value: 1, label: '며칠 동안' },
      { value: 2, label: '1주일 이상' },
      { value: 3, label: '거의 매일' },
    ],
  },
];

// 점수 해석 함수
export const interpretPHQ9Score = (score: number): SurveySeverity => {
  if (score <= 4) return 'minimal';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  return 'severe';
};

export const interpretGAD7Score = (score: number): SurveySeverity => {
  if (score <= 4) return 'minimal';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  return 'severe';
};

export const getSurveyFeedback = (type: SurveyType, severity: SurveySeverity): string => {
  const feedbackMap = {
    [SurveyType.PHQ9]: {
      minimal: '현재 우울 증상이 최소 수준이에요. 잘 지내고 계시네요! 💚',
      mild: '경미한 우울 증상이 있어요. 꾸준한 감정 관리가 도움이 될 거예요.',
      moderate: '중간 수준의 우울 증상이 있어요. 전문가 상담을 고려해보세요.',
      severe: '심각한 우울 증상이 있어요. 전문가의 도움이 필요해 보여요.',
    },
    [SurveyType.GAD7]: {
      minimal: '현재 불안 증상이 최소 수준이에요. 평온한 상태를 유지하고 계시네요! 💚',
      mild: '경미한 불안 증상이 있어요. 호흡법과 명상이 도움이 될 거예요.',
      moderate: '중간 수준의 불안 증상이 있어요. 전문가 상담을 고려해보세요.',
      severe: '심각한 불안 증상이 있어요. 전문가의 도움이 필요해 보여요.',
    },
  };

  return feedbackMap[type][severity];
};
