import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ContentType, ContentTemplate, GeneratedContent, UserUsage, FREE_DAILY_LIMIT, PRO_PRICE } from './types';
import { CONTENT_TEMPLATES, getPromptForType } from './constants';

// --- Usage Management ---
const getStorageKey = (key: string) => `copygenius_${key}`;

const loadUsage = (): UserUsage => {
  const stored = localStorage.getItem(getStorageKey('usage'));
  const today = new Date().toDateString();

  if (stored) {
    const usage = JSON.parse(stored) as UserUsage;
    if (usage.lastResetDate !== today) {
      return { dailyCount: 0, lastResetDate: today, isPro: usage.isPro, totalGenerated: usage.totalGenerated };
    }
    return usage;
  }

  return { dailyCount: 0, lastResetDate: today, isPro: false, totalGenerated: 0 };
};

const saveUsage = (usage: UserUsage) => {
  localStorage.setItem(getStorageKey('usage'), JSON.stringify(usage));
};

const loadHistory = (): GeneratedContent[] => {
  const stored = localStorage.getItem(getStorageKey('history'));
  return stored ? JSON.parse(stored) : [];
};

const saveHistory = (history: GeneratedContent[]) => {
  localStorage.setItem(getStorageKey('history'), JSON.stringify(history.slice(0, 50)));
};

// --- Icons ---
const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Components ---

interface TemplateCardProps {
  template: ContentTemplate;
  isSelected: boolean;
  onClick: () => void;
  isPro: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onClick, isPro }) => {
  const isLocked = template.isPro && !isPro;

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative p-4 rounded-xl border-2 text-left transition-all duration-200
        ${isSelected
          ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20'
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
        }
        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {isLocked && (
        <div className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <LockIcon /> PRO
        </div>
      )}
      <div className="text-2xl mb-2">{template.icon}</div>
      <h3 className="font-semibold text-white">{template.nameKo}</h3>
      <p className="text-sm text-slate-400 mt-1">{template.description}</p>
    </button>
  );
};

interface PricingModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-4">
            <SparklesIcon />
          </div>
          <h2 className="text-2xl font-bold text-white">CopyGenius Pro</h2>
          <p className="text-slate-400 mt-2">무제한 AI 콘텐츠 생성</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-white">${PRO_PRICE}</span>
            <span className="text-slate-400">/월</span>
          </div>
          <p className="text-center text-slate-500 text-sm mt-2">100명 유료 고객 = 월 $999 수익</p>
        </div>

        <ul className="space-y-3 mb-6">
          {[
            '무제한 콘텐츠 생성',
            '모든 템플릿 사용',
            '우선 생성 속도',
            '히스토리 무제한 저장',
            '신규 템플릿 우선 제공',
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-slate-300">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                <CheckIcon />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={onUpgrade}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold transition-all"
        >
          Pro 시작하기
        </button>

        <p className="text-center text-slate-500 text-xs mt-4">
          Stripe 연동 후 실제 결제가 활성화됩니다
        </p>
      </div>
    </div>
  );
};

