# SELLERY Web (PWA) 설정 가이드

## 🌐 개요

SELLERY는 이제 **PWA (Progressive Web App)**로도 사용할 수 있습니다!
Windows, Mac, Linux 어떤 환경에서도 **브라우저만 있으면** 바로 실행 가능합니다.

**장점:**
- ✅ Android Studio, Xcode 설치 불필요
- ✅ 에뮬레이터 설정 불필요
- ✅ 모든 OS에서 동일한 경험
- ✅ 모바일처럼 설치 가능 (홈 화면에 추가)
- ✅ 오프라인 지원
- ✅ 백엔드 API 그대로 사용

---

## 📋 사전 준비

### 필수 프로그램
1. **Node.js** 20.x 이상 (LTS 권장)
   - 다운로드: https://nodejs.org/
2. **MongoDB** (백엔드 사용 시)
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt install mongodb` 또는 `sudo yum install mongodb`

---

## 🚀 빠른 시작

### 1단계: 프로젝트 클론
```bash
git clone <repository-url>
cd sellery
```

### 2단계: 웹 앱 의존성 설치
```bash
cd web
npm install
```

### 3단계: 환경 변수 설정 (선택 사항)
`web/.env` 파일이 자동으로 생성됩니다. 백엔드 주소를 변경하려면:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4단계: 개발 서버 실행
```bash
npm run dev
```

자동으로 브라우저가 열리며 http://localhost:3000 에서 앱이 실행됩니다!

---

## 🔧 백엔드와 함께 실행하기

SELLERY PWA는 백엔드 API와 통신하여 데이터를 저장할 수 있습니다.

### 터미널 1: MongoDB 시작
**Windows:**
```cmd
net start MongoDB
```

**Mac/Linux:**
```bash
brew services start mongodb-community
# 또는
sudo systemctl start mongod
```

### 터미널 2: 백엔드 서버 실행
```bash
cd backend
npm install
npm run dev
```

백엔드 서버가 http://localhost:5000 에서 실행됩니다.

### 터미널 3: 웹 앱 실행
```bash
cd web
npm run dev
```

이제 http://localhost:3000 에서 완전한 SELLERY 앱을 사용할 수 있습니다!

---

## 📱 PWA로 설치하기

브라우저에서 앱을 실행한 후:

### Chrome/Edge (Windows/Mac/Linux)
1. 주소창 오른쪽의 **"설치"** 아이콘 클릭
2. 또는 우측 상단 메뉴 > **"SELLERY 설치..."** 클릭
3. 확인하면 데스크톱 앱처럼 독립 실행됩니다!

### Safari (Mac)
1. 공유 버튼 > **"홈 화면에 추가"** 클릭

### Android Chrome
1. 메뉴 > **"홈 화면에 추가"** 클릭

### iPhone Safari
1. 공유 버튼 > **"홈 화면에 추가"** 클릭

---

## 🏗️ 프로덕션 빌드

### 빌드 생성
```bash
cd web
npm run build
```

빌드 결과물은 `web/dist/` 폴더에 생성됩니다.

### 빌드 미리보기
```bash
npm run preview
```

프로덕션 빌드가 http://localhost:4173 에서 실행됩니다.

### 배포
생성된 `dist/` 폴더를 다음 플랫폼에 배포할 수 있습니다:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: `npm run deploy`
- **자체 서버**: Nginx, Apache 등으로 정적 파일 서빙

---

## 🎯 주요 기능 테스트

### 1. 온보딩 플로우 (Day 0 - Day 7)
1. 앱 시작 시 Welcome 화면
2. HSP 자가 진단 (10개 질문)
3. 셀리 스타일 선택
4. Day 1: 감정 기록
5. Day 2-5: 루틴 실천
6. Day 7: 완주 축하

### 2. 메인 앱 (4-Tab)
- **홈**: 셀리 정원, 최근 감정 기록, 통계
- **루틴**: 명상, 호흡, 활동 루틴 (구현 예정)
- **마켓**: 프리미엄 콘텐츠 (구현 예정)
- **프로필**: 내 정보, 통계 (구현 예정)

### 3. 데이터 저장
- LocalStorage를 사용한 클라이언트 저장
- Zustand persist로 새로고침 후에도 데이터 유지
- 백엔드 API 연동 시 클라우드 저장

---

## 🐛 문제 해결

### 서버가 시작되지 않아요
**증상:** `npm run dev` 실행 시 오류

**해결:**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 포트 3000이 이미 사용 중이에요
**증상:** `Port 3000 is already in use`

**해결:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID번호> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### 백엔드 연결이 안 돼요
**증상:** 로그인/회원가입 시 네트워크 오류

**해결:**
1. 백엔드가 실행 중인지 확인: http://localhost:5000/health
2. MongoDB가 실행 중인지 확인
3. `.env` 파일의 `VITE_API_URL` 확인
4. 브라우저 개발자 도구 > Network 탭에서 API 요청 확인

### PWA가 설치되지 않아요
**증상:** 설치 버튼이 나타나지 않음

**해결:**
- HTTPS 또는 localhost에서만 PWA 설치 가능
- 개발 중에는 localhost에서 테스트
- 배포 시에는 HTTPS 사용 필수

### 새로고침 시 데이터가 사라져요
**증상:** 온보딩 완료 후 새로고침하면 처음으로 돌아감

**원인:** LocalStorage 데이터가 저장되지 않음

**해결:**
- 시크릿 모드가 아닌지 확인
- 브라우저 쿠키/데이터 설정 확인
- 개발자 도구 > Application > Local Storage에서 `sellery-*` 항목 확인

---

## 📂 프로젝트 구조

```
web/
├── public/              # 정적 파일 (아이콘, manifest)
├── src/
│   ├── api/            # API 클라이언트 (axios)
│   │   ├── client.ts   # 기본 설정, 인터셉터
│   │   ├── auth.ts     # 인증 API
│   │   └── index.ts    # API exports
│   ├── components/     # 재사용 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Layout.tsx
│   │   ├── MainLayout.tsx
│   │   └── SellyAvatar.tsx
│   ├── pages/          # 페이지 컴포넌트
│   │   ├── onboarding/
│   │   │   ├── Day0Welcome.tsx
│   │   │   ├── Day1Emotion.tsx
│   │   │   └── Day7Complete.tsx
│   │   └── main/
│   │       └── Home.tsx
│   ├── stores/         # Zustand 상태 관리
│   │   ├── authStore.ts
│   │   ├── emotionStore.ts
│   │   ├── onboardingStore.ts
│   │   ├── routineStore.ts
│   │   ├── sellyStore.ts
│   │   └── surveyStore.ts
│   ├── types/          # TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.tsx         # 메인 앱 + 라우팅
│   ├── main.tsx        # 진입점
│   └── index.css       # 글로벌 스타일
├── .env                # 환경 변수
├── vite.config.ts      # Vite + PWA 설정
└── package.json        # 의존성
```

---

## 🔄 전체 실행 시나리오

### 시나리오 1: 웹만 실행 (백엔드 없이)
```bash
cd web
npm install
npm run dev
```
→ 브라우저에서 http://localhost:3000 열기
→ 모든 데이터는 LocalStorage에 저장 (새로고침 후에도 유지)

### 시나리오 2: 백엔드 + 웹 실행 (완전한 앱)
```bash
# 터미널 1: MongoDB
mongod  # 또는 net start MongoDB (Windows)

