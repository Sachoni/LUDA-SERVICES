@echo off
setlocal
title GitHub Project Updater

echo.
echo ========================================
echo       GITHUB PROJECT UPDATER
echo ========================================
echo.

REM Move to the folder containing this BAT file
cd /d "%~dp0"

REM Check whether Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH.
    echo Download Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Check whether this is a Git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ERROR: This folder is not a Git repository.
    pause
    exit /b 1
)

echo [1/4] Adding changes...
git add .
if errorlevel 1 goto failed

echo.
echo [2/4] Committing changes...
git diff --cached --quiet
if not errorlevel 1 (
    echo No new changes to commit.
) else (
    git commit -m "Update project"
    if errorlevel 1 goto failed
)

echo.
echo [3/4] Pulling latest changes...
git pull --rebase origin main
if errorlevel 1 goto failed

echo.
echo [4/4] Pushing to GitHub...
git push origin main
if errorlevel 1 goto failed

echo.
echo ========================================
echo SUCCESS: GitHub update completed!
echo Check your website deployment.
echo ========================================
pause
exit /b 0

:failed
echo.
echo ERROR: An operation failed.
echo Read the messages above to identify the problem.
pause
exit /b 1