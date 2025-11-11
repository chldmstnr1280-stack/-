import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'pink' | 'gold';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  color = 'primary',
  className = '',
}) => {
  const colorStyles = {
    primary: 'bg-gradient-to-r from-primary-500 to-emerald-500',
    pink: 'bg-gradient-to-r from-pink-400 to-pink-600',
    gold: 'bg-gradient-to-r from-yellow-400 to-amber-500',
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-bold text-primary-600">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${colorStyles[color]} rounded-full`}
        />
      </div>
    </div>
  );
};
