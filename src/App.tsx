import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/userStore';

// Pages
import { Welcome, NameInput, StyleSelect, Complete } from './pages/Onboarding';
import { HomePage } from './pages/Home';
import { EmotionLogPage } from './pages/EmotionLog';

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

        {/* 404 - 기본 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
