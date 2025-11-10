# SELLERY 개발 환경 설정

## 사전 요구사항

### Mobile (React Native)
- Node.js 20+
- npm 또는 yarn
- React Native CLI
- Xcode (iOS 개발, macOS만)
- Android Studio (Android 개발)
- CocoaPods (iOS, macOS만)

### Backend
- Node.js 20+
- MongoDB 6+

---

## 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone [repository-url]
cd sellery
```

### 2. Mobile 앱 설정

```bash
cd mobile
npm install

# iOS (macOS만)
cd ios
pod install
cd ..
npm run ios

# Android
npm run android
```

### 3. Backend 설정

```bash
cd backend
npm install

# .env 파일 생성
cp .env.example .env
# .env 파일 수정 (MongoDB URI, JWT Secret 등)

# 개발 서버 실행
npm run dev
```

---

## 프로젝트 구조

```
sellery/
├── mobile/              # React Native 앱
│   ├── src/
│   │   ├── screens/     # 화면 컴포넌트
│   │   ├── components/  # 재사용 컴포넌트
│   │   ├── navigation/  # 네비게이션
│   │   ├── store/       # 상태 관리 (Zustand)
│   │   ├── types/       # TypeScript 타입
│   │   └── services/    # API, Health 연동
│   ├── App.tsx
│   └── package.json
│
├── backend/             # Node.js API
│   ├── src/
│   │   ├── routes/      # API 라우트
│   │   ├── controllers/ # 컨트롤러
│   │   ├── models/      # MongoDB 모델
│   │   ├── services/    # 비즈니스 로직
│   │   └── server.ts
│   └── package.json
│
├── shared/              # 공유 타입
└── docs/                # 문서
```

---

## 개발 워크플로우

### Phase 1: Day 0 온보딩 (현재)
- [x] 프로젝트 초기화
- [x] 기본 타입 정의
- [x] Welcome 화면
- [x] ProfileSetup 화면
- [ ] GardenIntro 화면
- [ ] SellyStylePicker 화면

### Phase 2: Day 1-2 감정 기록
- [ ] 감정 기록 화면
- [ ] Apple Health/Google Fit 연동
- [ ] 셀리 성장 애니메이션
- [ ] 백엔드 API 구현

---

## 트러블슈팅

### iOS 빌드 실패
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Android 빌드 실패
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Metro bundler 캐시 제거
```bash
npm start -- --reset-cache
```

---

## 추가 리소스

- [React Native 공식 문서](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [PRD 문서](../README.md)
