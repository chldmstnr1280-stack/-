import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Layout, Button, Card } from '../../components/common';
import { useEmotionStore } from '../../store/emotionStore';
import { useSellyStore } from '../../store/sellyStore';
import { useGamificationStore } from '../../store/gamificationStore';
import { useUserStore } from '../../store/userStore';

// 감정 이모지 옵션
const emotionEmojis = [
  { emoji: '😊', label: '행복' },
  { emoji: '😔', label: '슬픔' },
  { emoji: '😰', label: '불안' },
  { emoji: '😡', label: '화남' },
  { emoji: '😌', label: '평온' },
  { emoji: '😴', label: '피곤' },
  { emoji: '🤗', label: '사랑' },
  { emoji: '😳', label: '놀람' },
];

// 색상 옵션
const colorOptions = [
  { color: '#ef4444', label: '빨강' },
  { color: '#f59e0b', label: '주황' },
  { color: '#eab308', label: '노랑' },
  { color: '#22c55e', label: '초록' },
  { color: '#3b82f6', label: '파랑' },
  { color: '#a855f7', label: '보라' },
  { color: '#ec4899', label: '분홍' },
  { color: '#6b7280', label: '회색' },
];

export const EmotionLogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { addEmotion } = useEmotionStore();
  const { addExperience } = useSellyStore();
  const { addPoints } = useGamificationStore();

  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [intensity, setIntensity] = useState(5);

  const handleSave = () => {
    if (!user) return;

    // 감정 기록 저장
    addEmotion({
      id: `emotion-${Date.now()}`,
      userId: user.id,
      date: new Date(),
      text: text.trim() || undefined,
      emoji: selectedEmoji || undefined,
      color: selectedColor || undefined,
      intensity,
      createdAt: new Date(),
    });

    // 셀리 경험치 추가
    addExperience(10);

    // 포인트 추가
    addPoints(10);

    // 홈으로 이동
    navigate('/home');
  };

  const canSave = text.trim() || selectedEmoji || selectedColor;

  return (
    <Layout showHeader={false}>
      {/* 상단 헤더 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm p-4 mb-6 -mt-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">감정 기록</h1>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="p-2 hover:bg-primary-50 rounded-full transition-colors disabled:opacity-50"
          >
            <Save className="w-6 h-6 text-primary-600" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* 텍스트 입력 */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">오늘 무슨 일이 있었나요?</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="자유롭게 적어보세요..."
            className="
              w-full h-32 p-4
              border-2 border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              resize-none
            "
          />
        </Card>

        {/* 이모지 선택 */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">어떤 감정인가요?</h3>
          <div className="grid grid-cols-4 gap-3">
            {emotionEmojis.map((item) => (
              <motion.button
                key={item.emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedEmoji(item.emoji)}
                className={`
                  p-4 rounded-xl text-4xl
                  transition-all
                  ${
                    selectedEmoji === item.emoji
                      ? 'bg-primary-100 ring-2 ring-primary-500 shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
              >
                {item.emoji}
              </motion.button>
            ))}
          </div>
        </Card>

        {/* 색상 선택 */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">감정을 색으로 표현한다면?</h3>
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map((item) => (
              <motion.button
                key={item.color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedColor(item.color)}
                className={`
                  w-full aspect-square rounded-xl
                  transition-all
                  ${
                    selectedColor === item.color
                      ? 'ring-4 ring-offset-2 ring-primary-500 shadow-xl'
                      : 'hover:ring-2 hover:ring-gray-300'
                  }
                `}
                style={{ backgroundColor: item.color }}
              />
            ))}
          </div>
        </Card>

        {/* 강도 선택 */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">감정의 강도는 어느 정도인가요?</h3>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>약함</span>
              <span className="font-bold text-primary-600 text-xl">{intensity}</span>
              <span>강함</span>
            </div>
          </div>
        </Card>

        {/* 저장 버튼 */}
        <Button
          onClick={handleSave}
          disabled={!canSave}
          fullWidth
          size="lg"
          className="mb-8"
        >
          저장하기 (+10 XP, +10 포인트)
        </Button>
      </div>
    </Layout>
  );
};
