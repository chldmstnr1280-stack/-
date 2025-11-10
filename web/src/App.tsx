import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useOnboardingStore } from './stores/onboardingStore';
import { useSellyStore } from './stores/sellyStore';
import { Day0Welcome } from './pages/onboarding/Day0Welcome';
import { Day1Emotion } from './pages/onboarding/Day1Emotion';
import { Day7Complete } from './pages/onboarding/Day7Complete';
import { Home } from './pages/main/Home';
import { MainLayout } from './components/MainLayout';
import { Layout } from './components/Layout';
import { Button } from './components/Button';

function App() {
  const { isComplete } = useOnboardingStore();

  return (
    <BrowserRouter>
      <Routes>
        {!isComplete ? (
          <>
            <Route path="/" element={<Day0Welcome />} />
            <Route path="/onboarding/day0" element={<Day0Welcome />} />
            <Route path="/onboarding/day1" element={<Day1Emotion />} />
            <Route path="/onboarding/day2" element={<DayPlaceholder day={2} nextDay={3} />} />
            <Route path="/onboarding/day3" element={<DayPlaceholder day={3} nextDay={4} />} />
            <Route path="/onboarding/day4" element={<DayPlaceholder day={4} nextDay={5} />} />
            <Route path="/onboarding/day5" element={<DayPlaceholder day={5} nextDay={7} />} />
            <Route path="/onboarding/day7" element={<Day7Complete />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/routine" element={<RoutinePlaceholder />} />
              <Route path="/market" element={<MarketPlaceholder />} />
              <Route path="/profile" element={<ProfilePlaceholder />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

// Placeholder components for remaining days
const DayPlaceholder: React.FC<{ day: number; nextDay: number }> = ({ day, nextDay }) => {
  const navigate = useNavigate();
  const { setCurrentDay, completeStep } = useOnboardingStore();
  const { addExperience } = useSellyStore();

  const handleContinue = () => {
    completeStep(day);
    addExperience(10);
    setCurrentDay(nextDay);
    navigate(`/onboarding/day${nextDay}`);
  };

  return (
    <Layout showHeader title={`Day ${day}`}>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>📝</div>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '16px' }}>
          Day {day} 활동
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
          계속해서 마음 돌봄을 실천해봐요
        </p>
        <Button onClick={handleContinue} size="large" fullWidth>
          Day {nextDay}로 이동
        </Button>
      </div>
    </Layout>
  );
};

const RoutinePlaceholder = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🧘</div>
    <h2 style={{ fontSize: '24px', color: '#333' }}>루틴</h2>
    <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
      마음 돌봄 루틴을 실천해요
    </p>
  </div>
);

const MarketPlaceholder = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛍️</div>
    <h2 style={{ fontSize: '24px', color: '#333' }}>마켓</h2>
    <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
      프리미엄 콘텐츠를 만나보세요
    </p>
  </div>
);

const ProfilePlaceholder = () => (
  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
    <div style={{ fontSize: '64px', marginBottom: '16px' }}>👤</div>
    <h2 style={{ fontSize: '24px', color: '#333' }}>프로필</h2>
    <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
      내 정보와 통계를 확인해요
    </p>
  </div>
);

export default App;
