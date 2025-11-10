import React from 'react';
import type { SellyStage, SellyStyle } from '../types';

interface SellyAvatarProps {
  stage: SellyStage;
  style: SellyStyle;
  size?: 'small' | 'medium' | 'large';
  showBadge?: boolean;
}

const SELLY_EMOJIS: Record<SellyStage, string> = {
  seed: '🌱',
  sprout: '🌿',
  flower: '🌸',
  baby: '🐣',
};

const SIZE_MAP = {
  small: '40px',
  medium: '80px',
  large: '120px',
};

const STYLE_COLORS: Record<SellyStyle, string> = {
  green: '#2D5F4C',
  pink: '#E8A5C5',
  blue: '#6FA8DC',
  yellow: '#FFD966',
};

export const SellyAvatar: React.FC<SellyAvatarProps> = ({
  stage,
  style,
  size = 'medium',
  showBadge = false,
}) => {
  const emoji = SELLY_EMOJIS[stage];
  const dimension = SIZE_MAP[size];
  const bgColor = STYLE_COLORS[style];

  return (
    <div
      style={{
        position: 'relative',
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        backgroundColor: `${bgColor}20`,
        border: `3px solid ${bgColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size === 'small' ? '24px' : size === 'medium' ? '48px' : '72px',
      }}
    >
      {emoji}
      {showBadge && stage === 'baby' && (
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#FFD700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            border: '2px solid white',
          }}
        >
          ✨
        </div>
      )}
    </div>
  );
};
