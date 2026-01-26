import { ContentType, ContentTemplate } from './types';

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: ContentType.BLOG_POST,
    name: 'Blog Post',
    nameKo: '블로그 글',
    icon: '📝',
    description: 'SEO 최적화된 블로그 글 생성',
    placeholder: '주제: 예) 홈 카페 커피 맛있게 내리는 법',
    isPro: false,
  },
  {
    id: ContentType.FACEBOOK_AD,
    name: 'Facebook Ad',
    nameKo: '페이스북 광고',
    icon: '📘',
    description: '클릭율 높은 페이스북 광고 카피',
    placeholder: '제품/서비스: 예) 온라인 영어 회화 수업',
    isPro: false,
  },
  {
    id: ContentType.INSTAGRAM_CAPTION,
    name: 'Instagram Caption',
    nameKo: '인스타그램 캡션',
    icon: '📸',
    description: '바이럴 인스타그램 캡션 + 해시태그',
    placeholder: '사진 설명: 예) 제주도 일출 여행 사진',
    isPro: false,
  },
  {
    id: ContentType.PRODUCT_DESCRIPTION,
    name: 'Product Description',
    nameKo: '상품 설명',
    icon: '🛍️',
    description: '전환율 높은 상품 상세 설명',
    placeholder: '상품: 예) 무선 블루투스 이어폰',
    isPro: false,
  },
  {
    id: ContentType.EMAIL_SUBJECT,
    name: 'Email Subject Lines',
    nameKo: '이메일 제목',
    icon: '✉️',
    description: '오픈율 높은 이메일 제목 10개',
    placeholder: '이메일 내용: 예) 신제품 출시 알림',
    isPro: false,
  },
  {
    id: ContentType.YOUTUBE_TITLE,
    name: 'YouTube Titles',
    nameKo: '유튜브 제목',
    icon: '🎬',
    description: '클릭 유도하는 유튜브 제목 + 썸네일 아이디어',
    placeholder: '영상 주제: 예) 1인 가구 자취 요리',
    isPro: true,
  },
  {
    id: ContentType.TWITTER_THREAD,
    name: 'Twitter Thread',
    nameKo: '트위터 스레드',
    icon: '🐦',
    description: '바이럴 트위터 스레드 구성',
    placeholder: '주제: 예) 스타트업 창업 경험담',
    isPro: true,
  },
  {
    id: ContentType.LANDING_PAGE,
    name: 'Landing Page Copy',
    nameKo: '랜딩페이지',
    icon: '🚀',
    description: '전환 최적화된 랜딩페이지 카피',
    placeholder: '서비스: 예) AI 이력서 작성 서비스',
    isPro: true,
  },
  {
    id: ContentType.SLOGAN,
    name: 'Brand Slogan',
    nameKo: '브랜드 슬로건',
    icon: '💎',
    description: '기억에 남는 브랜드 슬로건 10개',
    placeholder: '브랜드: 예) 친환경 텀블러 브랜드',
    isPro: true,
  },
  {
    id: ContentType.SEO_META,
    name: 'SEO Meta Tags',
    nameKo: 'SEO 메타태그',
    icon: '🔍',
    description: 'SEO 최적화된 메타 타이틀 & 설명',
    placeholder: '페이지: 예) 온라인 꽃배달 서비스',
    isPro: true,
  },
];

