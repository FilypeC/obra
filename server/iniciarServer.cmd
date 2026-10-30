@echo off
cd /d "%~dp0.." || exit /b 1
npm.cmd run dev
