@echo off
title Stradario - Casellario
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js non risulta installato su questo computer.
  echo   Scaricalo da https://nodejs.org ^(versione LTS^), installalo
  echo   e poi riapri questo file.
  echo.
  pause
  exit /b 1
)
node server.js
pause
