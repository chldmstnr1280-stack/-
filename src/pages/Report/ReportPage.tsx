import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Layout, Card, Button } from '../../components/common';
import { useEmotionStore } from '../../store/emotionStore';
import { useRoutineStore } from '../../store/routineStore';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { emotions } = useEmotionStore();
  const { completions } = useRoutineStore();

  // 이번 주 범위
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // 월요일 시작
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  // 이번 주 감정 기록
  const thisWeekEmotions = useMemo(() => {
    return emotions.filter((emotion) =>
      isWithinInterval(new Date(emotion.date), {
        start: thisWeekStart,
        end: thisWeekEnd,
      })
    );
  }, [emotions, thisWeekStart, thisWeekEnd]);

  // 이번 주 루틴 완료
  const thisWeekRoutines = useMemo(() => {
    return completions.filter((completion) =>
      isWithinInterval(new Date(completion.completedAt), {
        start: thisWeekStart,
        end: thisWeekEnd,
      })
    );
  }, [completions, thisWeekStart, thisWeekEnd]);

  // 일별 감정 평균 계산
  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({ start: thisWeekStart, end: thisWeekEnd });

    return days.map((day) => {
      const dayEmotions = thisWeekEmotions.filter(
        (emotion) =>
          format(new Date(emotion.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );

      const avgIntensity =
        dayEmotions.length > 0
          ? dayEmotions.reduce((sum, e) => sum + e.intensity, 0) / dayEmotions.length
          : 0;

      return {
        date: format(day, 'EEE', { locale: ko }),
        fullDate: format(day, 'MM/dd'),
        intensity: parseFloat(avgIntensity.toFixed(1)),
        count: dayEmotions.length,
      };
    });
  }, [thisWeekStart, thisWeekEnd, thisWeekEmotions]);

  // 평균 감정 온도
  const avgIntensity = useMemo(() => {
    if (thisWeekEmotions.length === 0) return 0;
    const total = thisWeekEmotions.reduce((sum, e) => sum + e.intensity, 0);
    return (total / thisWeekEmotions.length).toFixed(1);
  }, [thisWeekEmotions]);

  // 트렌드 계산
  const trend = useMemo(() => {
    if (dailyData.length < 2) return 'stable';
    const firstHalf = dailyData.slice(0, Math.ceil(dailyData.length / 2));
    const secondHalf = dailyData.slice(Math.ceil(dailyData.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, d) => sum + d.intensity, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, d) => sum + d.intensity, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;
    if (diff > 0.5) return 'up';
    if (diff < -0.5) return 'down';
    return 'stable';
  }, [dailyData]);

  // 자주 사용한 이모지
  const topEmojis = useMemo(() => {
    const emojiCount: Record<string, number> = {};
    thisWeekEmotions.forEach((emotion) => {
      if (emotion.emoji) {
        emojiCount[emotion.emoji] = (emojiCount[emotion.emoji] || 0) + 1;
      }
    });

    return Object.entries(emojiCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([emoji, count]) => ({ emoji, count }));
  }, [thisWeekEmotions]);

  const trendIcons = {
    up: <TrendingUp className="w-6 h-6 text-green-600" />,
    down: <TrendingDown className="w-6 h-6 text-orange-600" />,
    stable: <Minus className="w-6 h-6 text-blue-600" />,
  };

  const trendLabels = {
    up: '상승 추세',
    down: '하락 추세',
    stable: '안정적',
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-orange-600',
    stable: 'text-blue-600',
  };

  return (
    <Layout title="주간 리포트" subtitle="이번 주 감정 돌아보기">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 기간 */}
        <Card className="bg-gradient-to-r from-primary-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">기간</p>
              <p className="font-bold text-gray-800">
                {format(thisWeekStart, 'M월 d일', { locale: ko })} -{' '}
                {format(thisWeekEnd, 'M월 d일', { locale: ko })}
              </p>
            </div>
          </div>
        </Card>

        {/* 요약 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <p className="text-sm text-gray-600 mb-1">감정 기록</p>
            <p className="text-3xl font-bold text-gray-800">{thisWeekEmotions.length}</p>
            <p className="text-xs text-gray-500">회</p>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-gray-600 mb-1">루틴 완료</p>
            <p className="text-3xl font-bold text-gray-800">{thisWeekRoutines.length}</p>
            <p className="text-xs text-gray-500">회</p>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-gray-600 mb-1">평균 감정</p>
            <p className="text-3xl font-bold text-gray-800">{avgIntensity}</p>
            <p className="text-xs text-gray-500">/ 10</p>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-gray-600 mb-1">트렌드</p>
            <div className="flex justify-center my-2">{trendIcons[trend]}</div>
            <p className={`text-xs font-medium ${trendColors[trend]}`}>
              {trendLabels[trend]}
            </p>
          </Card>
        </div>

        {/* 감정 온도 차트 */}
        <Card>
          <h3 className="font-bold text-lg text-gray-800 mb-4">일별 감정 온도</h3>

          {thisWeekEmotions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border-2 border-primary-500 rounded-lg p-3 shadow-lg">
                          <p className="font-bold text-gray-800">{data.fullDate}</p>
                          <p className="text-primary-600">강도: {data.intensity}</p>
                          <p className="text-sm text-gray-600">기록: {data.count}회</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>이번 주 감정 기록이 없어요</p>
              <p className="text-sm mt-2">감정을 기록하면 차트가 나타나요</p>
            </div>
          )}
        </Card>

        {/* 자주 사용한 감정 */}
        {topEmojis.length > 0 && (
          <Card>
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              자주 사용한 감정 이모지
            </h3>
            <div className="flex flex-wrap gap-4">
              {topEmojis.map(({ emoji, count }) => (
                <motion.div
                  key={emoji}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-primary-50 rounded-full px-4 py-2"
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="font-bold text-primary-600">{count}회</span>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* 셀리의 코멘트 */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-start gap-3">
            <div className="text-4xl">🌱</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 mb-2">셀리의 한마디</h4>
              <p className="text-gray-700">
                {thisWeekEmotions.length === 0
                  ? '이번 주는 기록이 없네요. 내일부터 함께 시작해볼까요?'
                  : thisWeekEmotions.length < 3
                  ? '좋아요! 조금씩 기록하고 있어요. 매일 기록하면 더 좋은 인사이트를 얻을 수 있어요.'
                  : parseFloat(avgIntensity) > 7
                  ? '이번 주는 긍정적인 감정이 많았어요! 계속 이 에너지를 유지해봐요.'
                  : parseFloat(avgIntensity) < 4
                  ? '이번 주는 조금 힘든 시간이었네요. 루틴과 함께 천천히 회복해나가요.'
                  : '안정적인 한 주를 보냈어요. 계속 감정을 관리하며 성장해나가요.'}
              </p>
            </div>
          </div>
        </Card>

        {/* 버튼 */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => navigate('/home')} fullWidth>
            홈으로
          </Button>
          <Button variant="secondary" onClick={() => navigate('/checkin')} fullWidth>
            주간 체크인
          </Button>
        </div>
      </div>
    </Layout>
  );
};
