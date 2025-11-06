# 🚀 SELLERY Phase 1 - Quick Start Guide

**복붙-즉시-실행 명령어 모음**

## 전체 프로젝트 트리

```
sellery/
├── server/                      # Express + Prisma 백엔드
│   ├── prisma/
│   │   ├── schema.prisma       # DB 스키마 (User, EmotionEntry, MascotState)
│   │   └── seed.ts             # 시드 스크립트
│   ├── src/
│   │   ├── auth/               # JWT 유틸
│   │   ├── services/           # mascot.ts, stats.ts
│   │   ├── routes/             # auth, emotion, mascot, report, stubs
│   │   ├── middleware/         # authenticateJWT
│   │   └── index.ts            # Express 서버
│   ├── tests/                  # Jest 테스트
│   └── openapi.yaml            # API 문서
│
├── app/                         # React Native + Expo 앱
│   ├── app/                    # Expo Router 화면
│   │   ├── (auth)/             # login, onboarding
│   │   ├── (tabs)/             # home, log, report, settings
│   │   └── _layout.tsx
│   ├── src/
│   │   ├── api/client.ts       # Axios API 클라이언트
│   │   ├── stores/             # Zustand (auth, emotion)
│   │   └── types/
│   └── tests/                  # Jest 테스트
│
├── .github/workflows/ci.yml     # GitHub Actions
└── pnpm-workspace.yaml         # Monorepo 설정
```

---

## ⚡ 1단계: 설치 및 초기화

```bash
# 1. 모든 의존성 설치
pnpm install

# 완료 확인: ✓ node_modules/ 생성됨
```

---

## ⚡ 2단계: 서버 실행

**새 터미널 #1**

```bash
cd server

# 환경변수 복사
cp .env.example .env

# Prisma 클라이언트 생성
pnpm prisma generate

# DB 마이그레이션
pnpm prisma migrate dev --name init

# 시드 데이터 주입 (demo@sellery.app 계정)
pnpm prisma:seed

# 서버 시작
pnpm dev
```

**확인:**
- ✅ `🌱 SELLERY Server is running` 메시지
- ✅ http://localhost:3000/health 접속 → `{"status":"ok"}`
- ✅ http://localhost:3000/docs 접속 → Swagger UI 확인

---

## ⚡ 3단계: 모바일 앱 실행

**새 터미널 #2**

```bash
cd app

# 환경변수 복사
cp .env.example .env

# Expo 시작
pnpm start
```

**QR 코드 스캔:**
- iOS: 카메라 앱
- Android: Expo Go 앱

**또는 웹으로 테스트:**
```bash
pnpm start --web
```

---

## ⚡ 4단계: 앱 사용 플로우

### 1️⃣ 로그인
1. 이메일 입력 (예: `test@sellery.app`)
2. "Get Magic Link" 클릭
3. **서버 터미널에서 토큰 복사** (예: `eyJhbGciOi...`)
4. 앱에 토큰 붙여넣기
5. "Continue" → Onboarding 완료

### 2️⃣ 감정 기록
1. "Log" 탭 이동
2. 이모지 선택 (예: 😊 happy)
3. 강도 조절 (0-10)
4. 노트 작성 (선택)
5. "Log Emotion" 제출

### 3️⃣ 마스코트 확인
1. "Garden" 탭 이동
2. 셀리 단계 확인 (🌰 → 🌱 → 🌿)
3. 성장 점수 확인
4. 정서 지지 메시지 확인

### 4️⃣ 주간 리포트
1. "Report" 탭 이동
2. 7일 통계 확인
   - 평균 강도
   - Top 3 감정
   - 기록 일수
   - 일별 추이 차트

---

## 🧪 테스트 실행

```bash
# 전체 테스트
pnpm test

# 서버만
cd server && pnpm test

# 앱만
cd app && pnpm test

# 린트 검사
pnpm lint
```

---

## 📊 마스코트 성장 로직 (Phase 1)

```typescript
// server/src/services/mascot.ts

score = 0
for each day in last 7 days:
  if (entries.length > 0):
    score += 2  // 기록 보너스
    avgIntensity = average(intensities)
    score += floor((10 - avgIntensity) / 2)  // 평온 보너스

stage =
  score < 10  → 'seed'   (🌰 씨앗 셀리)
  score < 20  → 'sprout' (🌱 새싹 셀리)
  score >= 20 → 'kid'    (🌿 꼬마 셀리)
```

