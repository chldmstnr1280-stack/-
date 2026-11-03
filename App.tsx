
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import {
  Role,
  Message,
  ViewType,
  Weed,
  Plant,
  JournalEntry,
  GardenState,
  SubscriptionPlan,
  EmotionType
} from './types';
import {
  COUNSELOR_PROMPT,
  GARDEN_ANALYST_PROMPT,
  WEED_PULLER_PROMPT,
  SUBSCRIPTION_PLANS,
  EMOTION_COLORS,
  EMOTION_EMOJIS
} from './constants';

// ============================================
// 아이콘 컴포넌트들
// ============================================

const GardenIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const WeedIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

const JournalIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ChatIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LeafIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
  </svg>
);

// ============================================
// 몰입형 정원 공간 컴포넌트 (산사 스타일)
// ============================================

interface ImmersiveGardenProps {
  garden: GardenState;
  onPullWeed: (weed: Weed) => void;
  onWaterPlant: (plant: Plant) => void;
  onMeditate: () => void;
  onWriteJournal: () => void;
  currentVisitors: number;
}

const ImmersiveGarden: React.FC<ImmersiveGardenProps> = ({
  garden, onPullWeed, onWaterPlant, onMeditate, onWriteJournal, currentVisitors
}) => {
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'dusk' | 'night'>('day');
  const [showRitual, setShowRitual] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  // 시간대별 배경 그라데이션
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) setTimeOfDay('dawn');
    else if (hour >= 7 && hour < 17) setTimeOfDay('day');
    else if (hour >= 17 && hour < 20) setTimeOfDay('dusk');
    else setTimeOfDay('night');
  }, []);

  const gradients = {
    dawn: 'from-rose-900 via-orange-800 to-emerald-900',
    day: 'from-sky-400 via-emerald-600 to-emerald-800',
    dusk: 'from-purple-900 via-orange-700 to-emerald-900',
    night: 'from-slate-900 via-indigo-900 to-emerald-950',
  };

  const timeMessages = {
    dawn: '새벽의 정원에 오신 것을 환영합니다',
    day: '햇살 가득한 정원에서 마음을 돌보세요',
    dusk: '노을빛 정원에서 하루를 정리해보세요',
    night: '고요한 밤, 별빛 아래 명상의 시간입니다',
  };

  // 호흡 명상 애니메이션
  useEffect(() => {
    if (showRitual === 'breathe') {
      const cycle = () => {
        setBreathPhase('inhale');
        setTimeout(() => setBreathPhase('hold'), 4000);
        setTimeout(() => setBreathPhase('exhale'), 6000);
      };
      cycle();
      const interval = setInterval(cycle, 10000);
      return () => clearInterval(interval);
    }
  }, [showRitual]);

  const handleWaterPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowRitual('watering');
    setTimeout(() => {
      onWaterPlant(plant);
      setShowRitual(null);
      setSelectedPlant(null);
    }, 3000);
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${gradients[timeOfDay]} transition-all duration-1000`}>
      {/* 실시간 방문자 수 (산사 스타일) */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm">
        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
        지금 {currentVisitors.toLocaleString()}명이 함께하고 있어요
      </div>

      {/* 시간대 메시지 */}
      <div className="absolute top-4 left-4 text-white/60 text-sm">
        {timeMessages[timeOfDay]}
      </div>

      {/* 떠다니는 반딧불이/꽃잎 (장식) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${timeOfDay === 'night' ? 'bg-yellow-300' : 'bg-pink-200'} opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* 메인 정원 공간 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">

        {/* 정원 중앙 - 의식 공간 */}
        <div className="relative w-full max-w-2xl">

          {/* 호흡 명상 오버레이 */}
          {showRitual === 'breathe' && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`w-48 h-48 rounded-full bg-emerald-500/30 flex items-center justify-center transition-all duration-[4000ms] ${
                    breathPhase === 'inhale' ? 'scale-150' :
                    breathPhase === 'hold' ? 'scale-150' : 'scale-100'
                  }`}
                >
                  <div className={`w-32 h-32 rounded-full bg-emerald-400/50 flex items-center justify-center transition-all duration-[4000ms] ${
                    breathPhase === 'inhale' ? 'scale-125' :
                    breathPhase === 'hold' ? 'scale-125' : 'scale-100'
                  }`}>
                    <div className="text-white text-xl font-light">
                      {breathPhase === 'inhale' && '들이쉬세요...'}
                      {breathPhase === 'hold' && '잠시 멈추고...'}
                      {breathPhase === 'exhale' && '내쉬세요...'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowRitual(null)}
                  className="mt-8 text-white/60 hover:text-white transition"
                >
                  명상 마치기
                </button>
              </div>
            </div>
          )}

          {/* 물주기 애니메이션 */}
          {showRitual === 'watering' && selectedPlant && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">💧</div>
                <div className="text-white text-xl">{selectedPlant.name}에 물을 주고 있어요...</div>
                <div className="text-emerald-300 mt-2">사랑과 관심을 담아서</div>
              </div>
            </div>
          )}

          {/* 정원 통계 - 미니멀하게 */}
          <div className="flex justify-center gap-8 mb-12 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-light">{garden.plants.length}</div>
              <div className="text-xs opacity-60">피어난 생각</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light">{garden.totalWeedsRemoved}</div>
              <div className="text-xs opacity-60">뽑아낸 잡초</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light">{garden.currentStreak}</div>
              <div className="text-xs opacity-60">연속 돌봄</div>
            </div>
          </div>

          {/* 식물들 (원형 배치) */}
          <div className="relative w-72 h-72 mx-auto mb-8">
            {/* 중앙 - 명상 버튼 */}
            <button
              onClick={() => { setShowRitual('breathe'); onMeditate(); }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition group"
            >
              <span className="text-3xl group-hover:scale-110 transition">🧘</span>
            </button>

            {/* 식물들 원형 배치 */}
            {garden.plants.slice(0, 8).map((plant, i) => {
              const angle = (i / Math.min(garden.plants.length, 8)) * 2 * Math.PI - Math.PI / 2;
              const radius = 120;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const stageEmojis = ['🌱', '🌿', '🪴', '🌸', '🌳'];

              return (
                <button
                  key={plant.id}
                  onClick={() => handleWaterPlant(plant)}
                  className="absolute w-16 h-16 -ml-8 -mt-8 rounded-full bg-emerald-800/30 backdrop-blur-sm border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-700/50 transition transform hover:scale-110"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  title={`${plant.name} - 터치하여 물주기`}
                >
                  <span className="text-2xl">{stageEmojis[plant.growthStage - 1]}</span>
                </button>
              );
            })}
          </div>

          {/* 의식 버튼들 */}
          <div className="flex justify-center gap-4 mb-8">
            <RitualButton
              icon="✍️"
              label="마음 일기"
              onClick={onWriteJournal}
              description="오늘의 마음을 기록해보세요"
            />
            <RitualButton
              icon="🌬️"
              label="호흡 명상"
              onClick={() => setShowRitual('breathe')}
              description="3분간 깊은 숨을 쉬어보세요"
            />
            <RitualButton
              icon="💧"
              label="식물 돌보기"
              onClick={() => garden.plants[0] && handleWaterPlant(garden.plants[0])}
              description="식물에 물을 주세요"
              disabled={garden.plants.length === 0}
            />
          </div>

          {/* 발견된 잡초들 */}
          {garden.weeds.filter(w => !w.isRemoved).length > 0 && (
            <div className="mt-8 p-6 bg-black/20 backdrop-blur-sm rounded-2xl">
              <h3 className="text-white/80 text-center mb-4 font-light">
                정원에서 발견된 잡초들
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {garden.weeds.filter(w => !w.isRemoved).map((weed) => (
                  <button
                    key={weed.id}
                    onClick={() => onPullWeed(weed)}
                    className="group bg-red-900/30 hover:bg-red-800/50 border border-red-500/30 rounded-xl px-4 py-3 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🌿</span>
                      <div className="text-left">
                        <div className="text-white text-sm">{weed.name}</div>
                        <div className="text-red-300/60 text-xs">터치하여 뽑기</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 앰비언트 사운드 토글 (UI만) */}
      <button className="fixed bottom-24 right-4 w-12 h-12 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 hover:text-white transition">
        🔊
      </button>

      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.8; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

const RitualButton: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
  description: string;
  disabled?: boolean;
}> = ({ icon, label, onClick, description, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="group flex flex-col items-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-28"
  >
    <span className="text-3xl mb-2 group-hover:scale-110 transition">{icon}</span>
    <span className="text-white text-sm font-medium">{label}</span>
    <span className="text-white/50 text-xs mt-1 text-center">{description}</span>
  </button>
);

// ============================================
// 랜딩 페이지 컴포넌트 (업데이트)
// ============================================

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
  currentVisitors: number;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewPricing, currentVisitors }) => {
  const [breathScale, setBreathScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathScale(prev => prev === 1 ? 1.1 : 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 overflow-hidden">
      {/* 떠다니는 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* 헤더 */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <LeafIcon className="w-8 h-8 text-emerald-400" />
          <span className="text-xl font-bold text-white">마음의 정원</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-emerald-300/60 text-sm hidden md:block">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            {currentVisitors.toLocaleString()}명 접속 중
          </div>
          <button
            onClick={onViewPricing}
            className="text-emerald-300 hover:text-white transition"
          >
            요금제
          </button>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          {/* 호흡하는 원 */}
          <div className="flex justify-center mb-8">
            <div
              className="w-32 h-32 rounded-full bg-emerald-500/20 flex items-center justify-center transition-transform duration-[3000ms]"
              style={{ transform: `scale(${breathScale})` }}
            >
              <div className="w-20 h-20 rounded-full bg-emerald-400/30 flex items-center justify-center">
                <span className="text-4xl">🌱</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight">
            마음도 눈에 보인다면<br/>
            <span className="text-emerald-400 font-normal">정원처럼 가꾸고 싶지 않으세요?</span>
          </h1>

          <p className="text-lg md:text-xl text-emerald-200/80 mb-4 max-w-2xl mx-auto font-light">
            하루 3분, 당신만의 마음 정원에서<br/>
            잡초를 뽑고, 숨을 고르고, 새로운 생각을 심어보세요.
          </p>

          <p className="text-emerald-300/60 text-sm mb-8">
            온라인 명상 공간 · 언제 어디서든 찾아올 수 있는 마음의 쉼터
          </p>

          <button
            onClick={onGetStarted}
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-medium py-4 px-10 rounded-full text-lg transition transform hover:scale-105 shadow-lg shadow-emerald-500/30"
          >
            정원에 들어가기
          </button>

          <p className="text-emerald-300/40 text-sm mt-4">
            무료로 시작하세요
          </p>
        </div>

        {/* 경험 설명 카드들 */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <ExperienceCard
            icon="📝"
            title="마음 일기"
            description="하루의 감정을 기록하면, AI가 마음속 잡초를 찾아드려요"
            time="3분"
          />
          <ExperienceCard
            icon="🧘"
            title="호흡 명상"
            description="고요한 정원에서 깊은 숨을 쉬며 마음을 정리해요"
            time="3분"
          />
          <ExperienceCard
            icon="🌱"
            title="잡초 뽑기"
            description="AI와 대화하며 부정적 생각을 하나씩 뽑아내요"
            time="5분"
          />
        </div>

        {/* 인용구 섹션 */}
        <div className="mt-24 text-center">
          <blockquote className="text-xl md:text-2xl text-white/70 font-light italic max-w-3xl mx-auto">
            "마음도 정원처럼 돌봄이 필요합니다.<br/>
            잡초를 뽑고, 물을 주고, 햇빛을 쬐면<br/>
            당신의 마음 정원은 분명 아름답게 피어날 거예요."
          </blockquote>
        </div>

        {/* 잡초 유형 설명 */}
        <div className="mt-24 bg-black/20 backdrop-blur-sm rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-8 text-center">
            당신의 정원에 자라있을지 모르는 잡초들
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <WeedTypeCard
              name="걱정의 덩굴"
              emoji="🌿"
              description="아직 오지 않은 미래가 마음을 옥죄어요"
              rootDepth="deep"
            />
            <WeedTypeCard
              name="비교의 가시"
              emoji="🌵"
              description="남과 비교하며 스스로를 깎아내려요"
              rootDepth="medium"
            />
            <WeedTypeCard
              name="완벽주의 그늘"
              emoji="🍂"
              description="조금의 실수도 용납하기 어려워요"
              rootDepth="deep"
            />
            <WeedTypeCard
              name="자기비난의 독초"
              emoji="🥀"
              description="실수할 때마다 자신을 공격해요"
              rootDepth="shallow"
            />
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25% { transform: translateY(-30px) translateX(10px); opacity: 0.2; }
          50% { transform: translateY(-15px) translateX(-15px); opacity: 0.6; }
          75% { transform: translateY(-40px) translateX(8px); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

const ExperienceCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  time: string;
}> = ({ icon, title, description, time }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
    <p className="text-emerald-200/60 text-sm mb-3">{description}</p>
    <div className="text-emerald-400 text-xs">소요시간 {time}</div>
  </div>
);

const WeedTypeCard: React.FC<{
  name: string;
  emoji: string;
  description: string;
  rootDepth: 'shallow' | 'medium' | 'deep';
}> = ({ name, emoji, description, rootDepth }) => {
  const depthColors = {
    shallow: 'border-yellow-500/30 bg-yellow-500/5',
    medium: 'border-orange-500/30 bg-orange-500/5',
    deep: 'border-red-500/30 bg-red-500/5',
  };
  const depthLabels = { shallow: '얕은 뿌리', medium: '중간 뿌리', deep: '깊은 뿌리' };

  return (
    <div className={`border ${depthColors[rootDepth]} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h4 className="font-medium text-white mb-1">{name}</h4>
          <p className="text-xs text-white/50 mb-2">{description}</p>
          <span className="text-xs text-white/30">{depthLabels[rootDepth]}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 일기 작성 컴포넌트 (명상적 분위기)
