
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
// 랜딩 페이지 컴포넌트
// ============================================

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPricing: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewPricing }) => (
  <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900">
    {/* 헤더 */}
    <header className="p-6 flex justify-between items-center max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <LeafIcon className="w-8 h-8 text-emerald-400" />
        <span className="text-xl font-bold text-white">마음의 정원</span>
      </div>
      <button
        onClick={onViewPricing}
        className="text-emerald-300 hover:text-white transition"
      >
        요금제
      </button>
    </header>

    {/* 히어로 섹션 */}
    <main className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          마음도 눈에 보인다면<br/>
          <span className="text-emerald-400">정원 가꾸듯 돌보고 싶지 않으세요?</span>
        </h1>
        <p className="text-xl text-emerald-200 mb-8 max-w-2xl mx-auto">
          AI가 당신의 마음속 잡초를 찾아드립니다.<br/>
          뿌리 깊은 부정적 생각도 함께 뽑아내고,<br/>
          아름다운 마음 정원을 가꿔보세요.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-full text-lg transition transform hover:scale-105 shadow-lg"
        >
          무료로 시작하기
        </button>
      </div>

      {/* 기능 카드들 */}
      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <FeatureCard
          icon={<JournalIcon className="w-10 h-10" />}
          title="마음 일기"
          description="오늘의 감정을 기록하면 AI가 숨겨진 잡초를 찾아드려요"
        />
        <FeatureCard
          icon={<WeedIcon className="w-10 h-10" />}
          title="잡초 뽑기"
          description="뿌리 깊은 부정적 생각을 AI와 대화하며 뽑아내세요"
        />
        <FeatureCard
          icon={<GardenIcon className="w-10 h-10" />}
          title="정원 성장"
          description="잡초를 뽑은 자리에 새로운 생각의 씨앗을 심어요"
        />
      </div>

      {/* 비유 설명 */}
      <div className="mt-24 bg-slate-800/50 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">마음 정원의 잡초들</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <WeedTypeCard
            name="걱정의 덩굴"
            emoji="🌿"
            description="미래에 대한 불안이 마음을 옥죄어요"
            color="orange"
          />
          <WeedTypeCard
            name="비교의 가시나무"
            emoji="🌵"
            description="남과 비교하며 스스로를 깎아내려요"
            color="red"
          />
          <WeedTypeCard
            name="완벽주의 덩굴"
            emoji="🍂"
            description="100%가 아니면 실패라고 생각해요"
            color="purple"
          />
          <WeedTypeCard
            name="자기비난의 독초"
            emoji="🥀"
            description="실수할 때마다 자신을 공격해요"
            color="blue"
          />
        </div>
      </div>
    </main>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> =
  ({ icon, title, description }) => (
  <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 text-center hover:bg-slate-800/70 transition">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full text-emerald-400 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

const WeedTypeCard: React.FC<{ name: string; emoji: string; description: string; color: string }> =
  ({ name, emoji, description, color }) => {
  const colorClasses: Record<string, string> = {
    orange: 'border-orange-500/50 bg-orange-500/10',
    red: 'border-red-500/50 bg-red-500/10',
    purple: 'border-purple-500/50 bg-purple-500/10',
    blue: 'border-blue-500/50 bg-blue-500/10',
  };

  return (
    <div className={`border-2 ${colorClasses[color]} rounded-xl p-4`}>
      <div className="text-3xl mb-2">{emoji}</div>
      <h4 className="font-bold text-white mb-1">{name}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
};

// ============================================
// 정원 시각화 컴포넌트
// ============================================

interface GardenViewProps {
  garden: GardenState;
  onPullWeed: (weed: Weed) => void;
}

const GardenView: React.FC<GardenViewProps> = ({ garden, onPullWeed }) => {
  const healthColor = garden.gardenHealth > 70 ? 'text-emerald-400' :
                      garden.gardenHealth > 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="p-6">
      {/* 정원 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="정원 건강도" value={`${garden.gardenHealth}%`} color={healthColor} />
        <StatCard label="뽑은 잡초" value={garden.totalWeedsRemoved.toString()} color="text-emerald-400" />
        <StatCard label="심은 식물" value={garden.plants.length.toString()} color="text-pink-400" />
        <StatCard label="연속 기록" value={`${garden.currentStreak}일`} color="text-yellow-400" />
      </div>

      {/* 정원 시각화 */}
      <div className="bg-gradient-to-b from-emerald-900/50 to-slate-800 rounded-3xl p-8 min-h-96 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-600 to-transparent" />
        </div>

        {/* 식물들 */}
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-emerald-300 mb-4">내 정원의 식물들</h3>
          {garden.plants.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              아직 심은 식물이 없어요. 잡초를 뽑고 새로운 생각을 심어보세요!
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {garden.plants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          )}
        </div>

        {/* 잡초들 */}
        {garden.weeds.filter(w => !w.isRemoved).length > 0 && (
          <div className="relative z-10 mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-orange-300 mb-4">발견된 잡초들</h3>
            <div className="flex flex-wrap gap-4">
              {garden.weeds.filter(w => !w.isRemoved).map((weed) => (
                <WeedCard key={weed.id} weed={weed} onPull={() => onPullWeed(weed)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; color: string }> =
  ({ label, value, color }) => (
  <div className="bg-slate-800 rounded-xl p-4 text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </div>
);

const PlantCard: React.FC<{ plant: Plant }> = ({ plant }) => {
  const stageEmojis = ['🌱', '🌿', '🪴', '🌸', '🌳'];
  return (
    <div className="bg-emerald-800/30 border border-emerald-600/30 rounded-xl p-4 min-w-32">
      <div className="text-3xl mb-2">{stageEmojis[plant.growthStage - 1]}</div>
      <div className="font-medium text-white text-sm">{plant.name}</div>
      <div className="text-xs text-emerald-400">성장 {plant.growthStage}/5</div>
    </div>
  );
};

const WeedCard: React.FC<{ weed: Weed; onPull: () => void }> = ({ weed, onPull }) => {
  const depthColors = {
    shallow: 'border-yellow-500/50 bg-yellow-500/10',
    medium: 'border-orange-500/50 bg-orange-500/10',
    deep: 'border-red-500/50 bg-red-500/10',
  };
  const depthLabels = { shallow: '얕은', medium: '중간', deep: '깊은' };

  return (
    <div className={`border-2 ${depthColors[weed.rootDepth]} rounded-xl p-4 min-w-40`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl">🌿</span>
        <span className={`text-xs px-2 py-1 rounded-full ${depthColors[weed.rootDepth]}`}>
          {depthLabels[weed.rootDepth]} 뿌리
        </span>
      </div>
      <div className="font-medium text-white text-sm mb-1">{weed.name}</div>
      <div className="text-xs text-slate-400 mb-3">{weed.description}</div>
      <button
        onClick={onPull}
        className="w-full bg-red-600 hover:bg-red-500 text-white text-sm py-2 rounded-lg transition"
      >
        잡초 뽑기
      </button>
    </div>
  );
};

// ============================================
// 일기 작성 컴포넌트
// ============================================

interface JournalViewProps {
  journals: JournalEntry[];
  onSaveJournal: (content: string) => void;
  isAnalyzing: boolean;
}

const JournalView: React.FC<JournalViewProps> = ({ journals, onSaveJournal, isAnalyzing }) => {
  const [content, setContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isAnalyzing) {
      onSaveJournal(content.trim());
      setContent('');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">오늘의 마음 일기</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-emerald-400 hover:text-emerald-300 transition"
        >
          {showHistory ? '작성하기' : '이전 일기'}
        </button>
      </div>

      {showHistory ? (
        <JournalHistory journals={journals} />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-slate-800 rounded-2xl p-6 mb-4">
            <p className="text-emerald-400 mb-4">
              오늘 하루는 어땠나요? 마음속 생각과 감정을 자유롭게 적어보세요.
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 느낀 감정, 있었던 일, 떠오르는 생각들을 적어보세요..."
              className="w-full h-64 bg-slate-700 text-white rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={isAnalyzing}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isAnalyzing || !content.trim()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingDots />
                  AI가 분석중...
                </span>
              ) : (
                '일기 저장하고 분석받기'
              )}
            </button>
          </div>

          <div className="mt-6 bg-slate-800/50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-emerald-400 mb-2">작성 팁</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• 감정을 있는 그대로 표현해보세요</li>
              <li>• 반복되는 생각이 있다면 적어보세요</li>
              <li>• 좋았던 일도, 힘들었던 일도 모두 괜찮아요</li>
            </ul>
          </div>
        </form>
      )}
    </div>
  );
};

const JournalHistory: React.FC<{ journals: JournalEntry[] }> = ({ journals }) => {
  if (journals.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        아직 작성한 일기가 없어요. 첫 번째 일기를 써보세요!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {journals.map((journal) => (
        <div key={journal.id} className="bg-slate-800 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-slate-400">
              {new Date(journal.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <div className="flex gap-1">
              {journal.emotions.map((emotion) => (
                <span key={emotion} title={emotion}>
                  {EMOTION_EMOJIS[emotion]}
                </span>
              ))}
            </div>
          </div>
          <p className="text-white whitespace-pre-wrap">{journal.content}</p>
          {journal.aiAnalysis && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-sm text-emerald-400">{journal.aiAnalysis}</p>
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
// 잡초 뽑기 세션 컴포넌트
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
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-4 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">잡초 뽑기: {weed.name}</h3>
            <p className="text-sm text-slate-400">{weed.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role === Role.USER
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-white'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-4 py-3 rounded-2xl">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="생각을 나눠보세요..."
            className="flex-1 bg-slate-700 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white px-6 py-3 rounded-full transition"
          >
            전송
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
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, isLoading }) => {
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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
            {msg.role === Role.MODEL && (
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <LeafIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
            <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
              msg.role === Role.USER
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-white'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <LeafIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="bg-slate-700 px-4 py-3 rounded-2xl">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="마음 정원사에게 이야기해보세요..."
            className="flex-1 bg-slate-700 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white px-6 py-3 rounded-full transition"
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
}

const PricingView: React.FC<PricingViewProps> = ({ currentPlan, onSelectPlan }) => (
  <div className="p-6 max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-white mb-4">마음 정원 가꾸기 플랜</h2>
      <p className="text-slate-400">당신의 마음에 맞는 플랜을 선택하세요</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`rounded-2xl p-6 ${
            plan.id === 'bloom'
              ? 'bg-gradient-to-b from-emerald-800 to-emerald-900 border-2 border-emerald-500'
              : 'bg-slate-800'
          } ${currentPlan === plan.id ? 'ring-2 ring-emerald-400' : ''}`}
        >
          {plan.id === 'bloom' && (
            <div className="text-center mb-4">
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                인기
              </span>
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-1">{plan.nameKo}</h3>
          <p className="text-sm text-slate-400 mb-4">{plan.name}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-white">{plan.priceDisplay}</span>
          </div>

          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelectPlan(plan.id)}
            className={`w-full py-3 rounded-xl font-medium transition ${
              currentPlan === plan.id
                ? 'bg-slate-600 text-slate-300 cursor-default'
                : plan.id === 'bloom'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
            disabled={currentPlan === plan.id}
          >
            {currentPlan === plan.id ? '현재 플랜' : '선택하기'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// 네비게이션 컴포넌트
// ============================================

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  gardenHealth: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, gardenHealth }) => {
  const navItems: { view: ViewType; icon: React.ReactNode; label: string }[] = [
    { view: 'garden', icon: <GardenIcon />, label: '정원' },
    { view: 'journal', icon: <JournalIcon />, label: '일기' },
    { view: 'chat', icon: <ChatIcon />, label: '상담' },
    { view: 'pricing', icon: <LeafIcon />, label: '플랜' },
  ];

  return (
    <nav className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map(({ view, icon, label }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className={`flex flex-col items-center py-3 px-4 transition ${
              currentView === view
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {icon}
            <span className="text-xs mt-1">{label}</span>
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
    { role: Role.MODEL, text: "안녕하세요! 저는 마음의 정원사예요 🌱\n오늘 기분이 어떠세요? 함께 마음 정원을 가꿔볼까요?" }
  ]);
  const [weedPullingMessages, setWeedPullingMessages] = useState<Message[]>([]);
  const [selectedWeed, setSelectedWeed] = useState<Weed | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
        text: "죄송해요, 잠시 문제가 생겼어요. 다시 말씀해주시겠어요? 🙏"
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

      // AI 응답 파싱 시도
      let analysis = { weeds: [], moodScore: 5, encouragement: "" };
      try {
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        }
      } catch {
        analysis.encouragement = response.text;
      }

      // 새 일기 생성
      const newJournal: JournalEntry = {
        id: Date.now().toString(),
        content,
        createdAt: new Date(),
        emotions: analysis.weeds?.map((w: any) => w.emotion).filter(Boolean) || ['peace'],
        identifiedWeeds: [],
        aiAnalysis: analysis.encouragement,
        moodScore: analysis.moodScore || 5,
      };

      // 새 잡초들 추가
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
      text: `"${weed.name}"을(를) 함께 뽑아볼까요? 🌿\n\n이 잡초가 처음 마음에 자라기 시작한 게 언제쯤이었어요?`
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

      // 완료 체크
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

  // 뷰 렌더링
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => setCurrentView('garden')}
            onViewPricing={() => setCurrentView('pricing')}
          />
        );
      case 'garden':
        return <GardenView garden={garden} onPullWeed={handleStartWeedPulling} />;
      case 'journal':
        return (
          <JournalView
            journals={journals}
            onSaveJournal={handleSaveJournal}
            isAnalyzing={isAnalyzing}
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
          />
        );
      case 'pricing':
        return <PricingView currentPlan={subscription} onSelectPlan={setSubscription} />;
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
      {/* 헤더 */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2"
          >
            <LeafIcon className="w-7 h-7 text-emerald-400" />
            <span className="font-bold text-white">마음의 정원</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-slate-400">정원 건강도: </span>
              <span className={`font-bold ${
                garden.gardenHealth > 70 ? 'text-emerald-400' :
                garden.gardenHealth > 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {garden.gardenHealth}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>

      {/* 네비게이션 */}
      <Navigation
        currentView={currentView}
        onNavigate={setCurrentView}
        gardenHealth={garden.gardenHealth}
      />
    </div>
  );
};

export default App;
