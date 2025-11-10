# Windows에서 SELLERY 앱 실행하기 🪟

Windows 노트북에서 SELLERY 앱을 완벽하게 시각화하는 방법입니다.

---

## 📋 필수 프로그램 설치 (순서대로)

### 1️⃣ Node.js 설치

**다운로드:**
- https://nodejs.org/en/download
- LTS 버전 (20.x 이상) 선택
- Windows Installer (.msi) 64-bit 다운로드

**설치 확인:**
```cmd
node --version
npm --version
```

**결과:**
```
v20.10.0
10.2.3
```

---

### 2️⃣ MongoDB 설치

**방법 1: MongoDB Community Edition (권장)**

1. **다운로드:**
   - https://www.mongodb.com/try/download/community
   - Version: 7.0
   - Platform: Windows
   - Package: msi

2. **설치:**
   - Complete Setup 선택
   - "Install MongoDB as a Service" 체크 ✅
   - "Install MongoDB Compass" 체크 ✅ (GUI 도구)

3. **설치 확인:**
```cmd
mongod --version
```

4. **MongoDB 서비스 시작:**
```cmd
# 서비스로 설치된 경우 자동 실행됨
# 수동으로 시작하려면:
net start MongoDB
```

5. **MongoDB Compass 실행:**
   - 시작 메뉴 > MongoDB Compass
   - Connection String: `mongodb://localhost:27017`
   - Connect 클릭

**방법 2: MongoDB를 수동 실행**

```cmd
# MongoDB 설치 경로로 이동
cd "C:\Program Files\MongoDB\Server\7.0\bin"

# 데이터 디렉토리 생성
mkdir C:\data\db

# MongoDB 실행
mongod --dbpath C:\data\db
```

---

### 3️⃣ Git 설치 (프로젝트 다운로드용)

**다운로드:**
- https://git-scm.com/download/win
- 64-bit Git for Windows Setup

**설치 확인:**
```cmd
git --version
```

---

### 4️⃣ Android Studio 설치

**다운로드:**
- https://developer.android.com/studio
- Download Android Studio

**설치 과정:**
1. Android Studio 실행
2. "Standard" 설치 선택
3. SDK Components 자동 설치 (시간 소요: 10-30분)

**설치 항목:**
- Android SDK
- Android SDK Platform
- Android Virtual Device (AVD)
- Android Emulator

**환경 변수 설정:**

1. 시스템 환경 변수 열기:
   - 제어판 > 시스템 > 고급 시스템 설정 > 환경 변수

2. 새 시스템 변수 추가:
   ```
   변수 이름: ANDROID_HOME
   변수 값: C:\Users\[사용자명]\AppData\Local\Android\Sdk
   ```

3. Path 변수에 추가:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

4. 확인:
```cmd
# 명령 프롬프트 재시작 후
echo %ANDROID_HOME%
adb --version
```

---

### 5️⃣ Visual Studio Code 설치 (선택사항)

**다운로드:**
- https://code.visualstudio.com/download

**추천 확장 프로그램:**
- React Native Tools
- ESLint
- Prettier

---

## 🚀 SELLERY 프로젝트 설정

### 1️⃣ 프로젝트 다운로드

```cmd
# 프로젝트 디렉토리로 이동
cd C:\Users\[사용자명]\Desktop

# Git clone (또는 파일 압축 해제)
git clone [repository-url] sellery
cd sellery
```

---

### 2️⃣ 백엔드 설정

```cmd
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
copy .env.example .env

# .env 파일 편집 (메모장으로)
notepad .env
```