// ============================================

interface JournalViewProps {
  journals: JournalEntry[];
  onSaveJournal: (content: string) => void;
  isAnalyzing: boolean;
  onBack: () => void;
}

const JournalView: React.FC<JournalViewProps> = ({ journals, onSaveJournal, isAnalyzing, onBack }) => {
  const [content, setContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const prompts = [
    "오늘 마음에 남는 순간이 있었나요?",
    "요즘 자주 떠오르는 생각이 있나요?",
    "오늘 하루 중 감사한 점은 무엇인가요?",
    "지금 이 순간 무엇이 걱정되나요?",
  ];
  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isAnalyzing) {
      onSaveJournal(content.trim());
      setContent('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-emerald-950 p-6">
      {/* 떠다니는 별들 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.4,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="text-white/60 hover:text-white transition">
            ← 정원으로
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-emerald-400 hover:text-emerald-300 transition"
          >
            {showHistory ? '새 일기 쓰기' : '이전 일기 보기'}
          </button>
        </div>

        {showHistory ? (
          <JournalHistory journals={journals} />
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 프롬프트 */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-2xl font-light text-white mb-2">마음 일기</h2>
              <p className="text-emerald-300/60">{currentPrompt}</p>
            </div>

            {/* 텍스트 영역 */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="마음 가는 대로 적어보세요..."
                className="w-full h-64 bg-transparent text-white placeholder-white/30 resize-none focus:outline-none text-lg leading-relaxed"
                disabled={isAnalyzing}
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isAnalyzing || !content.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl transition"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingDots />
                  정원사가 읽고 있어요...
                </span>
              ) : (
                '일기 저장하기'
              )}
            </button>

            <p className="text-center text-white/30 text-sm mt-4">
              AI가 일기 속 마음의 잡초를 찾아드릴 거예요
            </p>
          </form>
        )}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

const JournalHistory: React.FC<{ journals: JournalEntry[] }> = ({ journals }) => {
  if (journals.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📖</div>
        <p className="text-white/60">아직 작성한 일기가 없어요</p>
        <p className="text-white/40 text-sm mt-2">첫 번째 마음 일기를 써보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {journals.map((journal) => (
        <div key={journal.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-white/40 text-sm">
              {new Date(journal.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <div className="flex gap-1">
              {journal.emotions.map((emotion) => (
                <span key={emotion} className="text-lg" title={emotion}>
                  {EMOTION_EMOJIS[emotion]}
                </span>
              ))}
            </div>
          </div>
          <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{journal.content}</p>
          {journal.aiAnalysis && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-emerald-300/80 text-sm">{journal.aiAnalysis}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const LoadingDots: React.FC = () => (
  <span className="flex gap-1">
    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
    <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
  </span>
);

// ============================================
// 잡초 뽑기 세션 (명상적 분위기)
// ============================================

interface WeedPullingViewProps {
  weed: Weed | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

const WeedPullingView: React.FC<WeedPullingViewProps> = ({
  weed, messages, onSendMessage, onClose, isLoading
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  if (!weed) return null;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-red-950 via-slate-900 to-emerald-950">
      {/* 헤더 */}
      <div className="bg-black/30 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h3 className="text-white font-medium">{weed.name}</h3>
              <p className="text-white/50 text-sm">함께 뽑아볼까요?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition p-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === Role.USER
                  ? 'bg-emerald-600/80 text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white/90'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="천천히 생각하며 답해보세요..."
            className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white px-6 py-3 rounded-full transition"
          >
            보내기
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================
// 일반 채팅 컴포넌트
// ============================================

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, isLoading, onBack }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900">
      {/* 헤더 */}
      <div className="bg-black/30 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <button onClick={onBack} className="text-white/60 hover:text-white transition">
            ←
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <LeafIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">마음 정원사</h3>
              <p className="text-emerald-400/60 text-xs">언제든 이야기 나눠요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
              {msg.role === Role.MODEL && (
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <LeafIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                msg.role === Role.USER
                  ? 'bg-emerald-600/80 text-white'
                  : 'bg-white/10 backdrop-blur-sm text-white/90'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <LeafIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="p-4 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="무엇이든 이야기해보세요..."
            className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white px-6 py-3 rounded-full transition"
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================
// 가격 페이지 컴포넌트
// ============================================

interface PricingViewProps {
  currentPlan: SubscriptionPlan;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onBack: () => void;
}

const PricingView: React.FC<PricingViewProps> = ({ currentPlan, onSelectPlan, onBack }) => (
  <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 p-6">
    <div className="max-w-5xl mx-auto">
      {/* 헤더 */}
      <div className="mb-12">
        <button onClick={onBack} className="text-white/60 hover:text-white transition mb-6">
          ← 정원으로
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-light text-white mb-4">마음 정원 가꾸기 플랜</h2>
          <p className="text-emerald-300/60">당신의 마음에 맞는 돌봄을 선택하세요</p>
        </div>
      </div>

      {/* 플랜 카드들 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 ${
              plan.id === 'bloom'
                ? 'bg-gradient-to-b from-emerald-800/50 to-emerald-900/50 border-2 border-emerald-500/50'
                : 'bg-white/5 border border-white/10'
            } ${currentPlan === plan.id ? 'ring-2 ring-emerald-400' : ''}`}
          >
            {plan.id === 'bloom' && (
              <div className="text-center mb-4">
                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  추천
                </span>
              </div>
            )}

            <h3 className="text-xl font-medium text-white mb-1">{plan.nameKo}</h3>
            <p className="text-sm text-white/40 mb-4">{plan.name}</p>

            <div className="mb-6">
              <span className="text-3xl font-light text-white">{plan.priceDisplay}</span>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-white/70">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan(plan.id)}
              className={`w-full py-3 rounded-xl font-medium transition ${
                currentPlan === plan.id
                  ? 'bg-white/10 text-white/50 cursor-default'
                  : plan.id === 'bloom'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              disabled={currentPlan === plan.id}
            >
              {currentPlan === plan.id ? '현재 플랜' : '선택하기'}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================
// 하단 네비게이션
// ============================================

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems: { view: ViewType; icon: string; label: string }[] = [
    { view: 'garden', icon: '🌳', label: '정원' },
    { view: 'journal', icon: '📝', label: '일기' },
    { view: 'chat', icon: '💬', label: '상담' },
    { view: 'pricing', icon: '✨', label: '플랜' },
  ];

  return (
    <nav className="bg-black/40 backdrop-blur-md border-t border-white/10">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map(({ view, icon, label }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className={`flex flex-col items-center py-3 px-4 transition ${
              currentView === view
                ? 'text-emerald-400'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span className="text-xl mb-1">{icon}</span>
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

// ============================================
// 메인 앱 컴포넌트
// ============================================

const App: React.FC = () => {
  // 상태 관리
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [subscription, setSubscription] = useState<SubscriptionPlan>('free');
  const [garden, setGarden] = useState<GardenState>({
    plants: [],
    weeds: [],
    gardenHealth: 50,
    totalWeedsRemoved: 0,
    currentStreak: 0,
  });
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: Role.MODEL, text: "안녕하세요 🌱\n\n저는 마음의 정원사예요.\n오늘 하루는 어떠셨나요?\n\n언제든 마음 가는 대로 이야기해주세요." }
  ]);
  const [weedPullingMessages, setWeedPullingMessages] = useState<Message[]>([]);
  const [selectedWeed, setSelectedWeed] = useState<Weed | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentVisitors, setCurrentVisitors] = useState(Math.floor(1000 + Math.random() * 4000));

  // 실시간 방문자 수 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVisitors(prev => {
        const change = Math.floor(Math.random() * 100) - 50;
        return Math.max(500, Math.min(8000, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // AI 채팅 세션 refs
  const chatSessionRef = useRef<Chat | null>(null);
  const weedSessionRef = useRef<Chat | null>(null);

  // AI 초기화
  const initializeChat = useCallback(async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: COUNSELOR_PROMPT },
      });
      chatSessionRef.current = chat;
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    }
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // 일반 채팅 메시지 전송
  const handleChatMessage = async (text: string) => {
    if (!chatSessionRef.current) return;

    const userMessage: Message = { role: Role.USER, text };
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: text });
      setChatMessages(prev => [...prev, { role: Role.MODEL, text: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, {
        role: Role.MODEL,
        text: "잠시 생각을 정리하고 있어요... 다시 말씀해주시겠어요? 🙏"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 일기 저장 및 분석
  const handleSaveJournal = async (content: string) => {
    setIsAnalyzing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: content,
        config: { systemInstruction: GARDEN_ANALYST_PROMPT },
      });

      let analysis = { weeds: [], moodScore: 5, encouragement: "" };
      try {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        }
      } catch {
        analysis.encouragement = response.text;
      }

      const newJournal: JournalEntry = {
        id: Date.now().toString(),
        content,
        createdAt: new Date(),
        emotions: analysis.weeds?.map((w: any) => w.emotion).filter(Boolean) || ['peace'],
        identifiedWeeds: [],
        aiAnalysis: analysis.encouragement,
        moodScore: analysis.moodScore || 5,
      };

      const newWeeds: Weed[] = (analysis.weeds || []).map((w: any, i: number) => ({
        id: `${Date.now()}-${i}`,
        name: w.name || '이름 없는 잡초',
        description: w.description || '',
        rootDepth: w.rootDepth || 'shallow',
        emotion: w.emotion || 'confusion',
        createdAt: new Date(),
        isRemoved: false,
        journalIds: [newJournal.id],
      }));

      newJournal.identifiedWeeds = newWeeds.map(w => w.id);

      setJournals(prev => [newJournal, ...prev]);
      setGarden(prev => ({
        ...prev,
        weeds: [...prev.weeds, ...newWeeds],
        currentStreak: prev.currentStreak + 1,
        gardenHealth: Math.max(0, prev.gardenHealth - newWeeds.length * 5),
      }));

      // 일기 저장 후 정원으로 이동
      setTimeout(() => setCurrentView('garden'), 1500);

    } catch (error) {
      console.error("Journal analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 잡초 뽑기 시작
  const handleStartWeedPulling = async (weed: Weed) => {
    setSelectedWeed(weed);
    setCurrentView('weeds');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const systemPrompt = WEED_PULLER_PROMPT.replace('{weedInfo}',
      `이름: ${weed.name}\n설명: ${weed.description}\n뿌리 깊이: ${weed.rootDepth}`
    );

    weedSessionRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: systemPrompt },
    });

    setWeedPullingMessages([{
      role: Role.MODEL,
      text: `"${weed.name}"을(를) 함께 살펴볼까요? 🌿\n\n이 잡초가 언제 처음 마음에 자라기 시작했는지 기억나세요?`
    }]);
  };

  // 잡초 뽑기 대화
  const handleWeedMessage = async (text: string) => {
    if (!weedSessionRef.current) return;

    const userMessage: Message = { role: Role.USER, text };
    setWeedPullingMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await weedSessionRef.current.sendMessage({ message: text });
      const responseText = response.text;

      setWeedPullingMessages(prev => [...prev, { role: Role.MODEL, text: responseText }]);

      if (responseText.includes('[완료]') && selectedWeed) {
        setGarden(prev => ({
          ...prev,
          weeds: prev.weeds.map(w =>
            w.id === selectedWeed.id ? { ...w, isRemoved: true, removedAt: new Date() } : w
          ),
          totalWeedsRemoved: prev.totalWeedsRemoved + 1,
          gardenHealth: Math.min(100, prev.gardenHealth + 10),
          plants: [...prev.plants, {
            id: Date.now().toString(),
            name: '새로운 관점의 새싹',
            type: 'flower',
            growthStage: 1,
            plantedAt: new Date(),
            lastWatered: new Date(),
            associatedWeeds: [selectedWeed.id],
          }],
        }));
      }
    } catch (error) {
      console.error("Weed pulling error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 잡초 뽑기 종료
  const handleCloseWeedPulling = () => {
    setSelectedWeed(null);
    setWeedPullingMessages([]);
    setCurrentView('garden');
  };

  // 물주기
  const handleWaterPlant = (plant: Plant) => {
    setGarden(prev => ({
      ...prev,
      plants: prev.plants.map(p =>
        p.id === plant.id
          ? { ...p, lastWatered: new Date(), growthStage: Math.min(5, p.growthStage + 1) }
          : p
      ),
      gardenHealth: Math.min(100, prev.gardenHealth + 2),
    }));
  };

  // 명상
  const handleMeditate = () => {
    setGarden(prev => ({
      ...prev,
      gardenHealth: Math.min(100, prev.gardenHealth + 5),
    }));
  };

  // 뷰 렌더링
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => setCurrentView('garden')}
            onViewPricing={() => setCurrentView('pricing')}
            currentVisitors={currentVisitors}
          />
        );
      case 'garden':
        return (
          <ImmersiveGarden
            garden={garden}
            onPullWeed={handleStartWeedPulling}
            onWaterPlant={handleWaterPlant}
            onMeditate={handleMeditate}
            onWriteJournal={() => setCurrentView('journal')}
            currentVisitors={currentVisitors}
          />
        );
      case 'journal':
        return (
          <JournalView
            journals={journals}
            onSaveJournal={handleSaveJournal}
            isAnalyzing={isAnalyzing}
            onBack={() => setCurrentView('garden')}
          />
        );
      case 'weeds':
        return (
          <WeedPullingView
            weed={selectedWeed}
            messages={weedPullingMessages}
            onSendMessage={handleWeedMessage}
            onClose={handleCloseWeedPulling}
            isLoading={isLoading}
          />
        );
      case 'chat':
        return (
          <ChatView
            messages={chatMessages}
            onSendMessage={handleChatMessage}
            isLoading={isLoading}
            onBack={() => setCurrentView('garden')}
          />
        );
      case 'pricing':
        return (
          <PricingView
            currentPlan={subscription}
            onSelectPlan={setSubscription}
            onBack={() => setCurrentView('garden')}
          />
        );
      default:
        return null;
    }
  };

  // 랜딩 페이지는 전체 화면
  if (currentView === 'landing') {
    return renderView();
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>

      {/* 잡초 뽑기 중에는 네비게이션 숨김 */}
      {currentView !== 'weeds' && (
        <Navigation
          currentView={currentView}
          onNavigate={setCurrentView}
        />
      )}
    </div>
  );
};

export default App;
