import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  type = 'button',
}) => {
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#2D5F4C',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#A0B5AC',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#2D5F4C',
      border: '2px solid #2D5F4C',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: {
      padding: '8px 16px',
      fontSize: '14px',
    },
    medium: {
      padding: '12px 24px',
      fontSize: '16px',
    },
    large: {
      padding: '16px 32px',
      fontSize: '18px',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {children}
    </button>
  );
};
