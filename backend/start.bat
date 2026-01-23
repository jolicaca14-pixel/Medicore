@echo off
echo ========================================
echo   MediCore Backend - Inicio Automatizado
echo ========================================
echo.

echo [1/4] Levantando PostgreSQL con Docker...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: No se pudo iniciar Docker. Asegurate de que Docker Desktop este ejecutandose.
    pause
    exit /b 1
)

echo.
echo [2/4] Esperando a que PostgreSQL este listo...
timeout /t 5 /nobreak > nul

echo.
echo [3/4] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion de dependencias.
    pause
    exit /b 1
)

echo.
echo [4/4] Iniciando servidor de desarrollo...
echo.
echo ========================================
echo   Servidor corriendo en http://localhost:3001
echo   Base de datos: PostgreSQL en puerto 5432
echo ========================================
echo.

npm run dev