**정서 지지 메시지 매핑:**
```typescript
SUPPORT_MESSAGES = {
  anxious: {
    low: "괜찮아요, 차분히 호흡해봐요 🌿",
    medium: "불안한 마음을 함께 나눠요. 깊게 숨을 쉬어봐요.",
    high: "지금은 호흡에 집중해요. 천천히, 깊게. 당신 곁에 있어요."
  },
  // ... 7개 감정별 메시지
}
```

---

## 🔌 API 엔드포인트 목록

### Phase 1 (구현 완료)

```bash
# 인증
POST   /auth/magic-link    # 이메일로 매직 링크 요청
POST   /auth/callback      # 토큰 검증 → JWT 발급

# 사용자
GET    /me                 # 프로필 조회

# 감정
POST   /emotion            # 감정 기록 생성
GET    /emotion?from&to    # 감정 목록 조회

# 마스코트
GET    /mascot/today       # 현재 단계/점수/메시지

# 리포트
GET    /report/weekly      # 7일 통계
```

### Phase 2/3 (스텁만)

```bash
POST   /steps              # 걸음수 기록
POST   /cycle              # 생리 주기 기록
GET    /store              # 상점 아이템
GET    /inventory          # 인벤토리
POST   /ai/message         # LLM 채팅
```

모든 스텁은 `{ message: "Not Implemented", phase: 2 }` 반환

---

## 🔥 트러블슈팅

### "Prisma Client not found"
```bash
cd server
pnpm prisma generate
```

### "Cannot connect to server"
```bash
# 서버 실행 확인
curl http://localhost:3000/health

# .env 확인
cd app
cat .env  # EXPO_PUBLIC_API_URL=http://localhost:3000
```

### "Database locked" (SQLite)
```bash
cd server
rm prisma/dev.db
pnpm prisma migrate dev --name init
pnpm prisma:seed
```

### Expo 캐시 클리어
```bash
cd app
pnpm start --clear
```

---

## 🗄️ 데이터베이스 관리

```bash
cd server

# Prisma Studio (GUI)
pnpm prisma studio

# DB 초기화 (⚠️ 모든 데이터 삭제)
pnpm prisma migrate reset

# 새 마이그레이션 생성
pnpm prisma migrate dev --name add_new_field

# 프로덕션 마이그레이션
pnpm prisma migrate deploy
```

---

## 🐘 PostgreSQL 전환 (옵션)

```bash
# 1. PostgreSQL 설치 및 실행
# 2. server/.env 수정
DATABASE_URL="postgresql://user:pass@localhost:5432/sellery"

# 3. schema.prisma 수정
# provider = "postgresql"

# 4. 마이그레이션 재생성
cd server
rm -rf prisma/migrations
pnpm prisma migrate dev --name init_postgres
pnpm prisma:seed
```

---

## 📦 배포 (참고)

### 서버 (Railway/Render)
```bash
cd server

# 환경변수 설정
# DATABASE_URL=postgresql://...
# JWT_SECRET=random-secret-key

# 빌드 및 실행
pnpm build
pnpm prisma migrate deploy
pnpm start
```

### 앱 (Expo EAS)
```bash
cd app

# EAS CLI 설치
npm install -g eas-cli

# 빌드
eas build --platform all
```

---

## ✅ 수용 기준 체크리스트

- [x] `pnpm install` 성공
- [x] 서버 시작 → http://localhost:3000/docs 접속 가능
- [x] 앱 시작 → QR 코드 생성
- [x] 로그인 → 매직 링크 토큰으로 인증
- [x] 감정 기록 → 마스코트 점수 증가
- [x] 주간 리포트 → 통계 정상 표시
- [x] 테스트 → `pnpm test` 전체 통과
- [x] 스텁 API → 200 OK + "Not Implemented" 반환

---

## 📚 추가 문서

- **전체 README**: `/README.md`
- **OpenAPI 문서**: http://localhost:3000/docs
- **Prisma 스키마**: `/server/prisma/schema.prisma`
- **CI 워크플로**: `/.github/workflows/ci.yml`

---

## 🎯 다음 단계 (Phase 2/3)

1. **Phase 2 구현**
   - `/server/src/services/steps.ts` 추가
   - `/server/src/services/cycle.ts` 추가
   - `/app/app/(tabs)/tracking.tsx` 추가

2. **Phase 3 구현**
   - `/server/src/services/llm.ts` 추가 (OpenAI SDK)
   - `/app/app/(tabs)/chat.tsx` 추가

3. **프로덕션 최적화**
   - Redis 캐싱
   - Rate limiting
   - Sentry 에러 모니터링
   - Analytics 통합

---

**현재 버전: 1.0.0 (Phase 1)** 🌱

**Last Updated**: 2025-01-06
