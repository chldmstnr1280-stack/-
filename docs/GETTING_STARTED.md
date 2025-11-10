# SELLERY 앱 실행 가이드

## 🚀 빠른 시작 (3단계)

### 1️⃣ MongoDB 실행

**macOS:**
```bash
brew services start mongodb-community
# 또는
mongod --config /usr/local/etc/mongod.conf
```

**Windows:**
```bash
# MongoDB Compass 설치 (GUI)
# 또는 명령어로 실행
mongod
```

**Linux:**
```bash
sudo systemctl start mongodb
```

---

### 2️⃣ 백엔드 서버 실행

```bash
cd backend
npm install
npm run dev
```

**확인:**
- 브라우저에서 http://localhost:3000/health 접속
- 응답: `{"status":"ok","timestamp":"...","service":"sellery-backend"}`

**환경 변수 설정 (.env):**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sellery
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

### 3️⃣ 모바일 앱 실행

#### iOS (macOS 전용)

```bash
cd mobile
npm install

# CocoaPods 설치
cd ios
pod install
cd ..

# 앱 실행
npx react-native run-ios
```

**시뮬레이터 선택:**
```bash
# 특정 디바이스 선택
npx react-native run-ios --simulator="iPhone 15 Pro"

# 사용 가능한 시뮬레이터 목록
xcrun simctl list devices
```

---

#### Android

**사전 준비:**
1. Android Studio 설치
2. Android SDK 설치
3. AVD (Android Virtual Device) 생성

```bash
cd mobile
npm install

# 앱 실행
npx react-native run-android
```

**에뮬레이터 실행:**
```bash
# Android Studio > AVD Manager에서 에뮬레이터 시작
# 또는 명령어로:
emulator -avd Pixel_5_API_33
```

---

## 🎯 화면별 테스트 시나리오

### Day 0: 온보딩 시작
1. ✅ Welcome 화면 확인
2. ✅ 이름, 나이 입력
3. ✅ HSP 자가진단 5문항
4. ✅ 정원 소개
5. ✅ 셀리 스타일 선택 (green/pink/blue)

### Day 1: 첫 감정 기록
1. ✅ 감정 텍스트 입력 (100자)
2. ✅ 이모지 선택
3. ✅ 색상 선택 (7가지)
4. ✅ 온도 게이지 (0-100)
5. ✅ 셀리 경험치 +10

### Day 2: 활동 연동
1. ✅ Apple Health / Google Fit 연동 화면
2. ✅ Mock 데이터 표시

### Day 3-4: 루틴
1. ✅ 명상 루틴 선택
2. ✅ 호흡법 타이머 (애니메이션)
3. ✅ 루틴 완료 후 +20 XP

### Day 5: PHQ-9/GAD-7
1. ✅ PHQ-9 9문항 응답
2. ✅ GAD-7 7문항 응답
3. ✅ 점수 및 심각도 확인
4. ✅ +30 XP 획득

### Day 7: 완료
1. ✅ 성취 통계 확인
2. ✅ 셀리 최종 형태
3. ✅ 메인 앱으로 전환

### 메인 앱 (4-Tab)
1. ✅ 홈: 정원 + 최근 감정 로그
2. ✅ 루틴: 카테고리별 루틴 목록
3. ✅ 마켓: 프리미엄 쇼케이스
4. ✅ 프로필: 통계 + 설정

---

## 🐛 문제 해결

### 포트 충돌
```bash
# 3000번 포트가 사용 중인 경우
lsof -ti:3000 | xargs kill -9

# 또는 .env에서 포트 변경
PORT=3001
```

### Metro Bundler 오류
```bash
# 캐시 삭제
npx react-native start --reset-cache

# node_modules 재설치
rm -rf node_modules
npm install
```

### iOS 빌드 오류
```bash
# CocoaPods 재설치
cd ios
pod deintegrate
pod install
cd ..
```

### Android 빌드 오류
```bash
# Gradle 캐시 삭제
cd android
./gradlew clean
cd ..
```

---

## 📱 실제 기기에서 테스트

### iOS (Apple Developer 계정 필요)
```bash
# Xcode에서:
# 1. Signing & Capabilities > Team 선택
# 2. 실제 iPhone 연결
# 3. Product > Destination > [Your iPhone]
# 4. Run
```

### Android
```bash
# 1. 개발자 옵션 활성화
# 2. USB 디버깅 활성화
# 3. USB 연결
# 4. npx react-native run-android
```

---

## 🎨 API 테스트 (Postman)

### 1. 회원가입
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "test@sellery.com",
  "password": "test123",
  "name": "테스트",
  "age": 25,
  "isHSP": true,
  "hspAnswers": [3, 4, 3, 4, 3]
}
```

### 2. 로그인
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@sellery.com",
  "password": "test123"
}
```

### 3. 감정 로그 생성
```http
POST http://localhost:3000/api/emotions
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "text": "오늘 기분이 좋아요",
  "emoji": "😊",
  "color": "#FFD700",
  "temperature": 75
}
```

---

## 📊 데이터베이스 확인

### MongoDB Compass (GUI)
```
Connection String: mongodb://localhost:27017
Database: sellery
Collections:
  - users
  - emotions
  - routines
  - surveys
  - sellies
```

### CLI
```bash
mongosh
use sellery
db.users.find()
db.emotions.find()
db.surveys.find()
```

---

## 🎬 스크린샷 촬영

### iOS
```bash
# 시뮬레이터에서 Cmd+S
# 또는
xcrun simctl io booted screenshot screenshot.png
```

### Android
```bash
# 에뮬레이터에서 Ctrl+S (Windows) / Cmd+S (Mac)
# 또는
adb shell screencap /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

---

## 💡 개발 팁

### Hot Reload
- iOS/Android: Cmd+R (Mac) / Ctrl+R (Windows) 또는 두 번 흔들기
- Developer Menu: Cmd+D (Mac) / Ctrl+M (Windows)

### Debug Menu
- Enable Fast Refresh
- Enable Remote JS Debugging (Chrome DevTools)
- Show Performance Monitor

### React Native Debugger
```bash
# 설치
brew install --cask react-native-debugger

# 실행
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

---

## 🚀 프로덕션 빌드

### iOS
```bash
# Xcode에서:
# Product > Archive
# Organizer > Distribute App > App Store Connect
```

### Android
```bash
cd android
./gradlew bundleRelease

# APK 위치:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📞 지원

문제가 발생하면:
1. 로그 확인: `npx react-native log-ios` 또는 `npx react-native log-android`
2. 이슈 리포트
3. 문서 참조: [docs/](../docs/)

---

**Happy Coding! 💚**
