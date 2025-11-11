import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/common';
import { RoutineCard } from '../../components/routines';
import { useRoutineStore } from '../../store/routineStore';
import { Routine, RoutineType } from '../../types';

export const RoutinesPage: React.FC = () => {
  const navigate = useNavigate();
  const { routines, initializeRoutines, getTodayCompletions } = useRoutineStore();

  useEffect(() => {
    initializeRoutines();
  }, [initializeRoutines]);

  const todayCompletions = getTodayCompletions();

  // 루틴 타입별 그룹화
  const meditationRoutines = routines.filter((r) => r.type === RoutineType.MEDITATION);
  const breathingRoutines = routines.filter((r) => r.type === RoutineType.BREATHING);
  const activityRoutines = routines.filter((r) => r.type === RoutineType.ACTIVITY);

  const handleStartRoutine = (routine: Routine) => {
    navigate(`/routines/${routine.id}`);
  };

  return (
    <Layout title="루틴" subtitle="나에게 맞는 루틴을 시작해보세요">
      <div className="space-y-6">
        {/* 오늘의 완료 현황 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-emerald-50 rounded-2xl p-6"
        >
          <h3 className="font-bold text-lg text-gray-800 mb-2">오늘의 활동</h3>
          <p className="text-3xl font-bold text-primary-600">
            {todayCompletions.length}회 <span className="text-lg text-gray-600">완료</span>
          </p>
        </motion.div>

        {/* 명상 루틴 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">🧘‍♀️</div>
            <h2 className="text-xl font-bold text-gray-800">명상</h2>
          </div>
          <div className="space-y-3">
            {meditationRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} onStart={handleStartRoutine} />
            ))}
          </div>
        </div>

        {/* 호흡법 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">🌬️</div>
            <h2 className="text-xl font-bold text-gray-800">호흡법</h2>
          </div>
          <div className="space-y-3">
            {breathingRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} onStart={handleStartRoutine} />
            ))}
          </div>
        </div>

        {/* 활동 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">🚶‍♀️</div>
            <h2 className="text-xl font-bold text-gray-800">활동</h2>
          </div>
          <div className="space-y-3">
            {activityRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} onStart={handleStartRoutine} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
