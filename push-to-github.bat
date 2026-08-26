@echo off
title TaskFlow - GitHub Uploader
cls
echo ============================================================
echo         TaskFlow Dashboard - Push to GitHub
echo ============================================================
echo.
echo Your code and commit history are already ready on your PC!
echo.
set /p REPO_URL="Paste your GitHub Repository URL (e.g., https://github.com/YOUR_USERNAME/taskflow-dashboard.git): "

if "%REPO_URL%"=="" (
    echo.
    echo [ERROR] No URL entered. Exiting...
    pause
    exit /b
)

echo.
echo [1/2] Connecting local repository to GitHub...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [2/2] Uploading files to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo [SUCCESS] Your TaskFlow Dashboard is now live on GitHub!
    echo ============================================================
) else (
    echo.
    echo [NOTE] If prompted for credentials, log in with your GitHub account.
)
echo.
pause
