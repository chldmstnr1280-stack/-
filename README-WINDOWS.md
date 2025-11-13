# 🌱 SELLERY - 윈도우 실행 가이드

## 🚀 빠른 시작 (3단계)

### 1단계: 저장소 다운로드

```bash
git clone https://github.com/chldmstnr1280-stack/-
cd -
git checkout claude/prd-setup-planning-011CV1miePygZHQ3UcQbCHVL
```

### 2단계: 자동 설치 및 실행

**방법 A: 배치 파일 실행 (추천)**

1. 프로젝트 폴더에서 `setup-windows.bat` 더블클릭
2. 설치 완료 후 브라우저에서 http://localhost:5173 열기

**방법 B: 수동 설치**

```bash
npm install --legacy-peer-deps
npm run dev
```

### 3단계: 브라우저에서 확인

```
http://localhost:5173
```

---

## 📁 유용한 스크립트

### 🔧 `setup-windows.bat`
- 최초 1회 실행
- 의존성 자동 설치 + 서버 실행

### ▶️ `start.bat`
- 이미 설치했다면 이걸 사용
- 바로 개발 서버 시작

### 🛠️ 수동 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 🎯 페이지 구조

| URL | 설명 |
|-----|------|
| `/` | 환영 페이지 (온보딩 시작) |
| `/onboarding/name` | 이름 입력 |
| `/onboarding/style` | 셀리 스타일 선택 |
| `/onboarding/complete` | 온보딩 완료 |
| `/home` | 메인 홈 (정원) |
| `/emotion/log` | 감정 기록 |
| `/routines` | 루틴 목록 |
| `/routines/:id` | 루틴 실행 |
| `/checkin` | 주간 체크인 (PHQ-9/GAD-7) |
| `/profile` | 프로필 & 뱃지 |
| `/report` | 주간 리포트 & 차트 |
| `/evolution/complete` | 최종 진화 축하 |

---

## 🐛 문제 해결

### Node.js가 없다면?

https://nodejs.org 에서 **LTS 버전** 다운로드

### Git이 없다면?

https://git-scm.com/download/win 에서 다운로드

### 포트 충돌 시

`vite.config.ts` 파일에서 포트 변경:

```typescript
server: {
  port: 3000, // 원하는 포트로 변경
  host: '0.0.0.0',
}
```

### 빌드 에러 시

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📦 기술 스택

- **프레임워크**: React 19 + TypeScript
- **빌드 도구**: Vite 6
- **상태 관리**: Zustand
- **라우팅**: React Router 6
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **차트**: Recharts
- **날짜**: date-fns
- **아이콘**: Lucide React

---

## 🎨 주요 기능

### ✅ 완료된 기능

- 7일 온보딩 플로우
- 감정 기록 (텍스트, 이모지, 색상, 강도)
- 셀리 캐릭터 성장 시스템 (씨앗 → 새싹 → 꽃 → 캐릭터)
- 루틴 시스템 (명상, 호흡법, 활동)
- PHQ-9/GAD-7 주간 체크인
- 게임화 (포인트, 레벨, 경험치, 연속 기록)
- 뱃지 시스템 (16가지 뱃지)
- 주간 감정 리포트 & 차트
- 프로필 페이지

### ❌ 구현하지 않은 기능 (PRD Nope 섹션)

- 실시간 화상 상담
- 약물 처방
- 소셜 네트워크
- 음성 감정 기록
- AI 상담사 (GPT)
- 웨어러블 연동
- 아이템 구매

---

## 📝 브랜치 정보

**작업 브랜치**: `claude/prd-setup-planning-011CV1miePygZHQ3UcQbCHVL`

```bash
# 최신 코드 받기
git pull origin claude/prd-setup-planning-011CV1miePygZHQ3UcQbCHVL
```

---

## 🙋‍♀️ 도움이 필요하신가요?

이슈를 등록해주세요: https://github.com/chldmstnr1280-stack/-/issues

---

**즐거운 감정 관리 되세요! 🌱💚**
