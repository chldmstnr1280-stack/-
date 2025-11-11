import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { ProgressBar } from '../common';
import { Selly, SellyStage } from '../../types';

interface SellyStatsProps {
  selly: Selly;
}

export const SellyStats: React.FC<SellyStatsProps> = ({ selly }) => {
  // 다음 진화까지 필요한 경험치
  const getNextLevelExp = (stage: SellyStage): number => {
    const thresholds = {
      [SellyStage.SEED]: 25,
      [SellyStage.SPROUT]: 50,
      [SellyStage.FLOWER]: 100,
      [SellyStage.CHARACTER]: 0, // 최종 단계
    };
    return thresholds[stage];
  };

  const nextLevelExp = getNextLevelExp(selly.stage);
  const progress = nextLevelExp > 0 ? (selly.experience / nextLevelExp) * 100 : 100;

  return (
    <div className="space-y-4">
      {/* 레벨 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-700">레벨</span>
        </div>
        <span className="text-2xl font-bold text-primary-600">
          {selly.level}
        </span>
      </div>

      {/* 경험치 바 */}
      {selly.stage !== SellyStage.CHARACTER && (
        <div>
          <ProgressBar
            progress={progress}
            label="다음 진화까지"
            showPercentage
            color={selly.style.color === 'green' ? 'primary' : selly.style.color}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {selly.experience} / {nextLevelExp} XP
          </p>
        </div>
      )}

      {/* 최종 진화 완료 메시지 */}
      {selly.stage === SellyStage.CHARACTER && (
        <div className="flex items-center gap-2 text-sm text-primary-600 bg-primary-50 rounded-lg p-3">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">최종 진화 완료!</span>
        </div>
      )}
    </div>
  );
};
