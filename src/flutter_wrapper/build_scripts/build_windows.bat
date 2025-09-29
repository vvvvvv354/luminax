@echo off
echo Building SAI Sports Platform for Windows...

REM Check if Flutter is installed
flutter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Flutter is not installed or not in PATH
    pause
    exit /b 1
)

REM Get dependencies
echo Getting Flutter dependencies...
flutter pub get

REM Build for Windows
echo Building for Windows...
flutter build windows --release

if %errorlevel% eq 0 (
    echo.
    echo ✅ Windows build completed successfully!
    echo.
    echo 📁 Built application is in: build\windows\runner\Release\
    echo.
    echo Next steps:
    echo 1. Test the application
    echo 2. Create an installer using NSIS or similar
    echo 3. Code sign the executable if needed
    echo.
) else (
    echo.
    echo ❌ Build failed!
    echo Please check the error messages above.
)

pause