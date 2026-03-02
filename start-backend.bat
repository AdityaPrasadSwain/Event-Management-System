@echo off
cd /d "%~dp0backend"
echo Starting SEMS Backend on port 9090...
mvn spring-boot:run
pause
