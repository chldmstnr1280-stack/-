<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌱 SELLERY - Self Love Reset

HSP(민감한 사람)를 위한 감정 관리 디지털 치료제

**셀리와 함께 감정의 정원에서 성장하세요** 💚

---

## 🚀 빠른 시작

### Windows 사용자

```bash
# 1. 저장소 클론
git clone https://github.com/chldmstnr1280-stack/-
cd -
git checkout claude/prd-setup-planning-011CV1miePygZHQ3UcQbCHVL

# 2. 자동 설치 및 실행
setup-windows.bat
```

또는 수동 설치:

```bash
npm install --legacy-peer-deps
npm run dev
```

### Mac/Linux 사용자

```bash
# 1. 저장소 클론
git clone https://github.com/chldmstnr1280-stack/-
cd -
git checkout claude/prd-setup-planning-011CV1miePygZHQ3UcQbCHVL

# 2. 설치 및 실행
npm install --legacy-peer-deps
npm run dev
```

**브라우저에서 열기**: http://localhost:5173

---

## ✨ 주요 기능

### 7일 온보딩 미션
- Day 0: 회원가입 & 셀리 스타일 선택
- Day 1-2: 감정 기록 시작
- Day 3-4: 루틴 체험
- Day 5: 주간 체크인 (PHQ-9/GAD-7)
- Day 7: 셀리 최종 진화 🧚‍♀️

### 감정 기록 & 게임화
- 텍스트, 이모지, 색상, 강도로 감정 표현
- 포인트 & 경험치 획득
- 16가지 뱃지 시스템
- 연속 기록 Streak

### 셀리 캐릭터
- 4단계 성장: 🌱 씨앗 → 🌿 새싹 → 🌸 꽃 → 🧚‍♀️ 꼬마 셀리
- 3가지 색상: 초록, 분홍, 황금

### 루틴
- 🧘 명상 (3분, 5분)
- 🌬️ 호흡법 (복식호흡, 4-7-8)
- 🚶‍♀️ 활동 (정원 산책, 셀리와 대화)

### 주간 리포트
- 감정 온도 차트
- 트렌드 분석
- 자주 사용한 이모지 Top 5

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── common/          # Button, Input, Card, Layout
│   ├── selly/           # 셀리 캐릭터 컴포넌트
│   └── routines/        # 루틴 관련 컴포넌트
├── pages/
│   ├── Onboarding/      # 온보딩 플로우
│   ├── Home/            # 메인 홈
│   ├── EmotionLog/      # 감정 기록
│   ├── Routines/        # 루틴
│   ├── CheckIn/         # 주간 체크인
│   ├── Profile/         # 프로필 & 뱃지
│   └── Report/          # 주간 리포트
├── store/               # Zustand 상태 관리
├── types/               # TypeScript 타입
└── utils/               # 유틸리티 함수
```

---

## 🛠️ 기술 스택

- React 19 + TypeScript
- Vite 6
- Zustand (상태 관리)
- React Router 6
- Tailwind CSS
- Framer Motion
- Recharts
- date-fns
- Lucide React

---

## 📖 상세 가이드

- **Windows 사용자**: [README-WINDOWS.md](README-WINDOWS.md) 참고
- **API 문서**: Coming soon
- **배포 가이드**: Coming soon

---

## 🤝 기여하기

이슈 및 PR 환영합니다!

---

**Made with 💚 for HSP**
