@echo off
call "%~dp0server\iniciarServer.cmd" %*
exit /b %errorlevel%