import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart, Activity } from 'lucide-react';
import { Layout, Card, Button } from '../../components/common';
import { SellyCharacter, SellyStats } from '../../components/selly';
import { useUserStore } from '../../store/userStore';
import { useSellyStore } from '../../store/sellyStore';
import { useEmotionStore } from '../../store/emotionStore';
import { useRoutineStore } from '../../store/routineStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, onboardingProgress } = useUserStore();
  const { selly } = useSellyStore();
  const { getTodayEmotions } = useEmotionStore();
  const { initializeRoutines, routines } = useRoutineStore();

  useEffect(() => {
    initializeRoutines();
  }, [initializeRoutines]);

  const todayEmotions = getTodayEmotions();
  const currentMission = onboardingProgress.missions.find(
    (m) => m.day === onboardingProgress.currentDay
  );

  return (
    <Layout
      title={`안녕하세요, ${user?.name}님`}
      subtitle="오늘도 셀리와 함께 성장해요"
    >
      <div className="space-y-6">
        {/* 셀리 캐릭터 & 상태 */}
        <Card>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <SellyCharacter stage={selly.stage} style={selly.style} size="md" />
            </div>
            <div className="flex-1 w-full">
              <SellyStats selly={selly} />
            </div>
          </div>
        </Card>

        {/* 오늘의 미션 */}
        {currentMission && !currentMission.completed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-primary-50 to-emerald-50">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    Day {currentMission.day}: {currentMission.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {currentMission.description}
                  </p>
                  <ul className="space-y-1">
                    {currentMission.tasks.map((task, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="text-primary-500">•</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 빠른 액션 */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              hoverable
              onClick={() => navigate('/emotion/log')}
              className="cursor-pointer"
            >
              <div className="text-center py-4">
                <Heart className="w-12 h-12 mx-auto mb-3 text-pink-500" />
                <h3 className="font-semibold text-gray-800 mb-1">감정 기록</h3>
                <p className="text-xs text-gray-600">
                  오늘 {todayEmotions.length}회 기록
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              hoverable
              onClick={() => navigate('/routines')}
              className="cursor-pointer"
            >
              <div className="text-center py-4">
                <Activity className="w-12 h-12 mx-auto mb-3 text-primary-500" />
                <h3 className="font-semibold text-gray-800 mb-1">루틴 시작</h3>
                <p className="text-xs text-gray-600">
                  {routines.length}개 루틴 가능
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 플로팅 액션 버튼 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="fixed bottom-8 right-8"
        >
          <button
            onClick={() => navigate('/emotion/log')}
            className="
              w-16 h-16 rounded-full
              bg-gradient-to-r from-primary-500 to-emerald-500
              text-white shadow-2xl
              flex items-center justify-center
              hover:shadow-3xl hover:scale-110
              transition-all
            "
          >
            <Plus className="w-8 h-8" />
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};
