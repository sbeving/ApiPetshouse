@echo off
REM Quick Setup Script for Agent Petshouse Integration (Windows)

echo.
echo 🐾 Agent Petshouse - Quick Setup Script
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ❌ Error: .env file not found!
    echo Please create a .env file first:
    echo   copy .env.example .env
    echo   REM Then edit .env with your credentials
    exit /b 1
)

echo ✅ Found .env file
echo.

REM Step 1: Test Odoo Connection
echo Step 1: Testing Odoo connection...
echo -----------------------------------
node test-odoo-connection.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Odoo connection failed!
    echo.
    echo Please fix your Odoo credentials in .env:
    echo   - Use your real password OR generate an API key
    echo   - Verify ODOO_URL, ODOO_DB, and ODOO_USERNAME
    echo.
    echo See ODOO_AUTH_GUIDE.md for help
    exit /b 1
)
echo ✅ Odoo connection successful!
echo.

REM Step 2: Install dependencies
echo Step 2: Installing dependencies...
echo -----------------------------------
call npm install
echo ✅ Dependencies installed
echo.

REM Step 3: Start dev server
echo Step 3: Starting development server...
echo -----------------------------------
echo.
echo 📡 Starting Next.js dev server...
echo    Local: http://localhost:3000
echo    API Docs: http://localhost:3000/api-docs
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
