@echo off
setlocal EnableExtensions

set "PROJECT_DIR=%~dp0"
if not exist "%PROJECT_DIR%package.json" goto project_missing
if not exist "%PROJECT_DIR%desktop\package.json" goto desktop_project_missing

cd /d "%PROJECT_DIR%"
if errorlevel 1 goto project_access_failed

where node >nul 2>&1
if errorlevel 1 goto node_missing
where npm >nul 2>&1
if errorlevel 1 goto npm_missing

if not exist "node_modules\expo\bin\cli" (
  echo Instalando dependencias do aplicativo...
  call npm ci
  if errorlevel 1 goto app_dependencies_failed
)

if not exist "desktop\node_modules\electron\cli.js" (
  echo Instalando dependencias da versao para PC...
  call npm --prefix "%PROJECT_DIR%desktop" ci
  if errorlevel 1 goto desktop_dependencies_failed
)

echo Preparando os arquivos do jogo...
call node "desktop\prepare-web.js"
if errorlevel 1 goto prepare_failed

echo Iniciando o Farofa Digital...
call npm --prefix "%PROJECT_DIR%desktop" start
if errorlevel 1 goto start_failed
exit /b 0

:project_missing
echo ERRO: package.json nao encontrado. Execute este arquivo dentro da pasta do projeto.
goto failed

:desktop_project_missing
echo ERRO: a pasta desktop do projeto nao foi encontrada.
goto failed

:project_access_failed
echo ERRO: nao foi possivel acessar a pasta do projeto.
goto failed

:node_missing
echo ERRO: Node.js nao encontrado. Para usar o codigo-fonte, instale o Node.js LTS.
goto failed

:npm_missing
echo ERRO: npm nao encontrado. Reinstale o Node.js LTS e tente novamente.
goto failed

:app_dependencies_failed
echo ERRO: nao foi possivel instalar as dependencias do aplicativo.
goto failed

:desktop_dependencies_failed
echo ERRO: nao foi possivel instalar as dependencias da versao para PC.
goto failed

:prepare_failed
echo ERRO: nao foi possivel preparar os arquivos para iniciar o jogo.
goto failed

:start_failed
echo ERRO: nao foi possivel iniciar o Farofa Digital.
goto failed

:failed
echo.
pause
exit /b 1
