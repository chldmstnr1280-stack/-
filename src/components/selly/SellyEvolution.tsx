import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SellyStage } from '../../types';

interface SellyEvolutionProps {
  fromStage: SellyStage;
  toStage: SellyStage;
  onComplete?: () => void;
}

export const SellyEvolution: React.FC<SellyEvolutionProps> = ({
  fromStage,
  toStage,
  onComplete,
}) => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // 3초 후 애니메이션 종료
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const stageEmojis = {
    [SellyStage.SEED]: '🌱',
    [SellyStage.SPROUT]: '🌿',
    [SellyStage.FLOWER]: '🌸',
    [SellyStage.CHARACTER]: '🧚‍♀️',
  };

  const stageNames = {
    [SellyStage.SEED]: '씨앗',
    [SellyStage.SPROUT]: '새싹',
    [SellyStage.FLOWER]: '꽃',
    [SellyStage.CHARACTER]: '꼬마 셀리',
  };

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-12 shadow-2xl max-w-md text-center"
          >
            {/* 별 효과 */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="mb-6"
            >
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto" />
            </motion.div>

            {/* 진화 애니메이션 */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-6xl"
              >
                {stageEmojis[fromStage]}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-4xl"
              >
                →
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-6xl"
              >
                {stageEmojis[toStage]}
              </motion.div>
            </div>

            {/* 메시지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
            >
              <h2 className="text-2xl font-bold text-primary-700 mb-2">
                축하합니다!
              </h2>
              <p className="text-gray-600">
                셀리가 <span className="font-bold text-primary-600">{stageNames[toStage]}</span>로 진화했어요
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
