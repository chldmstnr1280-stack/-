import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/Button';
import { SellyAvatar } from '../../components/SellyAvatar';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useEmotionStore } from '../../stores/emotionStore';
import { useRoutineStore } from '../../stores/routineStore';
import { useSurveyStore } from '../../stores/surveyStore';
import { useSellyStore } from '../../stores/sellyStore';

export const Day7Complete: React.FC = () => {
  const navigate = useNavigate();
  const { setIsComplete } = useOnboardingStore();
  const { logs } = useEmotionStore();
  const { getCompletedCount } = useRoutineStore();
  const { results } = useSurveyStore();
  const { stage, style, experience } = useSellyStore();

  const handleStartApp = () => {
    setIsComplete(true);
    navigate('/home');
  };

  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
        <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '16px' }}>
          7일 여정 완주!
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
          정말 잘했어요!
        </p>

        <SellyAvatar stage={stage} style={style} size="large" showBadge />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            margin: '32px 0',
          }}
        >
          {[
            { icon: '📅', title: '7일 완주', value: '7/7일' },
            { icon: '💭', title: '감정 기록', value: `${logs.length}회` },
            { icon: '🧘', title: '루틴 완료', value: `${getCompletedCount()}회` },
            { icon: '📊', title: '설문 완료', value: `${results.length}회` },
          ].map((stat) => (
            <div
              key={stat.title}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>
                {stat.title}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#2D5F4C' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

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
          <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
            "7일 동안 함께해줘서 정말 고마워!<br />
            이제부터는 본격적으로<br />
            마음 돌봄 여정을 이어가보자!"<br />
            <span style={{ color: '#2D5F4C', fontWeight: 600 }}>- 셀리 ({experience} XP)</span>
          </p>
        </div>

        <Button onClick={handleStartApp} size="large" fullWidth>
          앱 시작하기
        </Button>
      </div>
    </Layout>
  );
};
