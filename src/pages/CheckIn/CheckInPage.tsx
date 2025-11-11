import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout, Button, Card } from '../../components/common';
import { CheckInQuestion } from '../../types';

// 간소화된 PHQ-9 질문 (5문항)
const phq9Questions: CheckInQuestion[] = [
  {
    id: 'phq9-1',
    question: '기분이 가라앉거나 우울하거나 희망이 없다고 느꼈다',
    type: 'phq9',
  },
  {
    id: 'phq9-2',
    question: '평소 하던 일에 대한 흥미가 없어지거나 즐거움을 느끼지 못했다',
    type: 'phq9',
  },
  {
    id: 'phq9-3',
    question: '잠들기 어렵거나 자주 깼다, 또는 너무 많이 잤다',
    type: 'phq9',
  },
  {
    id: 'phq9-4',
    question: '피곤하다고 느끼거나 기운이 거의 없었다',
    type: 'phq9',
  },
  {
    id: 'phq9-5',
    question: '자신을 부정적으로 보거나 실패자라고 느꼈다',
    type: 'phq9',
  },
];

// 간소화된 GAD-7 질문 (4문항)
const gad7Questions: CheckInQuestion[] = [
  {
    id: 'gad7-1',
    question: '불안하거나 초조하거나 안절부절못했다',
    type: 'gad7',
  },
  {
    id: 'gad7-2',
    question: '걱정을 멈추거나 조절할 수 없었다',
    type: 'gad7',
  },
  {
    id: 'gad7-3',
    question: '여러 가지 것들에 대해 걱정을 너무 많이 했다',
    type: 'gad7',
  },
  {
    id: 'gad7-4',
    question: '편하게 있기가 어려웠다',
    type: 'gad7',
  },
];

const scoreOptions = [
  { value: 0, label: '전혀\n그렇지 않다' },
  { value: 1, label: '며칠\n그랬다' },
  { value: 2, label: '거의\n매일' },
  { value: 3, label: '매일\n그랬다' },
];

export const CheckInPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<'intro' | 'phq9' | 'gad7' | 'complete'>('intro');
  const [phq9Responses, setPhq9Responses] = useState<Record<string, number>>({});
  const [gad7Responses, setGad7Responses] = useState<Record<string, number>>({});

  const handlePhq9Response = (questionId: string, score: number) => {
    setPhq9Responses((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleGad7Response = (questionId: string, score: number) => {
    setGad7Responses((prev) => ({ ...prev, [questionId]: score }));
  };

  const handlePhq9Complete = () => {
    if (Object.keys(phq9Responses).length === phq9Questions.length) {
      setCurrentSection('gad7');
    }
  };

  const handleGad7Complete = () => {
    if (Object.keys(gad7Responses).length === gad7Questions.length) {
      // 점수 계산
      const phq9Score = Object.values(phq9Responses).reduce((sum, val) => sum + val, 0);
      const gad7Score = Object.values(gad7Responses).reduce((sum, val) => sum + val, 0);

      // 결과 페이지로 이동
      navigate('/checkin/result', {
        state: { phq9Score, gad7Score },
      });
    }
  };

  const renderIntro = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center space-y-6"
    >
      <div className="text-6xl mb-4">📋</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        주간 체크인
      </h2>
      <p className="text-gray-600 mb-6">
        지난 일주일간의 감정 상태를 확인해볼게요
      </p>

      <Card className="text-left">
        <h3 className="font-bold text-lg text-gray-800 mb-3">안내사항</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>지난 일주일 동안 느낀 감정에 대해 응답해주세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>정답은 없으니 솔직하게 답변해주세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500">•</span>
            <span>약 2-3분 정도 소요됩니다</span>
          </li>
        </ul>
      </Card>

      <Button onClick={() => setCurrentSection('phq9')} size="lg" fullWidth>
        시작하기
      </Button>
    </motion.div>
  );

  const renderQuestions = (
    questions: CheckInQuestion[],
    responses: Record<string, number>,
    onResponse: (questionId: string, score: number) => void,
    onComplete: () => void,
    title: string,
    subtitle: string
  ) => {
    const progress = (Object.keys(responses).length / questions.length) * 100;
    const canProceed = Object.keys(responses).length === questions.length;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* 진행률 */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{title}</span>
            <span>
              {Object.keys(responses).length} / {questions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-500"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
        </div>

        {/* 질문들 */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <div className="mb-4">
                <span className="text-sm text-gray-500">Q{index + 1}</span>
                <p className="text-gray-800 font-medium mt-1">{question.question}</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {scoreOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onResponse(question.id, option.value)}
                    className={`
                      p-3 rounded-lg text-xs font-medium whitespace-pre-line
                      transition-all
                      ${
                        responses[question.id] === option.value
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* 다음 버튼 */}
        <Button onClick={onComplete} disabled={!canProceed} size="lg" fullWidth>
          {canProceed ? '다음' : '모든 질문에 답변해주세요'}
        </Button>
      </motion.div>
    );
  };

  return (
    <Layout showHeader={false}>
      {/* 상단 헤더 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm p-4 mb-6 -mt-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">주간 체크인</h1>
          <div className="w-10" />
        </div>
      </div>

      {currentSection === 'intro' && renderIntro()}
      {currentSection === 'phq9' &&
        renderQuestions(
          phq9Questions,
          phq9Responses,
          handlePhq9Response,
          handlePhq9Complete,
          '우울감 체크',
          '지난 일주일 동안 얼마나 자주 다음과 같은 일들로 어려움을 겪었나요?'
        )}
      {currentSection === 'gad7' &&
        renderQuestions(
          gad7Questions,
          gad7Responses,
          handleGad7Response,
          handleGad7Complete,
          '불안감 체크',
          '지난 일주일 동안 얼마나 자주 다음과 같은 일들로 어려움을 겪었나요?'
        )}
    </Layout>
  );
};