# 터미널 2: Backend
cd backend
npm install
npm run dev

# 터미널 3: Web
cd web
npm install
npm run dev
```
→ 브라우저에서 http://localhost:3000 열기
→ 회원가입/로그인 후 클라우드에 데이터 저장

### 시나리오 3: 프로덕션 배포
```bash
# 1. 빌드
cd web
npm run build

# 2. Vercel 배포
vercel deploy

# 3. 또는 Netlify 배포
netlify deploy --prod

# 4. 또는 직접 서버에 업로드
scp -r dist/* user@server:/var/www/sellery/
```

---

## 🎨 커스터마이징

### 테마 색상 변경
`src/index.css` 파일에서 색상 변경:
```css
:root {
  --primary: #2D5F4C;     /* 메인 색상 */
  --background: #F5F9F7;  /* 배경색 */
}
```

### API 엔드포인트 변경
`web/.env` 파일 수정:
```env
VITE_API_URL=https://your-backend.com/api
```

### PWA 이름/아이콘 변경
`vite.config.ts` 파일의 `manifest` 섹션 수정:
```typescript
manifest: {
  name: '내 앱 이름',
  short_name: '짧은 이름',
  theme_color: '#색상코드',
}
```

---

## 📊 성능 최적화

### 빌드 크기 확인
```bash
npm run build
# dist/assets/index-*.js 파일 크기 확인
```

### 번들 분석
```bash
npm install --save-dev rollup-plugin-visualizer
npm run build
# stats.html 파일 열어서 번들 구성 확인
```

### 캐싱 전략
PWA는 Workbox를 사용하여 자동으로 리소스를 캐싱합니다:
- 정적 파일: 빌드 시 사전 캐싱
- API 응답: NetworkFirst 전략 (24시간 캐시)

---

## 🔐 보안

### 프로덕션 체크리스트
- [ ] HTTPS 사용 (HTTP는 PWA 설치 불가)
- [ ] 환경 변수에 민감한 정보 저장 금지
- [ ] API 키는 백엔드에서만 사용
- [ ] CORS 설정 확인
- [ ] JWT 토큰 만료 시간 설정
- [ ] XSS 방어 (React는 기본적으로 방어)
- [ ] CSRF 토큰 사용 (필요시)

---

## 📚 추가 문서

- [전체 프로젝트 README](../README.md)
- [PRD 검증 문서](./PRD_VALIDATION.md)
- [API 문서](./API_DOCUMENTATION.md)
- [Windows 설정 가이드](./WINDOWS_SETUP.md) - Android 앱 실행
- [일반 실행 가이드](./GETTING_STARTED.md) - React Native 앱 실행

---

## ✅ 완료!

이제 어떤 환경에서든 SELLERY를 브라우저에서 사용할 수 있습니다.

**다음 단계:**
1. 온보딩 플로우 완료하기
2. 감정 기록 실험해보기
3. 셀리 성장 확인하기
4. PWA로 설치해서 앱처럼 사용하기

**질문이나 문제가 있다면:**
- GitHub Issues에 등록
- 또는 문서의 "문제 해결" 섹션 참고

Happy Coding! 💚🌱
