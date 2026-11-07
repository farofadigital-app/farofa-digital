@echo off
chcp 65001 >nul
title Farofa Security v1.0 - Protecao & Limpeza
color 0B

:: ==============================================
::  FAROFA SECURITY - ANTI-MALWARE + LIMPEZA
:: ==============================================

:MENU
cls
echo.
echo ==================================================
echo    ?? FAROFA SECURITY v1.0
echo    Protecao | Detecao | Limpeza
echo ==================================================
echo.
echo  Escolha uma opcao:
echo.
echo   [1] ?? Verificar ameacas (malware e mineradores)
echo   [2] ?? Limpar cache e arquivos temporarios
echo   [3] ?? Ver processos ativos (detectar uso anormal)
echo   [4] ?? Fazer TUDO (verificar + limpar)
echo   [0] ? Sair
echo.
set /p OP="Digite a opcao: "

if "%OP%"=="1" goto VERIFICAR
if "%OP%"=="2" goto LIMPAR
if "%OP%"=="3" goto PROCESSOS
if "%OP%"=="4" goto TUDO
if "%OP%"=="0" goto FIM
goto MENU

:: ==============================================
:VERIFICAR
cls
echo.
echo ==================================================
echo   ?? VERIFICACAO DE AMEACAS
echo ==================================================
echo.

set ENCONTRADO=0

echo [1/5] Procurando pastas e arquivos suspeitos...
if exist "%temp%\miner*" (
    echo ?? ENCONTRADO: Pasta com nome "miner" em %temp%
    set ENCONTRADO=1
)
if exist "%appdata%\updater.exe" (
    echo ?? ENCONTRADO: Arquivo suspeito updater.exe em %appdata%
    set ENCONTRADO=1
)
if exist "%localappdata%\*.bat" (
    for %%f in (%localappdata%\*.bat) do (
        findstr /m "bitcoin\|monero\|miner\|xmrig" "%%f" >nul 2>&1
        if not errorlevel 1 (
            echo ?? ENCONTRADO: Script suspeito: %%f
            set ENCONTRADO=1
        )
    )
)

echo.
echo [2/5] Verificando processos de mineracao...
tasklist /fi "imagename eq xmrig.exe" /fi "imagename eq minerd.exe" /fi "imagename eq cpuminer.exe" /fi "imagename eq jsecoin.exe" /fi "imagename eq cryptonight.exe" >nul 2>&1
if not errorlevel 1 (
    echo ?? ENCONTRADO: Processo de mineracao rodando!
    tasklist /fi "imagename eq xmrig.exe" /fi "imagename eq minerd.exe"
    set ENCONTRADO=1
)

echo.
echo [3/5] Verificando inicializacao automatica...
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /s | findstr /i "miner\|xmrig\|bitcoin" >nul 2>&1
if not errorlevel 1 (
    echo ?? ENCONTRADO: Programa suspeito na inicializacao do Windows!
    set ENCONTRADO=1
)

echo.
echo [4/5] Verificando pastas de navegadores...
if exist "%userprofile%\.vscode\extensions\*.js" (
    findstr /s /m "eval.*atob\|document.write\|crypto" "%userprofile%\.vscode\extensions\*.js" >nul 2>&1
    if not errorlevel 1 (
        echo ?? Possivel codigo malicioso em extensao do VS Code
        set ENCONTRADO=1
    )
)

echo.
echo ==================================================
if %ENCONTRADO%==0 (
    echo ? NENHUMA AMEACA ENCONTRADA - Tudo limpo!
) else (
    echo ?? FORAM ENCONTRADOS ITENS SUSPEITOS!
    echo Recomendacao: Finalize processos suspeitos e exclua os arquivos.
    echo Caso duvide, escaneie com o Windows Defender.
)
echo ==================================================
echo.
pause
goto MENU

:: ==============================================
:LIMPAR
cls
echo.
echo ==================================================
echo   ?? LIMPEZA DE CACHE E ARQUIVOS TEMPORARIOS
echo ==================================================
echo.

echo [1/6] Limpando pasta Temporarios do Windows...
del /f /s /q "%temp%\*.*" 2>nul
rd /s /q "%temp%" 2>nul
md "%temp%" >nul

echo [2/6] Limpando Prefetch...
del /f /s /q "C:\Windows\Prefetch\*.*" 2>nul

echo [3/6] Limpando cache do Chrome...
if exist "%localappdata%\Google\Chrome\User Data\Default\Cache" (
    rd /s /q "%localappdata%\Google\Chrome\User Data\Default\Cache" 2>nul
    echo    ? Cache do Chrome limpo
)

echo [4/6] Limpando cache do Edge...
if exist "%localappdata%\Microsoft\Edge\User Data\Default\Cache" (
    rd /s /q "%localappdata%\Microsoft\Edge\User Data\Default\Cache" 2>nul
    echo    ? Cache do Edge limpo
)

echo [5/6] Limpando lixeira...
rd /s /q "C:\$Recycle.Bin" 2>nul

echo [6/6] Limpando atualizacoes antigas do Windows...
cleanmgr /sagerun:1 >nul 2>&1

echo.
echo ==================================================
echo   ? LIMPEZA CONCLUIDA!
echo ==================================================
echo.
pause
goto MENU

:: ==============================================
:PROCESSOS
cls
echo.
echo ==================================================
echo   ?? PROCESSOS COM USO ALTO DE CPU/MEMORIA
echo ==================================================
echo.
echo Processos com mais de 10% de uso de CPU:
echo.
powershell -Command "$p = Get-Process | Where-Object CPU -gt 10 | Sort-Object CPU -Descending | Select-Object -First 15 Name, Id, CPU, WorkingSet; $p | Format-Table -AutoSize" 2>nul
echo.
echo ?? Fique atento a nomes estranhos que consomem MUITO CPU!
echo Mineradores costumam usar 50%% a 100%% do processador!
echo.
pause
goto MENU

:: ==============================================
:TUDO
call :VERIFICAR
call :LIMPAR
goto MENU

:: ==============================================
:FIM
cls
echo.
echo ==================================================
echo   ?? Pronto! Mantenha sempre atualizado:
echo   - Windows Defender ligado
echo   - Navegador atualizado
echo   - Evite baixar arquivos de sites desconhecidos
echo ==================================================
echo.
timeout /t 2 >nul
exit /b