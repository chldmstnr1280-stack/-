import React from 'react';
import { Layout } from '../../components/Layout';
import { SellyAvatar } from '../../components/SellyAvatar';
import { useEmotionStore } from '../../stores/emotionStore';
import { useSellyStore } from '../../stores/sellyStore';

export const Home: React.FC = () => {
  const { logs, getRecentLogs } = useEmotionStore();
  const { stage, style, experience, getEvolutionProgress } = useSellyStore();
  const recentLogs = getRecentLogs(5);
  const progress = getEvolutionProgress();

  const getSellyMessage = () => {
    const logCount = logs.length;
    if (logCount === 0) return '오늘의 감정을 기록해볼까? 💚';
    if (logCount < 3) return '좋아! 계속 함께 해줘서 고마워 🌱';
    if (logCount < 7) return '우리 벌써 이렇게 자랐어! 🌸';
    return '너와 함께여서 정말 행복해! 💚';
  };

  return (
    <Layout showHeader title="홈">
      <div style={{ padding: '20px 0' }}>
        {/* Selly Garden */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '24px',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <SellyAvatar stage={stage} style={style} size="large" showBadge={stage === 'baby'} />
          <p style={{ fontSize: '16px', color: '#666', margin: '16px 0 24px' }}>
            {getSellyMessage()}
          </p>

          <div style={{ marginBottom: '8px' }}>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#E0E0E0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#2D5F4C',
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <p style={{ fontSize: '14px', color: '#888', textAlign: 'right', marginTop: '4px' }}>
              {experience} XP
            </p>
          </div>
        </div>

        {/* Recent Emotions */}
        <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '16px' }}>
          최근 감정 기록
        </h3>
        {recentLogs.length === 0 ? (
          <div
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <p style={{ fontSize: '16px', color: '#888' }}>
              아직 기록이 없어요<br />
              오늘의 감정을 기록해보세요!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '60px',
                    backgroundColor: log.color,
                    borderRadius: '4px',
                  }}
                />
                <div style={{ fontSize: '32px' }}>{log.emoji}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '16px', color: '#333', marginBottom: '4px' }}>
                    {log.text}
                  </p>
                  <p style={{ fontSize: '14px', color: '#888' }}>
                    {new Date(log.date).toLocaleDateString('ko-KR')} · {log.temperature}°C
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          {[
            { icon: '💭', label: '감정 기록', value: logs.length },
            { icon: '🔥', label: '연속 기록', value: 3 },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#2D5F4C' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
