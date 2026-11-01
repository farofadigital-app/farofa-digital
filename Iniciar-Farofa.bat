@echo off
setlocal
cd /d "%~dp0"

title Farofa Digital
echo ==============================================
echo   Farofa Digital
echo ==============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERRO: instale o Node.js LTS antes de iniciar o projeto.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando as dependencias do projeto...
  call npm ci
  if errorlevel 1 (
    echo ERRO: nao foi possivel instalar as dependencias.
    pause
    exit /b 1
  )
)

echo Iniciando o Expo...
call npm run start
if errorlevel 1 (
  echo ERRO: o Expo nao conseguiu iniciar.
  pause
  exit /b 1
)

exit /b 0
