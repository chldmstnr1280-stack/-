@echo off
echo ========================================
echo   SELLERY PWA 시작 중...
echo ========================================
echo.

REM 의존성 확인
if not exist "node_modules\" (
    echo 처음 실행이므로 설치 중입니다... (1-2분 소요)
    call npm install
    echo.
)

echo 서버를 시작합니다...
echo 브라우저에서 자동으로 열립니다!
echo.
echo 종료하려면 Ctrl+C를 누르세요.
echo ========================================
echo.

npm run dev
