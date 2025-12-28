@echo off
REM Simple Chatbot - One-Tap Installation Script for Windows
REM This script installs dependencies and optionally starts the development server

setlocal enabledelayedexpansion

echo.
echo ========================================
echo    Simple Chatbot - One-Tap Install
echo ========================================
echo.

REM Check if Node.js is installed
echo [i] Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [X] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Recommended version: 18.x or higher
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check if npm is installed
echo [i] Checking for npm...
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [X] npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm found: v%NPM_VERSION%

echo.

REM Check if node_modules exists
if exist "node_modules" (
    echo [!] node_modules directory already exists
    set /p REINSTALL="Do you want to reinstall dependencies? (y/N): "
    if /i "!REINSTALL!"=="y" (
        echo [i] Removing old node_modules...
        rmdir /s /q node_modules
        if exist "package-lock.json" del package-lock.json
        echo [OK] Cleanup complete
    ) else (
        echo [i] Skipping dependency installation
        set SKIP_INSTALL=true
    )
)

REM Install dependencies
if not "!SKIP_INSTALL!"=="true" (
    echo.
    echo [i] Installing dependencies...
    echo.

    call npm install

    if %ERRORLEVEL% neq 0 (
        echo.
        echo [X] Installation failed!
        pause
        exit /b 1
    )

    echo.
    echo [OK] Dependencies installed successfully!
)

echo.
echo [OK] Installation complete! 🎉
echo.

REM Ask if user wants to start dev server
set /p START_SERVER="Do you want to start the development server now? (Y/n): "
if /i "!START_SERVER!"=="n" goto :skip_server

echo.
echo [i] Starting development server...
echo.
echo [i] The app will open at http://localhost:3000
echo.
echo [!] Press Ctrl+C to stop the server
echo.

call npm run dev
goto :end

:skip_server
echo.
echo [i] You can start the development server later with:
echo   npm run dev
echo.
echo [i] Other available commands:
echo   npm run build   - Build for production
echo   npm run preview - Preview production build
echo.
pause

:end
endlocal
