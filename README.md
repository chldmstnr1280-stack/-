# SELLERY (Self Love Reset)

> HSP를 위한 감성 웰니스 앱 → Digital Therapeutics (DTx) 전환

감정의 정원에서 셀리와 함께 성장해요 💚

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()
[![PRD](https://img.shields.io/badge/PRD-100%25-success.svg)](docs/PRD_VALIDATION.md)

---

## 📖 프로젝트 소개

SELLERY는 고민감성(HSP, Highly Sensitive Person) 여성을 위한 감성 웰니스 앱으로,
감정 기록, 루틴 관리, 임상 설문(PHQ-9/GAD-7)을 통해 사용자의 정신 건강을 관리하고
추후 Digital Therapeutics(DTx)로 전환을 목표로 합니다.

**타겟**: 20-35세 HSP 여성 (서울/한국)

---

## ✨ 핵심 기능

### 1. 7일 온보딩 시스템 ✅
- Day 0: 환영 & 프로필 설정
- Day 1: 첫 감정 기록
- Day 2: 활동 데이터 연동 (Apple Health/Google Fit)
- Day 3-4: 루틴 시작 (명상, 호흡법, 활동)
- Day 5: 주간 체크인 (PHQ-9/GAD-7)
- Day 7: 완료 축하

### 2. 감정 기록 + 셀리 성장 ✅
- 감정 텍스트, 이모지, 색상, 온도 입력
- 경험치 획득으로 셀리 진화 (씨앗 → 새싹 → 꽃 → 베이비)
- 건강 활동 데이터 연동 준비

### 3. PHQ-9 / GAD-7 임상 설문 ✅
- 우울증 선별 (PHQ-9)
- 불안장애 선별 (GAD-7)
- 주간 추이 분석
- DTx 임상 데이터 수집

### 4. 메인 앱 (4-Tab) ✅
- **홈**: 정원 뷰, 최근 감정 로그
- **루틴**: 명상, 호흡법, 활동 관리
- **마켓**: 프리미엄 루틴 쇼케이스
- **프로필**: 통계, 설정

---

## 🏗️ 프로젝트 구조

```
sellery/
├── mobile/              # React Native 앱
│   ├── src/
│   │   ├── screens/    # 화면 컴포넌트 (13개)
│   │   ├── components/ # 재사용 컴포넌트 (5개)
│   │   ├── store/      # Zustand 상태 관리 (6개)
│   │   ├── types/      # TypeScript 타입 (5개)
│   │   ├── navigation/ # 네비게이션 (3개)
│   │   └── constants/  # 상수
│   └── package.json
│
├── backend/            # Express API
│   ├── src/
│   │   ├── models/    # Mongoose 모델 (5개)
│   │   ├── routes/    # API 라우트 (5개)
│   │   ├── middleware/# JWT 인증
│   │   ├── utils/     # JWT, Password
│   │   └── server.ts
│   └── package.json
│
├── shared/             # 공유 타입
├── docs/               # 문서
│   ├── PRD_VALIDATION.md
│   └── API_DOCUMENTATION.md
└── README.md
```

---

## 🚀 시작하기

### Prerequisites
- Node.js >= 20
- MongoDB
- React Native CLI
- iOS: Xcode / Android: Android Studio

### 설치

#### 1. Backend
```bash
cd backend
npm install

# 환경 변수 설정
cp .env.example .env

# MongoDB 실행 (로컬)
mongod

# 서버 실행
npm run dev
```

Server: http://localhost:3000

#### 2. Mobile
```bash
cd mobile
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

---

## 📱 기술 스택

### Frontend
- React Native 0.74+
- TypeScript
- React Navigation
- Zustand
- Apple Health / Google Fit

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT + Bcrypt
- Zod

---

## 📚 문서

- [PRD 검증 체크리스트](docs/PRD_VALIDATION.md) - ✅ 100% 충족
- [API 문서](docs/API_DOCUMENTATION.md)
- [실행 가이드](docs/GETTING_STARTED.md)
- [Windows 설정 가이드](docs/WINDOWS_SETUP.md) - 🪟 Windows 전용

---

## 🎯 경험치 시스템

### 보상
- 감정 기록: +10 XP
- 루틴 완료: +20 XP
- 설문 완료: +30 XP
- 연속 기록: +5 XP

### 진화
- 씨앗: 0-99 XP
- 새싹: 100-299 XP
- 꽃: 300-499 XP
- 베이비: 500+ XP

---

## 📊 API 엔드포인트

### Auth
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### Emotion 🔒
- `POST /api/emotions` - 생성
- `GET /api/emotions` - 목록
- `DELETE /api/emotions/:id` - 삭제

### Routine 🔒
- `POST /api/routines` - 기록
- `GET /api/routines/stats` - 통계

### Survey 🔒
- `POST /api/surveys` - 저장
- `GET /api/surveys/latest` - 최근 결과
- `GET /api/surveys/trend` - 추이

### Selly 🔒
- `GET /api/selly` - 조회
- `POST /api/selly/experience` - 경험치 추가

자세한 내용: [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## ✅ 개발 현황

- [x] Phase 1: 프로젝트 인프라
- [x] Phase 2: Day 0 온보딩
- [x] Phase 3: Day 1-2 감정 기록
- [x] Phase 4: Day 3-4 루틴
- [x] Phase 5: Day 5 체크인
- [x] Phase 6: Day 7 완성
- [x] Phase 7: 메인 앱 4-탭
- [x] Phase 8: 백엔드 API

**MVP 완성도: 100%**

---

## 📈 향후 계획

### Phase 2: 데이터 수집 & 분석
- 실제 건강 데이터 통합
- 감정-활동 상관관계 분석

### Phase 3: DTx 전환
- 추가 임상 설문 도구
- 전문가 리뷰 시스템
- DTx 인증 준비

### Phase 4: 프리미엄 기능
- IAP 구현
- 프리미엄 루틴
- 데이터 분석 대시보드

---

## 🔒 보안

- 비밀번호 bcrypt 해싱
- JWT 인증 (7일 만료)
- MongoDB injection 방지
- 환경 변수 관리

---

## 📝 라이선스

Proprietary - All rights reserved

---

**Made with 💚 for HSP community**

Version 1.0.0 MVP | 2025-11-10
