import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/home', icon: '🏡', label: '홈' },
    { path: '/routine', icon: '🧘', label: '루틴' },
    { path: '/market', icon: '🛍️', label: '마켓' },
    { path: '/profile', icon: '👤', label: '프로필' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F9F7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main
        style={{
          flex: 1,
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          paddingBottom: '80px',
        }}
      >
        <Outlet />
      </main>

      {/* Bottom Tab Navigation */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTop: '1px solid #E0E0E0',
          height: '70px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1,
                height: '100%',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                color: isActive ? '#2D5F4C' : '#A0B5AC',
                transition: 'color 0.2s',
              }}
            >
              <div style={{ fontSize: '24px' }}>{tab.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400 }}>
                {tab.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
