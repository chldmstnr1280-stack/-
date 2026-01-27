import { SubscriptionTier } from './types';

// 마음 정원사 AI 프롬프트 - 일기 분석용
export const GARDEN_ANALYST_PROMPT = `
당신은 "마음의 정원"의 정원사입니다.
사용자의 일기를 읽고 마음속 "잡초"(부정적 사고 패턴)를 찾아주는 역할입니다.

분석 방식:
1. 일기 내용에서 부정적 사고 패턴을 식별
2. 각 패턴에 이름을 붙여줌 (예: "완벽주의 덩굴", "비교의 가시나무")
3. 뿌리 깊이를 판단 (shallow/medium/deep)
4. 관련 감정을 식별

응답 형식 (JSON):
{
  "weeds": [
    {
      "name": "잡초 이름",
      "description": "이 사고 패턴이 왜 해로운지 설명",
      "rootDepth": "shallow|medium|deep",
      "emotion": "sadness|anger|fear|anxiety|confusion"
    }
  ],
  "moodScore": 1-10,
  "positiveAspects": ["긍정적인 점들"],
  "encouragement": "따뜻한 격려 메시지"
}

주의사항:
- 절대 판단하거나 비난하지 않기
- 공감적이고 따뜻한 톤 유지
- 사용자가 스스로 인식할 수 있게 도와주기
- 한국어로 응답
`;

// 잡초 뽑기 세션 AI 프롬프트
export const WEED_PULLER_PROMPT = `
당신은 "마음의 정원"의 치유사입니다.
사용자가 특정 "잡초"(부정적 사고 패턴)를 뽑는 것을 도와줍니다.

잡초 정보:
{weedInfo}

대화 방식:
1. 먼저 이 잡초가 언제 처음 자라났는지 물어보기
2. 이 생각이 사실인지, 해석인지 구분하게 돕기
3. 이 생각이 자신에게 어떤 영향을 미쳤는지 탐색
4. 대안적 관점 제시하기
5. 잡초를 뽑고 그 자리에 심을 새 생각(식물) 정하기

대화 스타일:
- 따뜻하고 공감적
- 짧고 명확한 질문 (50자 이내)
- 한 번에 하나의 질문만
- 이모지 적절히 사용
- 한국어로 대화

잡초 뽑기 완료 조건:
- 사용자가 새로운 관점을 발견했을 때
- 대안적 생각을 심었을 때
- "[완료]" 태그와 함께 축하 메시지 전송
`;

// 일반 상담 AI 프롬프트
export const COUNSELOR_PROMPT = `
당신은 "마음의 정원"의 상담사입니다.
사용자의 마음 건강을 돌보는 따뜻한 대화 상대입니다.

역할:
- 일상적인 고민 들어주기
- 감정 표현 도와주기
- 정원 가꾸기 비유로 마음 돌봄 설명
- 필요시 일기 쓰기나 잡초 뽑기 세션 제안

대화 스타일:
- 따뜻하고 공감적
- 비판단적
- 짧고 친근한 말투 (50자 이내)
- 이모지 사용
- 한국어로 대화

핵심 메시지:
"마음도 정원처럼 돌봄이 필요해요.
잡초를 뽑고, 물을 주고, 햇빛을 쬐면
당신의 마음 정원은 분명 아름답게 피어날 거예요."
`;

// 구독 플랜 정의
export const SUBSCRIPTION_PLANS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    nameKo: '씨앗 심기',
    price: 0,
    priceDisplay: '무료',
    features: [
      '주 3회 일기 작성',
      '기본 감정 분석',
      '잡초 3개까지 식별',
      '기본 정원 테마',
    ],
    journalLimit: 12, // 월 12회 (주 3회)
    weedRemovalLimit: 3,
    aiAnalysisDepth: 'basic',
    hasVoiceJournal: false,
    hasGroupGarden: false,
    hasProfessionalSupport: false,
  },
  {
    id: 'seed',
    name: 'Seed',
    nameKo: '새싹 키우기',
    price: 9900,
    priceDisplay: '₩9,900/월',
    features: [
      '매일 일기 작성',
      '상세 감정 분석',
      '무제한 잡초 뽑기',
      '10가지 정원 테마',
      '주간 마음 리포트',
    ],
    journalLimit: -1,
    weedRemovalLimit: -1,
    aiAnalysisDepth: 'detailed',
    hasVoiceJournal: false,
    hasGroupGarden: false,
    hasProfessionalSupport: false,
  },
  {
    id: 'bloom',
    name: 'Bloom',
    nameKo: '꽃 피우기',
    price: 19900,
    priceDisplay: '₩19,900/월',
    features: [
      '새싹 키우기의 모든 기능',
      '음성 일기 기능',
      '심층 AI 분석',
      '프리미엄 정원 테마',
      '친구와 정원 공유',
      '월간 성장 리포트',
    ],
    journalLimit: -1,
    weedRemovalLimit: -1,
    aiAnalysisDepth: 'comprehensive',
    hasVoiceJournal: true,
    hasGroupGarden: true,
    hasProfessionalSupport: false,
  },
  {
    id: 'evergreen',
    name: 'Evergreen',
    nameKo: '상록수 되기',
    price: 49900,
    priceDisplay: '₩49,900/월',
    features: [
      '꽃 피우기의 모든 기능',
      '전문 상담사 연결 (월 2회)',
      '1:1 맞춤 코칭',
      'VIP 전용 컨텐츠',
      '기업/단체 라이선스',
      '우선 고객 지원',
    ],
    journalLimit: -1,
    weedRemovalLimit: -1,
    aiAnalysisDepth: 'comprehensive',
    hasVoiceJournal: true,
    hasGroupGarden: true,
    hasProfessionalSupport: true,
  },
];

// 잡초 타입별 이름 예시
export const WEED_TYPES = {
  anxiety: ['걱정의 덩굴', '불안의 가시나무', '초조함의 엉겅퀴'],
  sadness: ['슬픔의 시든 잎', '우울의 그늘', '외로움의 이끼'],
  anger: ['분노의 불꽃나무', '짜증의 가시', '억울함의 뿌리'],
  fear: ['두려움의 그림자', '공포의 덤불', '회피의 담쟁이'],
  confusion: ['혼란의 안개', '방황의 미로', '불확실함의 뿌리'],
};

// 식물 타입별 이름 예시
export const PLANT_TYPES = {
  flower: ['희망의 해바라기', '평화의 라벤더', '사랑의 장미', '기쁨의 데이지'],
  tree: ['자신감의 떡갈나무', '인내의 소나무', '지혜의 은행나무'],
  herb: ['평온의 캐모마일', '활력의 민트', '치유의 로즈마리'],
  succulent: ['회복력의 선인장', '적응력의 다육이', '강인함의 알로에'],
};

// 감정 색상 매핑
export const EMOTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  joy: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' },
  sadness: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400' },
  anger: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400' },
  fear: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400' },
  anxiety: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400' },
  peace: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
  love: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-400' },
  confusion: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400' },
};

// 감정 이모지 매핑
export const EMOTION_EMOJIS: Record<string, string> = {
  joy: '😊',
  sadness: '😢',
  anger: '😤',
  fear: '😰',
  anxiety: '😟',
  peace: '😌',
  love: '🥰',
  confusion: '😵',
};

// 레거시 export (기존 코드 호환용)
export const SOCRATES_SYSTEM_PROMPT = COUNSELOR_PROMPT;
