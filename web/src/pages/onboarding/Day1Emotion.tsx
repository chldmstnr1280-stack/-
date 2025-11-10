import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/Button';
import { SellyAvatar } from '../../components/SellyAvatar';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useEmotionStore } from '../../stores/emotionStore';
import { useSellyStore } from '../../stores/sellyStore';

const EMOTION_TEMPLATES = [
  { emoji: '😊', text: '기분이 좋아요', color: '#FFE066' },
  { emoji: '😌', text: '평온해요', color: '#A8E6CF' },
  { emoji: '😔', text: '우울해요', color: '#B8C5D0' },
  { emoji: '😰', text: '불안해요', color: '#FFB3BA' },
  { emoji: '😤', text: '화가 나요', color: '#FFDFBA' },
  { emoji: '😴', text: '피곤해요', color: '#D5AAFF' },
];

export const Day1Emotion: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentDay, completeStep } = useOnboardingStore();
  const { addLog } = useEmotionStore();
  const { addExperience, stage, style } = useSellyStore();
  const [step, setStep] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState(EMOTION_TEMPLATES[0]);
  const [customText, setCustomText] = useState('');
  const [temperature, setTemperature] = useState(50);

  const handleEmotionSelect = (emotion: typeof EMOTION_TEMPLATES[0]) => {
    setSelectedEmotion(emotion);
    setCustomText(emotion.text);
    setStep(1);
  };

  const handleSave = () => {
    addLog({
      text: customText,
      emoji: selectedEmotion.emoji,
      color: selectedEmotion.color,
      temperature,
    });
    addExperience(10);
    setStep(2);
  };

  const handleContinue = () => {
    completeStep(1);
    setCurrentDay(2);
    navigate('/onboarding/day2');
  };

  if (step === 0) {
    return (
      <Layout showHeader title="Day 1: 감정 기록">
        <div style={{ padding: '20px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <SellyAvatar stage={stage} style={style} size="medium" />
            <p style={{ fontSize: '16px', color: '#666', marginTop: '16px' }}>
              오늘의 기분을 선택해주세요
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {EMOTION_TEMPLATES.map((emotion) => (
              <button
                key={emotion.emoji}
                onClick={() => handleEmotionSelect(emotion)}
                style={{
                  padding: '24px',
                  backgroundColor: 'white',
                  border: '2px solid #E0E0E0',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = selectedEmotion.color;
                  e.currentTarget.style.backgroundColor = '#F5F9F7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E0E0E0';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                  {emotion.emoji}
                </div>
                <p style={{ fontSize: '14px', color: '#666' }}>{emotion.text}</p>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 1) {
    return (
      <Layout showHeader title="감정 기록하기">
        <div style={{ padding: '20px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '64px' }}>
            {selectedEmotion.emoji}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '16px', color: '#333', display: 'block', marginBottom: '8px' }}>
              감정을 표현해보세요
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              maxLength={100}
              placeholder="어떤 기분인가요?"
              style={{
                width: '100%',
                padding: '16px',
                border: '2px solid #E0E0E0',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px',
              }}
            />
            <p style={{ fontSize: '14px', color: '#888', textAlign: 'right', marginTop: '4px' }}>
              {customText.length}/100
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '16px', color: '#333', display: 'block', marginBottom: '8px' }}>
              오늘의 감정 온도: {temperature}°C
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#888' }}>
              <span>차가워요</span>
              <span>뜨거워요</span>
            </div>
          </div>

          <Button onClick={handleSave} size="large" fullWidth>
            기록하기
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '16px' }}>
          첫 감정 기록 완료!
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
          +10 XP 획득했어요
        </p>

        <SellyAvatar stage={stage} style={style} size="large" showBadge />

        <div
          style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '16px',
            marginTop: '32px',
            marginBottom: '32px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
            "잘했어! 매일 감정을 기록하면서<br />
            마음을 돌보는 습관을 만들어가자!"<br />
            <span style={{ color: '#2D5F4C', fontWeight: 600 }}>- 셀리</span>
          </p>
        </div>

        <Button onClick={handleContinue} size="large" fullWidth>
          Day 2로 이동
        </Button>
      </div>
    </Layout>
  );
};
