@echo off
chcp 65001 > nul
echo ============================================
echo   🌱 SELLERY 개발 서버 시작
echo ============================================
echo.
echo 브라우저에서 http://localhost:5173 을 여세요
echo.
echo 서버를 종료하려면 Ctrl+C를 누르세요
echo.

call npm run dev
