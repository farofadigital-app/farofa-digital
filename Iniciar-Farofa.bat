@echo off
chcp 65001 >nul
title Farofa Digital v3.0
color 0E

echo ==============================================
echo   🔥 FAROFA DIGITAL v3.0 🔥
echo ==============================================
echo.

cd /d "%~dp0farofa-digital"

if not exist "package.json" (
    echo [ERRO] Pasta "farofa-digital" nao encontrada!
    echo Coloque este arquivo na MESMA pasta do projeto.
    echo.
    pause
    exit /b 1
)

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js NAO esta instalado!
    echo Baixe em: nodejs.org (versao LTS)
    echo.
    pause
    exit /b 1
)
node --version
echo.

echo [2/3] Instalando dependencias (1a vez)...
if not exist "node_modules" (
    call npm install
) else (
    echo Dependencias ja estao instaladas.
)
echo.

echo [3/3] Iniciando o App...
echo.
echo ==============================================
echo   Escaneie o QR Code com o app "Expo Go"
echo ==============================================
echo.

call npx expo start

pause
