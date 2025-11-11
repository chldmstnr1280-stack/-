import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Award, TrendingUp, Heart } from 'lucide-react';
import { Layout, Button, Card } from '../../components/common';
import { SellyCharacter } from '../../components/selly';
import { useUserStore } from '../../store/userStore';
import { useSellyStore } from '../../store/sellyStore';
import { useGamificationStore } from '../../store/gamificationStore';
import { useEmotionStore } from '../../store/emotionStore';
import { SellyStage } from '../../types';

export const EvolutionCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateOnboardingDay, completeOnboardingMission } = useUserStore();
  const { selly, updateStage } = useSellyStore();
  const { points, level, badges } = useGamificationStore();
  const { emotions } = useEmotionStore();

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Day 7 미션 완료
    completeOnboardingMission(7);

    // 셀리를 최종 진화
    if (selly.stage !== SellyStage.CHARACTER) {
      updateStage(SellyStage.CHARACTER);
    }

    // 온보딩 완료
    if (user) {
      updateOnboardingDay(7);
    }

    // 3초 후 confetti 종료
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [completeOnboardingMission, updateStage, updateOnboardingDay, selly.stage, user]);

  return (
    <Layout showHeader={false}>
      {/* Confetti 효과 */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  opacity: 1,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 360,
                  opacity: 0,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 0.5,
                  ease: 'linear',
                }}
                className="absolute"
              >
                {['🎉', '✨', '🌟', '💚', '🌸'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full space-y-8"
        >
          {/* 메인 축하 카드 */}
          <Card className="text-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            </motion.div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              축하합니다, {user?.name}님!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              7일간의 여정을 완주하셨어요
            </p>

            {/* 셀리 캐릭터 */}
            <div className="my-8">
              <SellyCharacter stage={SellyStage.CHARACTER} style={selly.style} size="lg" />
            </div>

            <p className="text-lg text-gray-700 mb-2">
              셀리가 <span className="font-bold text-primary-600">꼬마 셀리</span>로 최종 진화했어요!
            </p>
          </Card>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{emotions.length}</p>
              <p className="text-sm text-gray-600">감정 기록</p>
            </Card>

            <Card className="text-center">
              <TrendingUp className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{level}</p>
              <p className="text-sm text-gray-600">레벨</p>
            </Card>

            <Card className="text-center">
              <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{points}</p>
              <p className="text-sm text-gray-600">포인트</p>
            </Card>

            <Card className="text-center">
              <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{badges.length}</p>
              <p className="text-sm text-gray-600">뱃지</p>
            </Card>
          </div>

          {/* 앞으로의 여정 */}
          <Card className="bg-gradient-to-r from-primary-50 to-emerald-50">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🌱</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  새로운 시작
                </h3>
                <p className="text-gray-700 mb-4">
                  7일간의 온보딩이 끝났지만, 진짜 여정은 이제부터예요.
                  셀리와 함께 매일 감정을 기록하고 성장해나가요.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span>
                    <span>매일 감정 기록하기</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span>
                    <span>주간 체크인으로 감정 점검하기</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span>
                    <span>루틴으로 마음 챙기기</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span>
                    <span>정원 마켓에서 셀리 꾸미기</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 특별 보상 */}
          <Card className="text-center bg-gradient-to-r from-yellow-50 to-amber-50">
            <Award className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              온보딩 완료 보상
            </h3>
            <div className="flex justify-center gap-6 text-sm">
              <div>
                <p className="text-2xl font-bold text-primary-600">+100</p>
                <p className="text-gray-600">경험치</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-600">+100</p>
                <p className="text-gray-600">포인트</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">+1</p>
                <p className="text-gray-600">특별 뱃지</p>
              </div>
            </div>
          </Card>

          {/* 버튼 */}
          <Button onClick={() => navigate('/home')} size="lg" fullWidth>
            정원으로 돌아가기
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};
