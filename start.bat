@echo off
echo ================================================
echo    PULSEVO - Team Productivity Dashboard
echo ================================================
echo.
echo Starting backend server on http://localhost:5000...
echo Starting frontend on http://localhost:3000...
echo.
echo IMPORTANT: Configure your Gemini API key in backend\.env
echo.
echo ================================================
echo.

start cmd /k "npm start"
timeout /t 3 /nobreak >nul
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
echo Upload the sample-data.csv file to test the dashboard!
echo.
pause
