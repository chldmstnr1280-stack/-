import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Layout } from '../../components/common';
import { useUserStore } from '../../store/userStore';

export const NameInput: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const handleNext = () => {
    if (name.trim()) {
      // 사용자 정보 생성
      setUser({
        id: `user-${Date.now()}`,
        name: name.trim(),
        createdAt: new Date(),
        currentOnboardingDay: 0,
        onboardingCompleted: false,
      });
      navigate('/onboarding/style');
    }
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* 진행 표시 */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <div className="h-1 flex-1 bg-primary-500 rounded-full" />
              <div className="h-1 flex-1 bg-gray-200 rounded-full" />
              <div className="h-1 flex-1 bg-gray-200 rounded-full" />
            </div>
            <p className="text-sm text-gray-600">1/3단계</p>
          </div>

          {/* 질문 */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              반가워요! 👋
            </h2>
            <p className="text-gray-600">
              어떻게 불러드릴까요?
            </p>
          </div>

          {/* 입력 */}
          <div className="mb-8">
            <Input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={setName}
              fullWidth
              className="text-lg"
            />
          </div>

          {/* 버튼 */}
          <Button
            onClick={handleNext}
            disabled={!name.trim()}
            fullWidth
            size="lg"
          >
            다음
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};
