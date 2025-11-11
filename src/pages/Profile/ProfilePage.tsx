import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, TrendingUp, Heart, Activity, Flame } from 'lucide-react';
import { Layout, Card, Button } from '../../components/common';
import { SellyCharacter } from '../../components/selly';
import { useUserStore } from '../../store/userStore';
import { useSellyStore } from '../../store/sellyStore';
import { useGamificationStore } from '../../store/gamificationStore';
import { useEmotionStore } from '../../store/emotionStore';
import { useRoutineStore } from '../../store/routineStore';
import { allBadges, checkBadgeUnlock } from '../../utils/badges';
import { SellyStage } from '../../types';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { selly } = useSellyStore();
  const { points, level, badges, streak, unlockBadge } = useGamificationStore();
  const { emotions } = useEmotionStore();
  const { completions } = useRoutineStore();

  // 뱃지 자동 획득 체크
  useEffect(() => {
    const stats = {
      emotionCount: emotions.length,
      routineCompletions: completions.length,
      streak,
      level,
      onboardingCompleted: user?.onboardingCompleted || false,
      hasCheckedIn: false, // TODO: 실제 체크인 여부 확인
      sellyEvolved: selly.stage === SellyStage.CHARACTER,
    };

    allBadges.forEach((badge) => {
      const alreadyUnlocked = badges.some((b) => b.id === badge.id);
      if (!alreadyUnlocked && checkBadgeUnlock(badge.id, stats)) {
        unlockBadge(badge);
      }
    });
  }, [emotions.length, completions.length, streak, level, user, selly.stage, badges, unlockBadge]);

  const lockedBadges = allBadges.filter(
    (badge) => !badges.some((b) => b.id === badge.id)
  );

  return (
    <Layout title="프로필" subtitle={`${user?.name}님의 정원`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 사용자 정보 카드 */}
        <Card className="text-center">
          <div className="mb-6">
            <SellyCharacter stage={selly.stage} style={selly.style} size="md" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.name}</h2>
          <p className="text-gray-600 mb-4">레벨 {level}</p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-primary-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">총 포인트</p>
              <p className="text-2xl font-bold text-primary-600">{points}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">연속 기록</p>
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <p className="text-2xl font-bold text-orange-600">{streak}일</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 활동 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{emotions.length}</p>
            <p className="text-sm text-gray-600">감정 기록</p>
          </Card>

          <Card className="text-center">
            <Activity className="w-8 h-8 text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{completions.length}</p>
            <p className="text-sm text-gray-600">루틴 완료</p>
          </Card>

          <Card className="text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{badges.length}</p>
            <p className="text-sm text-gray-600">획득 뱃지</p>
          </Card>

          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">{level}</p>
            <p className="text-sm text-gray-600">레벨</p>
          </Card>
        </div>

        {/* 획득한 뱃지 */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            획득한 뱃지 ({badges.length}/{allBadges.length})
          </h3>

          {badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="text-center">
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h4 className="font-bold text-gray-800 mb-1">{badge.title}</h4>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                    {badge.unlockedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-gray-600">아직 획득한 뱃지가 없어요</p>
              <p className="text-sm text-gray-500 mt-2">활동을 통해 뱃지를 모아보세요!</p>
            </Card>
          )}
        </div>

        {/* 잠긴 뱃지 */}
        {lockedBadges.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">잠긴 뱃지</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {lockedBadges.slice(0, 6).map((badge) => (
                <Card key={badge.id} className="text-center opacity-50">
                  <div className="text-5xl mb-3 filter grayscale">{badge.icon}</div>
                  <h4 className="font-bold text-gray-800 mb-1">{badge.title}</h4>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 버튼들 */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => navigate('/home')} fullWidth>
            홈으로
          </Button>
          <Button variant="secondary" onClick={() => navigate('/report')} fullWidth>
            주간 리포트
          </Button>
        </div>
      </div>
    </Layout>
  );
};
