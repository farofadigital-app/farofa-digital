@echo off
setlocal EnableExtensions

set "PROJECT_DIR=%~dp0"
if exist "%PROJECT_DIR%package.json" if exist "%PROJECT_DIR%desktop\package.json" goto project_found

if exist "%PROJECT_DIR%farofa-digital\package.json" if exist "%PROJECT_DIR%farofa-digital\desktop\package.json" (
  set "PROJECT_DIR=%PROJECT_DIR%farofa-digital\"
  goto project_found
)

echo ERRO: nao encontrei a raiz do projeto.
echo Coloque este arquivo na pasta que contem package.json e desktop\package.json,
echo ou na pasta pai imediata do projeto Farofa Digital.
pause
exit /b 1

:project_found
cd /d "%PROJECT_DIR%"
if errorlevel 1 (
  echo ERRO: nao foi possivel acessar a pasta do projeto: "%PROJECT_DIR%"
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo ERRO: Node.js nao encontrado. Instale a versao LTS e tente novamente.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo ERRO: npm nao encontrado. Reinstale o Node.js LTS e tente novamente.
  pause
  exit /b 1
)

echo ==============================
echo Farofa Digital - Atualizacao PC
echo ==============================
echo Projeto: %PROJECT_DIR%
echo.

if not exist "node_modules\expo\bin\cli" (
  echo Instalando dependencias do aplicativo...
  call npm ci
  if errorlevel 1 goto install_app_failed
)

if not exist "desktop\node_modules\electron-builder\cli.js" (
  echo Instalando dependencias do desktop...
  call npm --prefix "%PROJECT_DIR%desktop" ci
  if errorlevel 1 goto install_desktop_failed
)

echo.
echo Exportando o app e gerando o instalador Windows...
call npm --prefix "%PROJECT_DIR%desktop" run build
if errorlevel 1 goto build_failed

if not exist "%PROJECT_DIR%desktop\dist\*.exe" goto installer_missing

echo.
echo Atualizacao concluida com sucesso.
echo Instalador gerado em: "%PROJECT_DIR%desktop\dist"
pause
exit /b 0

:install_app_failed
echo ERRO: falha ao instalar as dependencias do aplicativo.
pause
exit /b 1

:install_desktop_failed
echo ERRO: falha ao instalar as dependencias do desktop.
pause
exit /b 1

:build_failed
echo ERRO: o build do desktop falhou. Consulte as mensagens acima.
pause
exit /b 1

:installer_missing
echo ERRO: o build terminou sem gerar um instalador .exe em desktop\dist.
pause
exit /b 1
