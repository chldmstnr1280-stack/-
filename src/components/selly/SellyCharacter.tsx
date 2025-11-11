import React from 'react';
import { motion } from 'framer-motion';
import { SellyStage, SellyStyle } from '../../types';

interface SellyCharacterProps {
  stage: SellyStage;
  style: SellyStyle;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const SellyCharacter: React.FC<SellyCharacterProps> = ({
  stage,
  style,
  size = 'md',
  animate = true,
}) => {
  // 성장 단계별 이모지
  const stageEmojis = {
    [SellyStage.SEED]: '🌱',
    [SellyStage.SPROUT]: '🌿',
    [SellyStage.FLOWER]: '🌸',
    [SellyStage.CHARACTER]: '🧚‍♀️',
  };

  // 색상별 그라데이션
  const colorGradients = {
    green: 'from-green-400 to-emerald-500',
    pink: 'from-pink-400 to-pink-600',
    gold: 'from-yellow-400 to-amber-500',
  };

  // 크기별 스타일
  const sizeStyles = {
    sm: 'text-4xl w-20 h-20',
    md: 'text-6xl w-32 h-32',
    lg: 'text-8xl w-48 h-48',
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  const MotionWrapper = animate ? motion.div : 'div';
  const animationProps = animate ? { animate: floatAnimation } : {};

  return (
    <div className="flex flex-col items-center justify-center">
      <MotionWrapper
        className={`
          ${sizeStyles[size]}
          flex items-center justify-center
          bg-gradient-to-br ${colorGradients[style.color]}
          rounded-full shadow-2xl
          relative
        `}
        {...animationProps}
      >
        {/* 캐릭터 이모지 */}
        <span className="drop-shadow-lg">{stageEmojis[stage]}</span>

        {/* 악세서리 표시 (향후 확장) */}
        {style.accessories && style.accessories.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
            <span className="text-xs">+{style.accessories.length}</span>
          </div>
        )}
      </MotionWrapper>

      {/* 성장 단계 텍스트 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-center"
      >
        <p className="text-sm font-medium text-gray-600">
          {getStageName(stage)}
        </p>
      </motion.div>
    </div>
  );
};

// 한글 성장 단계 이름
function getStageName(stage: SellyStage): string {
  const names = {
    [SellyStage.SEED]: '씨앗',
    [SellyStage.SPROUT]: '새싹',
    [SellyStage.FLOWER]: '꽃',
    [SellyStage.CHARACTER]: '꼬마 셀리',
  };
  return names[stage];
}