interface ResultPanelProps {
  content: string;
  isLoading: boolean;
  onCopy: () => void;
  copied: boolean;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ content, isLoading, onCopy, copied }) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/20 mb-4">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-400">AI가 콘텐츠를 생성 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-slate-500">
          <SparklesIcon />
          <p className="mt-4">템플릿을 선택하고<br />주제를 입력하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">생성 결과</h3>
        <button
          onClick={onCopy}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
            ${copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }
          `}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-slate-900 rounded-xl p-4">
        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [input, setInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState<UserUsage>(loadUsage);
  const [history, setHistory] = useState<GeneratedContent[]>(loadHistory);
  const [showPricing, setShowPricing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveUsage(usage);
  }, [usage]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const remainingGenerations = usage.isPro ? Infinity : FREE_DAILY_LIMIT - usage.dailyCount;

  const handleGenerate = useCallback(async () => {
    if (!selectedTemplate || !input.trim()) return;

    if (!usage.isPro && usage.dailyCount >= FREE_DAILY_LIMIT) {
      setShowPricing(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = getPromptForType(selectedTemplate.id, input);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const result = response.text || '';
      setGeneratedContent(result);

      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: selectedTemplate.id,
        input,
        output: result,
        createdAt: new Date(),
      };

      setHistory(prev => [newContent, ...prev]);
      setUsage(prev => ({
        ...prev,
        dailyCount: prev.dailyCount + 1,
        totalGenerated: prev.totalGenerated + 1,
      }));
    } catch (err) {
      setError('콘텐츠 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTemplate, input, usage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpgrade = () => {
    // Stripe integration placeholder
    setUsage(prev => ({ ...prev, isPro: true }));
    setShowPricing(false);
    alert('Pro 활성화됨! (실제 앱에서는 Stripe 결제 후 활성화)');
  };

  const handleTemplateSelect = (template: ContentTemplate) => {
    if (template.isPro && !usage.isPro) {
      setShowPricing(true);
      return;
    }
    setSelectedTemplate(template);
    setInput('');
    setGeneratedContent('');
  };

  // --- Landing Page ---
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-fuchsia-600/20" />
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-3xl" />
          </div>

          <nav className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <SparklesIcon />
              </div>
              <span className="font-bold text-xl">CopyGenius</span>
            </div>
            <button
              onClick={() => setView('app')}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              시작하기
            </button>
          </nav>

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm mb-6">
              <SparklesIcon /> AI 기반 마케팅 카피
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent">
              AI가 만드는<br />매출 올리는 카피
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              블로그, SNS, 광고, 이메일까지. 전환율 높은 마케팅 콘텐츠를
              10초 만에 생성하세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setView('app')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-semibold text-lg transition-all shadow-lg shadow-violet-500/25"
              >
                무료로 시작하기
              </button>
              <span className="text-slate-500">매일 5회 무료</span>
            </div>
          </div>
        </div>

        {/* Templates Preview */}
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-4">10가지 콘텐츠 템플릿</h2>
          <p className="text-slate-400 text-center mb-12">모든 마케팅 채널을 커버하는 AI 템플릿</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CONTENT_TEMPLATES.map(template => (
              <div
                key={template.id}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center"
              >
                <div className="text-3xl mb-2">{template.icon}</div>
                <div className="font-medium text-sm">{template.nameKo}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-4">심플한 가격</h2>
          <p className="text-slate-400 text-center mb-12">필요한 만큼만 사용하세요</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-slate-400">/월</span>
              </div>
              <ul className="space-y-3 mb-6">
                {['매일 5회 생성', '기본 템플릿 5개', '히스토리 10개 저장'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckIcon /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setView('app')}
                className="w-full py-3 rounded-xl border border-slate-600 hover:bg-slate-700 transition-colors"
              >
                시작하기
              </button>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 border border-violet-500/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-xs font-semibold">
                BEST VALUE
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">${PRO_PRICE}</span>
                <span className="text-slate-400">/월</span>
              </div>
              <ul className="space-y-3 mb-6">
                {['무제한 생성', '모든 템플릿 10개', '히스토리 무제한', '우선 처리 속도', '신규 기능 우선 제공'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckIcon /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { setView('app'); setShowPricing(true); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-semibold transition-all"
              >
                Pro 시작하기
              </button>
            </div>
          </div>
        </div>

        {/* Revenue Calculator */}
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-8">수익 계산기</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-violet-400">100명</div>
                <div className="text-slate-400 mt-2">월간 유료 고객</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-fuchsia-400">${PRO_PRICE}</div>
                <div className="text-slate-400 mt-2">월 구독료</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-green-400">$999</div>
                <div className="text-slate-400 mt-2">월 수익</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 시작하세요</h2>
          <p className="text-slate-400 mb-8">신용카드 없이 무료로 시작</p>
          <button
            onClick={() => setView('app')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-semibold text-lg transition-all"
          >
            무료로 시작하기
          </button>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
            <p>CopyGenius - AI 마케팅 카피 생성기</p>
            <p className="mt-2">Stripe 연동으로 실제 결제 수익화 가능</p>
          </div>
        </footer>
      </div>
    );
  }

  // --- App View ---
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('landing')} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <SparklesIcon />
              </div>
              <span className="font-bold">CopyGenius</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
            >
              <HistoryIcon />
              히스토리
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800">
              {usage.isPro ? (
                <span className="text-sm text-violet-400 font-medium">Pro</span>
              ) : (
                <>
                  <span className="text-sm text-slate-400">오늘 남은 횟수:</span>
                  <span className={`font-bold ${remainingGenerations <= 1 ? 'text-red-400' : 'text-green-400'}`}>
                    {remainingGenerations}
                  </span>
                </>
              )}
            </div>

            {!usage.isPro && (
              <button
                onClick={() => setShowPricing(true)}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-sm font-medium"
              >
                Pro 업그레이드
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-full">
          {/* Left: Template Selection */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">템플릿 선택</h2>
              <div className="grid grid-cols-2 gap-3">
                {CONTENT_TEMPLATES.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate?.id === template.id}
                    onClick={() => handleTemplateSelect(template)}
                    isPro={usage.isPro}
                  />
                ))}
              </div>
            </div>

            {selectedTemplate && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{selectedTemplate.icon} {selectedTemplate.nameKo}</h2>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={selectedTemplate.placeholder}
                  className="w-full h-32 p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none text-white placeholder-slate-500"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!input.trim() || isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <SparklesIcon />
                  {isLoading ? '생성 중...' : '콘텐츠 생성하기'}
                </button>
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 min-h-[500px]">
            <ResultPanel
              content={generatedContent}
              isLoading={isLoading}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>
        </div>
      </main>

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-800 border-l border-slate-700 shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold">생성 히스토리</h3>
            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <p className="text-slate-500 text-center py-8">히스토리가 없습니다</p>
            ) : (
              history.map(item => {
                const template = CONTENT_TEMPLATES.find(t => t.id === item.type);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setGeneratedContent(item.output);
                      setShowHistory(false);
                    }}
                    className="w-full p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-left"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{template?.icon}</span>
                      <span className="font-medium text-sm">{template?.nameKo}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{item.input}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {showPricing && (
        <PricingModal onClose={() => setShowPricing(false)} onUpgrade={handleUpgrade} />
      )}
    </div>
  );
};

export default App;
