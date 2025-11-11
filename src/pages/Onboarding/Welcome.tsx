import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/common';
import { useNavigate } from 'react-router-dom';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {/* 로고/타이틀 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl mb-4">🌱</div>
          <h1 className="text-4xl font-bold text-primary-700 mb-2">
            SELLERY
          </h1>
          <p className="text-lg text-gray-600">
            Self Love Reset
          </p>
        </motion.div>

        {/* 설명 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 space-y-3"
        >
          <p className="text-gray-700">
            감정의 정원에서 성장하는
          </p>
          <p className="text-gray-700">
            HSP를 위한 디지털 치료제
          </p>
          <p className="text-xl font-semibold text-primary-600 mt-6">
            당신의 감정을 이해하고,
            <br />
            셀리와 함께 성장해요 💚
          </p>
        </motion.div>

        {/* 시작 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={() => navigate('/onboarding/name')}
            size="lg"
            fullWidth
          >
            시작하기
          </Button>
        </motion.div>

        {/* 작은 정보 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-gray-500"
        >
          7일간의 여정을 통해 셀리와 함께 성장하세요
        </motion.p>
      </motion.div>
    </div>
  );
};
