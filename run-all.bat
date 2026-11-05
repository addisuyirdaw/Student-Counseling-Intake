@echo off
echo ===================================================
echo  Starting Student Counseling Intake System
echo ===================================================
echo.
cd /d "%~dp0backend"
start "Backend API (Port 3001)" cmd /k "npm run dev"
cd /d "%~dp0frontend"
start "Frontend UI (Port 5173)" cmd /k "npm run dev"
echo Backend and Frontend launched in separate windows!
echo Opening browser: http://localhost:5173/staff
start http://localhost:5173/staff

