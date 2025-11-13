@echo off
chcp 65001 > nul
echo ============================================
echo   SELLERY 설치 및 실행 스크립트
echo ============================================
echo.

echo [1/4] Node.js 버전 확인 중...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js가 설치되어 있지 않습니다.
    echo 👉 https://nodejs.org 에서 다운로드하세요.
    pause
    exit /b 1
)
echo ✅ Node.js 확인 완료
echo.

echo [2/4] 의존성 설치 중... (몇 분 소요됩니다)
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ 설치 실패
    pause
    exit /b 1
)
echo ✅ 설치 완료
echo.

echo [3/4] 개발 서버 시작 중...
echo.
echo ============================================
echo   🌱 SELLERY가 실행됩니다!
echo   👉 브라우저에서 http://localhost:5173 을 여세요
echo ============================================
echo.

call npm run dev
