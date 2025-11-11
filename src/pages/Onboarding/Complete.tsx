import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Layout } from '../../components/common';
import { SellyCharacter } from '../../components/selly';
import { useUserStore } from '../../store/userStore';
import { useSellyStore } from '../../store/sellyStore';

export const Complete: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateOnboardingDay, completeOnboardingMission } = useUserStore();
  const { selly } = useSellyStore();

  useEffect(() => {
    // Day 0 미션 완료
    completeOnboardingMission(0);
  }, [completeOnboardingMission]);

  const handleEnterGarden = () => {
    updateOnboardingDay(1);
    navigate('/home');
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          {/* 진행 표시 */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <div className="h-1 flex-1 bg-primary-500 rounded-full" />
              <div className="h-1 flex-1 bg-primary-500 rounded-full" />
              <div className="h-1 flex-1 bg-primary-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-600">3/3단계 완료!</p>
          </div>

          {/* 축하 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              환영합니다, {user?.name}님! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              셀리와 함께하는 7일간의 여정을 시작합니다
            </p>
          </motion.div>

          {/* 셀리 캐릭터 */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="mb-8"
          >
            <SellyCharacter stage={selly.stage} style={selly.style} size="lg" />
          </motion.div>

          {/* 안내 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-8 bg-primary-50 rounded-xl p-4"
          >
            <p className="text-sm text-gray-700">
              💡 매일 감정을 기록하고 루틴을 수행하면
              <br />
              셀리가 성장해요!
            </p>
          </motion.div>

          {/* 입장 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Button onClick={handleEnterGarden} fullWidth size="lg">
              정원 입장하기 🌿
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};
