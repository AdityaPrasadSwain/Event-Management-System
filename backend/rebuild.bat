@echo off
echo Cleaning and rebuilding SEMS Backend...
cd /d %~dp0
rd /s /q target
call mvn clean compile -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    pause
    exit /b %ERRORLEVEL%
)
echo Build successful!
pause
