@echo off
setlocal

cd /d "%~dp0"

echo ==============================
echo Farofa Digital - Atualizacao PC
echo ==============================

echo.
echo [1/2] Exportando a versao web do app...
call npm install
if errorlevel 1 (
  echo ERRO: falha ao instalar dependencias.
  pause
  exit /b 1
)

call npm run export:web
if errorlevel 1 (
  echo ERRO: falha ao exportar a versao web.
  pause
  exit /b 1
)

echo.
echo [2/2] Gerando instalador Windows do desktop...
call npm --prefix desktop run build
if errorlevel 1 (
  echo ERRO: falha na geracao do instalador desktop.
  pause
  exit /b 1
)

echo.
echo Atualizacao concluida com sucesso.
echo Instalador gerado em: %~dp0desktop\dist
pause
exit /b 0
