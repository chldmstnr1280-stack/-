import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Layout, Button } from '../../components/common';
import { Timer } from '../../components/routines';
import { useRoutineStore } from '../../store/routineStore';
import { useSellyStore } from '../../store/sellyStore';
import { useGamificationStore } from '../../store/gamificationStore';
import { useUserStore } from '../../store/userStore';

export const RoutineExecutePage: React.FC = () => {
  const navigate = useNavigate();
  const { routineId } = useParams<{ routineId: string }>();
  const { user } = useUserStore();
  const { routines, addCompletion } = useRoutineStore();
  const { addExperience } = useSellyStore();
  const { addPoints, checkAndLevelUp } = useGamificationStore();

  const [showCompletion, setShowCompletion] = useState(false);

  const routine = routines.find((r) => r.id === routineId);

  useEffect(() => {
    if (!routine) {
      navigate('/routines');
    }
  }, [routine, navigate]);

  const handleComplete = () => {
    if (!routine || !user) return;

    // 완료 기록 추가
    addCompletion({
      id: `completion-${Date.now()}`,
      userId: user.id,
      routineId: routine.id,
      completedAt: new Date(),
      pointsEarned: routine.points,
    });

    // 경험치 추가 (루틴 포인트와 동일)
    addExperience(routine.points);

    // 포인트 추가
    addPoints(routine.points);

    // 레벨업 체크
    checkAndLevelUp();

    // 완료 화면 표시
    setShowCompletion(true);
  };

  const handleFinish = () => {
    navigate('/home');
  };

  if (!routine) return null;

  return (
    <Layout showHeader={false}>
      {/* 상단 헤더 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm p-4 mb-6 -mt-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/routines')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">{routine.title}</h1>
          <div className="w-10" /> {/* 스페이서 */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!showCompletion ? (
            <motion.div
              key="timer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* 루틴 정보 */}
              <div className="text-center">
                <div className="text-6xl mb-4">{routine.icon}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {routine.title}
                </h2>
                <p className="text-gray-600">{routine.description}</p>
              </div>

              {/* 타이머 */}
              <div className="flex justify-center">
                <Timer duration={routine.duration} onComplete={handleComplete} />
              </div>

              {/* 안내 */}
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 text-center">
                  💡 편안한 자세로 집중해보세요
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-12"
            >
              {/* 축하 애니메이션 */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-24 h-24 text-yellow-400 mx-auto" />
              </motion.div>

              {/* 완료 메시지 */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  루틴 완료!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  {routine.title}을(를) 완료했어요
                </p>

                {/* 획득 보상 */}
                <div className="bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">경험치</p>
                      <p className="text-2xl font-bold text-primary-600">
                        +{routine.points} XP
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">포인트</p>
                      <p className="text-2xl font-bold text-primary-600">
                        +{routine.points}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 완료 버튼 */}
              <Button onClick={handleFinish} size="lg" fullWidth>
                홈으로 돌아가기
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};