**.env 파일 내용:**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sellery
JWT_SECRET=sellery-secret-key-2025
JWT_EXPIRES_IN=7d
```

**백엔드 서버 실행:**
```cmd
npm run dev
```

**확인:**
- 브라우저에서 http://localhost:3000/health 접속
- 응답: `{"status":"ok",...}`

**이 터미널은 계속 실행 상태로 유지!**

---

### 3️⃣ Android 에뮬레이터 생성

**Android Studio 실행:**

1. **AVD Manager 열기:**
   - Android Studio 실행
   - More Actions > Virtual Device Manager
   - 또는 상단 메뉴: Tools > Device Manager

2. **새 가상 디바이스 생성:**
   - "Create Device" 클릭
   - Phone > Pixel 5 선택 > Next
   - System Image: API 33 (Android 13) 다운로드 및 선택
   - AVD Name: `Pixel_5_API_33`
   - Finish

3. **에뮬레이터 실행:**
   - AVD Manager에서 ▶️ 버튼 클릭
   - 또는 명령어:
   ```cmd
   emulator -avd Pixel_5_API_33
   ```

**에뮬레이터 실행 확인:**
```cmd
# 새 명령 프롬프트 창
adb devices
```

**결과:**
```
List of devices attached
emulator-5554   device
```

---

### 4️⃣ React Native 앱 실행

**새 명령 프롬프트 창 열기:**

```cmd
# 프로젝트의 mobile 디렉토리로 이동
cd C:\Users\[사용자명]\Desktop\sellery\mobile

# 의존성 설치
npm install

# Android 앱 실행
npx react-native run-android
```

**처음 실행 시 시간이 걸립니다 (5-10분):**
- Gradle 다운로드
- 의존성 설치
- 앱 빌드

**성공 메시지:**
```
info Launching emulator...
info Successfully launched emulator.
info Installing the app...
info Installed the app on the emulator.
BUILD SUCCESSFUL
```

**에뮬레이터에서 SELLERY 앱이 자동으로 실행됩니다!** 🎉

---

## 📱 앱 확인 및 테스트

### 화면 구성

**온보딩 플로우:**
1. Welcome 화면 - "셀리와의 만남"
2. Profile Setup - 이름, 나이 입력
3. HSP 자가진단 - 5문항
4. 정원 소개
5. 셀리 스타일 선택 (초록/분홍/파랑)
6. Day 1: 감정 기록
7. Day 2: 활동 연동
8. Day 3: 루틴 체험
9. Day 5: PHQ-9/GAD-7 설문
10. Day 7: 완료 축하

**메인 앱 (4개 탭):**
- 🏡 홈
- 🧘 루틴
- 🛍️ 마켓
- 👤 프로필

---

## 🐛 Windows 전용 문제 해결

### 문제 1: "adb is not recognized" ❌

**원인:** 환경 변수 미설정

**해결:**
1. 명령 프롬프트 **재시작**
2. 환경 변수 재확인:
```cmd
echo %ANDROID_HOME%
```
3. 결과가 비어있으면 환경 변수 다시 설정

---

### 문제 2: 에뮬레이터가 너무 느림 ❌

**원인:** 하드웨어 가속 미활성화

**해결:**

1. **BIOS에서 가상화 활성화:**
   - 재부팅 > BIOS 진입 (F2/Del)
   - Intel VT-x 또는 AMD-V 활성화
   - 저장 후 재시작

2. **Hyper-V 활성화 (Windows 10/11 Pro):**
   - 제어판 > 프로그램 > Windows 기능 켜기/끄기
   - Hyper-V 체크 ✅
   - 재시작

3. **AVD 설정 변경:**
   - AVD Manager > 편집 (연필 아이콘)
   - Emulated Performance > Graphics: Hardware - GLES 2.0
   - RAM: 2048 MB 이상

---

### 문제 3: MongoDB 연결 실패 ❌

**오류:**
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**해결:**

1. **서비스 상태 확인:**
```cmd
# 관리자 권한 명령 프롬프트
sc query MongoDB
```

2. **서비스 시작:**
```cmd
net start MongoDB
```

3. **수동 실행 (서비스가 없는 경우):**
```cmd
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod --dbpath C:\data\db
```

---

### 문제 4: 포트 충돌 (3000번 포트 사용 중) ❌

**확인:**
```cmd
netstat -ano | findstr :3000
```

**해결:**
```cmd
# 프로세스 종료 (PID 확인 후)
taskkill /PID [PID번호] /F

