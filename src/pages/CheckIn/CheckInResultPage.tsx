import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Layout, Button, Card } from '../../components/common';
import { useSellyStore } from '../../store/sellyStore';
import { useGamificationStore } from '../../store/gamificationStore';

interface LocationState {
  phq9Score: number;
  gad7Score: number;
}

export const CheckInResultPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { addExperience } = useSellyStore();
  const { addPoints } = useGamificationStore();

  // 체크인 완료 보상
  React.useEffect(() => {
    addExperience(20);
    addPoints(20);
  }, [addExperience, addPoints]);

  if (!state) {
    navigate('/home');
    return null;
  }

  const { phq9Score, gad7Score } = state;

  // 점수별 해석
  const getPhq9Interpretation = (score: number) => {
    if (score <= 4) return { level: '정상', color: 'text-green-600', icon: <TrendingDown /> };
    if (score <= 9) return { level: '가벼운 우울', color: 'text-yellow-600', icon: <Minus /> };
    if (score <= 14) return { level: '중간 정도 우울', color: 'text-orange-600', icon: <TrendingUp /> };
    return { level: '심한 우울', color: 'text-red-600', icon: <TrendingUp /> };
  };

  const getGad7Interpretation = (score: number) => {
    if (score <= 4) return { level: '정상', color: 'text-green-600', icon: <TrendingDown /> };
    if (score <= 9) return { level: '가벼운 불안', color: 'text-yellow-600', icon: <Minus /> };
    if (score <= 14) return { level: '중간 정도 불안', color: 'text-orange-600', icon: <TrendingUp /> };
    return { level: '심한 불안', color: 'text-red-600', icon: <TrendingUp /> };
  };

  const phq9Result = getPhq9Interpretation(phq9Score);
  const gad7Result = getGad7Interpretation(gad7Score);

  return (
    <Layout title="체크인 결과" subtitle="지난 일주일의 감정 상태">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* 완료 메시지 */}
        <Card className="bg-gradient-to-r from-primary-50 to-emerald-50 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-bold text-xl text-gray-800 mb-2">체크인 완료!</h3>
          <p className="text-gray-600 mb-4">
            솔직하게 답변해주셔서 감사합니다
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="text-primary-600 font-medium">+20 XP</span>
            <span className="text-primary-600 font-medium">+20 포인트</span>
          </div>
        </Card>

        {/* 우울감 결과 */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">우울감 체크</h3>
              <p className="text-sm text-gray-600">PHQ-9 간소화 버전</p>
            </div>
            <div className={`flex items-center gap-2 ${phq9Result.color}`}>
              {phq9Result.icon}
            </div>
          </div>

          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl font-bold text-gray-800">{phq9Score}</span>
            <span className="text-lg text-gray-600 mb-1">/ 15점</span>
          </div>

          <div className={`inline-block px-4 py-2 rounded-full ${phq9Result.color} bg-opacity-10 font-medium`}>
            {phq9Result.level}
          </div>
        </Card>

        {/* 불안감 결과 */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">불안감 체크</h3>
              <p className="text-sm text-gray-600">GAD-7 간소화 버전</p>
            </div>
            <div className={`flex items-center gap-2 ${gad7Result.color}`}>
              {gad7Result.icon}
            </div>
          </div>

          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl font-bold text-gray-800">{gad7Score}</span>
            <span className="text-lg text-gray-600 mb-1">/ 12점</span>
          </div>

          <div className={`inline-block px-4 py-2 rounded-full ${gad7Result.color} bg-opacity-10 font-medium`}>
            {gad7Result.level}
          </div>
        </Card>

        {/* 안내 */}
        <Card className="bg-blue-50">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-2">안내</h4>
              <p className="text-sm text-gray-600 mb-2">
                이 결과는 참고용이며, 전문적인 진단을 대체하지 않습니다.
              </p>
              <p className="text-sm text-gray-600">
                지속적으로 어려움을 겪고 있다면 전문가의 도움을 받는 것을 권장합니다.
              </p>
            </div>
          </div>
        </Card>

        {/* 셀리의 메시지 */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🌱</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-2">셀리의 메시지</h4>
              <p className="text-sm text-gray-700">
                {(phq9Score + gad7Score) <= 8
                  ? '훌륭해요! 감정을 잘 관리하고 있어요. 계속 이대로 유지해봐요.'
                  : (phq9Score + gad7Score) <= 18
                  ? '가끔 힘든 순간이 있지만 괜찮아요. 루틴을 통해 함께 회복해나가요.'
                  : '요즘 많이 힘들죠? 매일 조금씩 감정을 기록하며 함께 극복해나가요.'}
              </p>
            </div>
          </div>
        </Card>

        {/* 버튼 */}
        <Button onClick={() => navigate('/home')} size="lg" fullWidth>
          홈으로 돌아가기
        </Button>
      </motion.div>
    </Layout>
  );
};
