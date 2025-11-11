import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/userStore';

// Pages
import { Welcome, NameInput, StyleSelect, Complete } from './pages/Onboarding';
import { HomePage } from './pages/Home';
import { EmotionLogPage } from './pages/EmotionLog';
import { RoutinesPage, RoutineExecutePage } from './pages/Routines';
import { CheckInPage, CheckInResultPage } from './pages/CheckIn';
import { EvolutionCompletePage } from './pages/Evolution';
import { ProfilePage } from './pages/Profile';
import { ReportPage } from './pages/Report';

const App: React.FC = () => {
  const { user } = useUserStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* 온보딩 플로우 */}
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding/name" element={<NameInput />} />
        <Route path="/onboarding/style" element={<StyleSelect />} />
        <Route path="/onboarding/complete" element={<Complete />} />

        {/* 메인 앱 */}
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/emotion/log"
          element={user ? <EmotionLogPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/routines"
          element={user ? <RoutinesPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/routines/:routineId"
          element={user ? <RoutineExecutePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/checkin"
          element={user ? <CheckInPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/checkin/result"
          element={user ? <CheckInResultPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/evolution/complete"
          element={user ? <EvolutionCompletePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/report"
          element={user ? <ReportPage /> : <Navigate to="/" replace />}
        />

        {/* 404 - 기본 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
