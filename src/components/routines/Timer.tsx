import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  duration: number; // 분 단위
  onComplete: () => void;
  autoStart?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ duration, onComplete, autoStart = false }) => {
  const [seconds, setSeconds] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsCompleted(true);
          setIsRunning(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isCompleted, onComplete]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = ((duration * 60 - seconds) / (duration * 60)) * 100;

  const handleReset = () => {
    setSeconds(duration * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 원형 타이머 */}
      <div className="relative w-64 h-64">
        {/* 배경 원 */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="112"
            stroke="#e5e7eb"
            strokeWidth="16"
            fill="none"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="112"
            stroke="url(#gradient)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 704' }}
            animate={{
              strokeDasharray: `${(progress / 100) * 704} 704`,
            }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* 시간 표시 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800">
              {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {isCompleted ? '완료!' : isRunning ? '진행 중' : '준비'}
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex gap-4">
        {!isCompleted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
            className="
              w-16 h-16 rounded-full
              bg-gradient-to-r from-primary-500 to-emerald-500
              text-white shadow-lg
              flex items-center justify-center
            "
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="
            w-16 h-16 rounded-full
            bg-gray-200 text-gray-700
            flex items-center justify-center
            hover:bg-gray-300 transition-colors
          "
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>
      </div>

      {/* 진행률 */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          진행률: <span className="font-bold text-primary-600">{Math.round(progress)}%</span>
        </p>
      </div>
    </div>
  );
};
