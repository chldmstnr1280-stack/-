import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = false,
  title = '',
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F9F7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {showHeader && (
        <header
          style={{
            backgroundColor: '#2D5F4C',
            color: 'white',
            padding: '16px 20px',
            fontSize: '20px',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {title}
        </header>
      )}
      <main
        style={{
          flex: 1,
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        {children}
      </main>
    </div>
  );
};
