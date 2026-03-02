@echo off
cd /d "%~dp0frontend"
echo Starting SEMS Frontend on port 5181...
npm run dev
pause
