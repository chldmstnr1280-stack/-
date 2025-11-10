import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/Button';
import { SellyAvatar } from '../../components/SellyAvatar';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useSellyStore } from '../../stores/sellyStore';

const HSP_QUESTIONS = [
  '나는 센 자극에 압도되기 쉽다',
  '다른 사람의 기분에 영향을 많이 받는다',
  '통증에 민감한 편이다',
  '바쁜 날이 지속되면 침대나 어두운 곳에서 쉬고 싶어진다',
  '카페인에 민감하다',
  '밝은 빛, 강한 냄새, 거친 천에 쉽게 압도된다',
  '풍부한 상상력을 가지고 있다',
  '소음에 신경이 쓰인다',
  '예술이나 음악에 깊이 감동한다',
  '한번에 많은 일을 해야 할 때 불편함을 느낀다',
];

export const Day0Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentDay, completeStep } = useOnboardingStore();
  const { setStyle } = useSellyStore();
  const [step, setStep] = useState(0);
  const [hspAnswers, setHspAnswers] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState<'green' | 'pink' | 'blue' | 'yellow'>('green');

  const handleHSPAnswer = (value: number) => {
    const newAnswers = [...hspAnswers, value];
    setHspAnswers(newAnswers);

    if (newAnswers.length === HSP_QUESTIONS.length) {
      setStep(2); // Move to color selection
    }
  };

  const handleColorSelect = () => {
    setStyle(selectedColor);
    setStep(3); // Move to final welcome
  };

  const handleStart = () => {
    completeStep(0);
    setCurrentDay(1);
    navigate('/onboarding/day1');
  };

  if (step === 0) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '32px', color: '#2D5F4C', marginBottom: '16px' }}>
            SELLERY
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
            Self Love Reset
          </p>
          <p style={{ fontSize: '16px', color: '#888', marginBottom: '40px' }}>
            HSP를 위한 마음 돌봄 여정
          </p>

          <SellyAvatar stage="seed" style="green" size="large" />

          <div style={{ marginTop: '40px' }}>
            <Button onClick={() => setStep(1)} size="large" fullWidth>
              시작하기
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 1) {
    const currentQuestion = HSP_QUESTIONS[hspAnswers.length];
    const progress = (hspAnswers.length / HSP_QUESTIONS.length) * 100;

    return (
      <Layout showHeader title="HSP 자가 진단">
        <div style={{ padding: '20px 0' }}>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#E0E0E0',
              borderRadius: '4px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#2D5F4C',
                borderRadius: '4px',
                transition: 'width 0.3s',
              }}
            />
          </div>

          <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
            질문 {hspAnswers.length + 1} / {HSP_QUESTIONS.length}
          </p>

          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <p style={{ fontSize: '18px', color: '#333', marginBottom: '24px' }}>
              {currentQuestion}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: '전혀 그렇지 않다', value: 1 },
                { label: '그렇지 않은 편이다', value: 2 },
                { label: '보통이다', value: 3 },
                { label: '그런 편이다', value: 4 },
                { label: '매우 그렇다', value: 5 },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleHSPAnswer(option.value)}
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '2px solid #E0E0E0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2D5F4C';
                    e.currentTarget.style.backgroundColor = '#F5F9F7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E0E0E0';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 2) {
    const colors: Array<{ value: 'green' | 'pink' | 'blue' | 'yellow'; name: string; hex: string }> = [
      { value: 'green', name: '평온한 초록', hex: '#2D5F4C' },
      { value: 'pink', name: '따뜻한 핑크', hex: '#E8A5C5' },
      { value: 'blue', name: '차분한 파랑', hex: '#6FA8DC' },
      { value: 'yellow', name: '밝은 노랑', hex: '#FFD966' },
    ];

    return (
      <Layout showHeader title="셀리 스타일 선택">
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '16px' }}>
            셀리의 색을 골라주세요
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            함께 성장할 셀리의 모습을 정해요
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                style={{
                  padding: '24px',
                  backgroundColor: 'white',
                  border: selectedColor === color.value ? `3px solid ${color.hex}` : '2px solid #E0E0E0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    margin: '0 auto 12px',
                  }}
                />
                <p style={{ fontSize: '16px', color: '#333' }}>{color.name}</p>
              </button>
            ))}
          </div>

          <Button onClick={handleColorSelect} size="large" fullWidth>
            다음
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <SellyAvatar stage="seed" style={selectedColor} size="large" />

        <h2 style={{ fontSize: '28px', color: '#333', margin: '24px 0 16px' }}>
          만나서 반가워요!
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
          저는 셀리예요. 앞으로 7일 동안<br />
          함께 마음 돌봄 여정을 떠나봐요!
        </p>

        <div
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '32px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '16px' }}>
            7일 동안 이런 걸 할 거예요:
          </h3>
          <ul style={{ fontSize: '16px', color: '#666', lineHeight: '1.8' }}>
            <li>💭 매일 감정 기록하기</li>
            <li>🧘 마음 돌봄 루틴 실천</li>
            <li>📊 주간 마음 건강 체크</li>
            <li>🌱 셀리와 함께 성장하기</li>
          </ul>
        </div>

        <Button onClick={handleStart} size="large" fullWidth>
          여정 시작하기
        </Button>
      </div>
    </Layout>
  );
};
