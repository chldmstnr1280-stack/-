# CopyGenius AI

AI 마케팅 카피 생성기 - 매출 올리는 콘텐츠를 10초 만에

## 비즈니스 모델

- **Free**: 매일 5회 무료 생성
- **Pro**: $9.99/월 무제한 생성
- **목표**: 100명 유료 고객 = **월 $999 수익**

## 주요 기능

### 10가지 콘텐츠 템플릿
| 템플릿 | 설명 | 플랜 |
|--------|------|------|
| 블로그 글 | SEO 최적화된 블로그 포스트 | Free |
| 페이스북 광고 | 클릭율 높은 광고 카피 | Free |
| 인스타그램 캡션 | 바이럴 캡션 + 해시태그 | Free |
| 상품 설명 | 전환율 높은 상품 상세 | Free |
| 이메일 제목 | 오픈율 높은 제목 10개 | Free |
| 유튜브 제목 | 클릭 유도 제목 + 썸네일 | Pro |
| 트위터 스레드 | 바이럴 스레드 구성 | Pro |
| 랜딩페이지 | 전환 최적화 카피 | Pro |
| 브랜드 슬로건 | 기억에 남는 슬로건 | Pro |
| SEO 메타태그 | 검색 최적화 태그 | Pro |

## 기술 스택

- React 19 + TypeScript
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- Google Gemini API (AI 생성)
- LocalStorage (사용량 추적)

## 실행 방법

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env.local 파일 생성)
GEMINI_API_KEY=your_api_key_here

# 개발 서버 실행
npm run dev
```

## 수익화 (Stripe 연동)

실제 결제를 받으려면 Stripe를 연동하세요:

1. [Stripe 계정 생성](https://stripe.com)
2. 상품 및 가격 설정 ($9.99/월 구독)
3. Checkout Session API 연동
4. Webhook으로 결제 상태 관리

```javascript
// Stripe Checkout 예시
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price: 'price_xxxxx', // 월 $9.99 가격 ID
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: 'https://yoursite.com/success',
  cancel_url: 'https://yoursite.com/cancel',
});
```

## 마케팅 전략

### 목표 고객
- 1인 기업가 / 프리랜서
- 소규모 마케팅 팀
- 콘텐츠 크리에이터
- 이커머스 셀러

### 채널
1. **SEO**: "AI 카피라이팅", "마케팅 카피 생성기" 키워드
2. **SNS**: 생성된 콘텐츠 예시 공유
3. **커뮤니티**: 스타트업/마케팅 커뮤니티 홍보
4. **제휴**: 인플루언서 협업

### 전환 최적화
- 무료 사용 후 Pro 전환 유도
- 사용량 제한 도달 시 업그레이드 팝업
- 이메일 리마인더 (Pro 기능 안내)

## 확장 아이디어

- [ ] 다국어 지원 (영어, 일본어)
- [ ] API 제공 (개발자용)
- [ ] 팀 플랜 ($49/월)
- [ ] Chrome 확장 프로그램
- [ ] Notion/Slack 통합