export const getPromptForType = (type: ContentType, input: string): string => {
  const prompts: Record<ContentType, string> = {
    [ContentType.BLOG_POST]: `
당신은 전문 SEO 블로그 작가입니다. 다음 주제로 매력적이고 SEO 최적화된 블로그 글을 작성하세요.

주제: ${input}

요구사항:
- 제목 (클릭을 유도하는 매력적인 제목)
- 서론 (독자의 관심을 끄는 도입부)
- 본문 (3-4개의 소제목으로 구성, 각 섹션 2-3문단)
- 결론 (핵심 요약 및 CTA)
- 한국어로 작성
- 자연스럽고 읽기 쉬운 문체
`,
    [ContentType.FACEBOOK_AD]: `
당신은 페이스북 광고 전문가입니다. 다음 제품/서비스에 대한 고성과 광고 카피를 작성하세요.

제품/서비스: ${input}

3가지 버전을 제공하세요:
1. 감정 호소형 (Pain point → Solution)
2. 사회적 증거형 (후기/숫자 강조)
3. 긴급성 유발형 (한정/마감 강조)

각 버전에 포함할 것:
- 헤드라인 (25자 이내)
- 본문 (125자 이내)
- CTA 버튼 텍스트
- 한국어로 작성
`,
    [ContentType.INSTAGRAM_CAPTION]: `
당신은 인스타그램 인플루언서입니다. 다음 내용에 대한 바이럴 캡션을 작성하세요.

내용: ${input}

요구사항:
- 첫 줄에 강렬한 훅 (스크롤 멈추게)
- 스토리텔링 또는 공감 유발
- CTA (저장/공유/댓글 유도)
- 관련 해시태그 15-20개
- 이모지 적절히 사용
- 한국어로 작성
`,
    [ContentType.PRODUCT_DESCRIPTION]: `
당신은 이커머스 카피라이터입니다. 다음 상품의 전환율 높은 상세 설명을 작성하세요.

상품: ${input}

구성:
- 헤드라인 (핵심 베네핏)
- 서브헤드 (차별점)
- 주요 특징 5가지 (베네핏 중심으로)
- 사용 시나리오 3가지
- FAQ 3개
- 구매 유도 마무리 문구
- 한국어로 작성
`,
    [ContentType.EMAIL_SUBJECT]: `
당신은 이메일 마케팅 전문가입니다. 다음 내용에 대한 오픈율 높은 이메일 제목 10개를 작성하세요.

이메일 내용: ${input}

다양한 스타일로 제안:
- 호기심 유발형 2개
- 숫자/데이터형 2개
- 긴급성 형 2개
- 개인화형 2개
- 이익 강조형 2개

각 제목은 50자 이내로, 한국어로 작성하세요.
`,
    [ContentType.YOUTUBE_TITLE]: `
당신은 유튜브 성장 전문가입니다. 다음 영상에 대한 클릭을 유도하는 제목과 썸네일 아이디어를 제안하세요.

영상 주제: ${input}

제공할 것:
1. 제목 옵션 5개 (각각 다른 스타일)
   - 숫자형, 질문형, 비밀/팁형, 충격형, 비교형
2. 각 제목에 맞는 썸네일 아이디어
   - 이미지 구성
   - 텍스트 오버레이
   - 색상 제안
3. 추천 태그 10개
- 한국어로 작성
`,
    [ContentType.TWITTER_THREAD]: `
당신은 트위터 바이럴 전문가입니다. 다음 주제로 리트윗 많이 되는 스레드를 작성하세요.

주제: ${input}

요구사항:
- 첫 트윗: 강렬한 훅 (스크롤 멈추게)
- 8-10개의 트윗으로 구성
- 각 트윗 280자 이내
- 마지막: CTA (팔로우/리트윗 유도)
- 적절한 이모지 사용
- 한국어로 작성
`,
    [ContentType.LANDING_PAGE]: `
당신은 전환 최적화 전문가입니다. 다음 서비스의 랜딩페이지 카피를 작성하세요.

서비스: ${input}

구성:
1. Hero Section
   - 헤드라인 (핵심 가치)
   - 서브헤드 (구체적 베네핏)
   - CTA 버튼 텍스트

2. Problem Section
   - 고객의 Pain points 3가지

3. Solution Section
   - 서비스가 해결하는 방법

4. Features Section
   - 주요 기능 4가지 (베네핏 중심)

5. Social Proof
   - 가상 후기 3개

6. Pricing Section
   - 가격 제시 방법 제안

7. FAQ
   - 예상 질문 5개

8. Final CTA
   - 마지막 설득 문구

- 한국어로 작성
`,
    [ContentType.SLOGAN]: `
당신은 브랜딩 전문가입니다. 다음 브랜드의 기억에 남는 슬로건 10개를 제안하세요.

브랜드: ${input}

다양한 스타일로:
- 감성형 2개
- 기능형 2개
- 재치있는 2개
- 미니멀 2개
- 질문형 2개

각 슬로건에 대해:
- 슬로건 (10자 이내 권장)
- 왜 효과적인지 설명
- 한국어로 작성
`,
    [ContentType.SEO_META]: `
당신은 SEO 전문가입니다. 다음 페이지의 검색 최적화된 메타 태그를 작성하세요.

페이지: ${input}

제공할 것:
1. Meta Title 옵션 3개 (60자 이내)
2. Meta Description 옵션 3개 (160자 이내)
3. 타겟 키워드 10개
4. Open Graph 태그
   - og:title
   - og:description
5. Schema markup 제안
- 한국어로 작성
`,
  };

  return prompts[type];
};
