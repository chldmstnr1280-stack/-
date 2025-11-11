import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Card } from '../../components/common';
import { useSellyStore } from '../../store/sellyStore';
import { SellyStyle } from '../../types';

export const StyleSelect: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<'green' | 'pink' | 'gold'>('green');
  const navigate = useNavigate();
  const { updateStyle } = useSellyStore();

  const colorOptions = [
    {
      color: 'green' as const,
      name: '초록 셀리',
      description: '평온하고 차분한 에너지',
      gradient: 'from-green-400 to-emerald-500',
      emoji: '🌱',
    },
    {
      color: 'pink' as const,
      name: '분홍 셀리',
      description: '따뜻하고 사랑스러운 에너지',
      gradient: 'from-pink-400 to-pink-600',
      emoji: '🌸',
    },
    {
      color: 'gold' as const,
      name: '황금 셀리',
      description: '밝고 긍정적인 에너지',
      gradient: 'from-yellow-400 to-amber-500',
      emoji: '⭐',
    },
  ];

  const handleNext = () => {
    updateStyle({ color: selectedColor });
    navigate('/onboarding/complete');
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          {/* 진행 표시 */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <div className="h-1 flex-1 bg-primary-500 rounded-full" />
              <div className="h-1 flex-1 bg-primary-500 rounded-full" />
              <div className="h-1 flex-1 bg-gray-200 rounded-full" />
            </div>
            <p className="text-sm text-gray-600">2/3단계</p>
          </div>

          {/* 질문 */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              셀리 스타일을 선택하세요 ✨
            </h2>
            <p className="text-gray-600">
              나중에 정원 마켓에서 변경할 수 있어요
            </p>
          </div>

          {/* 색상 옵션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {colorOptions.map((option) => (
              <motion.div
                key={option.color}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  hoverable
                  onClick={() => setSelectedColor(option.color)}
                  className={`
                    cursor-pointer transition-all
                    ${selectedColor === option.color ? 'ring-4 ring-primary-500 shadow-xl' : ''}
                  `}
                >
                  <div className="text-center">
                    <div
                      className={`
                        w-24 h-24 mx-auto mb-4 rounded-full
                        bg-gradient-to-br ${option.gradient}
                        flex items-center justify-center text-5xl
                      `}
                    >
                      {option.emoji}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 버튼 */}
          <Button onClick={handleNext} fullWidth size="lg">
            다음
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};
