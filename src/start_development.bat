@echo off
echo 🚀 Starting SAI Sports Platform Development Environment
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo 📦 Installing web application dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🌐 Starting web development server...
echo The application will be available at: http://localhost:3000
echo.
echo Available accounts for testing:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 👩‍🏫 Coach Account:
echo    Email: coach@sai.gov.in
echo    Password: coach123
echo.
echo 🏃‍♀️ Athlete Account:
echo    Email: athlete@sai.gov.in
echo    Password: athlete123
echo.
echo 👨‍💼 Official Account:
echo    Email: official@sai.gov.in
echo    Password: official123
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🎯 Features to test:
echo • Enhanced Coach Dashboard with messaging ^& personal training
echo • Real-time athlete communication
echo • Personal training plan creation
echo • Session scheduling
echo • Video analysis tools
echo • Performance analytics
echo • Mental training modules
echo.
echo 💡 To build desktop app:
echo    cd flutter_wrapper ^&^& flutter run -d windows
echo.
echo Press Ctrl+C to stop the development server
echo.

REM Start the development server
npm start