# 또는 다른 포트 사용 (.env)
PORT=3001
```

---

### 문제 5: Metro Bundler 오류 ❌

**해결:**
```cmd
cd mobile

# 캐시 삭제
npx react-native start --reset-cache

# node_modules 재설치
rmdir /s /q node_modules
npm install

# 다시 실행
npx react-native run-android
```

---

## 💡 유용한 명령어

### Metro Bundler 수동 실행
```cmd
# 터미널 1: Metro
cd mobile
npx react-native start

# 터미널 2: 앱 실행
npx react-native run-android
```

### 앱 재시작 (에뮬레이터에서)
- `R` 키 두 번 누르기
- 또는 개발자 메뉴: `Ctrl + M` > Reload

### 개발자 메뉴 열기
- 에뮬레이터에서 `Ctrl + M`
- 또는 명령어: `adb shell input keyevent 82`

### 로그 확인
```cmd
npx react-native log-android
```

---

## 🎨 화면 캡처

### 에뮬레이터 스크린샷
```cmd
# 방법 1: 에뮬레이터 버튼 사용
# 에뮬레이터 우측 패널 > 카메라 아이콘

# 방법 2: 명령어
adb exec-out screencap -p > screenshot.png
```

---

## 📊 MongoDB 데이터 확인

### MongoDB Compass 사용 (권장)

1. MongoDB Compass 실행
2. Connection String: `mongodb://localhost:27017`
3. Connect
4. Database: `sellery` 선택
5. Collections:
   - users
   - emotions
   - routines
   - surveys
   - sellies

### 명령어로 확인
```cmd
# MongoDB Shell 실행
mongosh

# 데이터베이스 선택
use sellery

# 사용자 확인
db.users.find()

# 감정 로그 확인
db.emotions.find()
```

---

## 🔄 프로젝트 완전 초기화 (문제 발생 시)

```cmd
# 1. Backend 초기화
cd backend
rmdir /s /q node_modules
rmdir /s /q dist
npm install

# 2. Mobile 초기화
cd ..\mobile
rmdir /s /q node_modules
rmdir /s /q android\app\build
npm install

# 3. Metro 캐시 삭제
npx react-native start --reset-cache

# 4. 재시작
cd ..\backend
npm run dev

# 새 터미널
cd mobile
npx react-native run-android
```

---

## ✅ 체크리스트

실행 전 확인사항:

- [ ] Node.js 설치 완료 (`node --version`)
- [ ] MongoDB 설치 및 실행 (`mongod --version`)
- [ ] Android Studio 설치 완료
- [ ] 환경 변수 설정 (`echo %ANDROID_HOME%`)
- [ ] 에뮬레이터 실행 (`adb devices`)
- [ ] 백엔드 서버 실행 (http://localhost:3000/health)
- [ ] .env 파일 생성 및 설정

---

## 🎯 최종 실행 순서 (요약)

```cmd
# 터미널 1: MongoDB (서비스로 실행된 경우 생략)
net start MongoDB

# 터미널 2: Backend
cd backend
npm run dev

# 터미널 3: 에뮬레이터
emulator -avd Pixel_5_API_33

# 터미널 4: React Native
cd mobile
npx react-native run-android
```

**5-10분 후 에뮬레이터에서 SELLERY 앱이 실행됩니다!** 🎉

---

## 🆘 추가 도움이 필요하면?

**로그 확인:**
```cmd
# Backend 로그
cd backend
npm run dev
# 콘솔 확인

# Android 로그
npx react-native log-android
```

**구체적인 오류 메시지를 확인하고 문서의 "문제 해결" 섹션을 참조하세요!**

---

**Windows에서 SELLERY 앱 개발 시작!** 💚
