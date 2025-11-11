import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Award } from 'lucide-react';
import { Card } from '../common';
import { Routine } from '../../types';

interface RoutineCardProps {
  routine: Routine;
  onStart: (routine: Routine) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onStart }) => {
  const typeColors = {
    meditation: 'from-purple-400 to-purple-600',
    breathing: 'from-blue-400 to-blue-600',
    activity: 'from-green-400 to-green-600',
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card hoverable onClick={() => onStart(routine)} className="cursor-pointer">
        <div className="flex items-start gap-4">
          {/* 아이콘 */}
          <div
            className={`
              w-16 h-16 rounded-xl
              bg-gradient-to-br ${typeColors[routine.type]}
              flex items-center justify-center text-3xl
              flex-shrink-0
            `}
          >
            {routine.icon}
          </div>

          {/* 내용 */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 mb-1">
              {routine.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {routine.description}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-700">
                <Clock className="w-4 h-4" />
                <span>{routine.duration}분</span>
              </div>
              <div className="flex items-center gap-1 text-primary-600">
                <Award className="w-4 h-4" />
                <span>+{routine.points} 포인트</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
