@echo off
echo ========================================
echo    Configuration PostgreSQL pour CDP
echo ========================================
echo.

echo [1/5] Vérification de PostgreSQL...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL n'est pas installé.
    echo.
    echo Veuillez installer PostgreSQL depuis :
    echo https://www.postgresql.org/download/windows/
    echo.
    echo Ou utiliser Chocolatey : choco install postgresql
    echo.
    pause
    exit /b 1
) else (
    echo ✅ PostgreSQL est installé.
)

echo.
echo [2/5] Test de connexion à PostgreSQL...
psql -U postgres -c "SELECT version();" >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Impossible de se connecter à PostgreSQL.
    echo.
    echo Vérifiez que :
    echo - PostgreSQL est démarré
    echo - L'utilisateur 'postgres' existe
    echo - Le mot de passe est correct
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Connexion PostgreSQL réussie.
)

echo.
echo [3/5] Création de la base de données...
psql -U postgres -c "CREATE DATABASE cdp_missions;" >nul 2>nul
if %errorlevel% neq 0 (
    echo ℹ️ La base de données existe déjà ou erreur de création.
) else (
    echo ✅ Base de données 'cdp_missions' créée.
)

echo.
echo [4/5] Installation des dépendances du serveur...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dépendances.
    pause
    exit /b 1
) else (
    echo ✅ Dépendances installées.
)

echo.
echo [5/5] Migration de la base de données...
call npm run db:migrate
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la migration.
    pause
    exit /b 1
) else (
    echo ✅ Migration terminée.
)

echo.
echo ========================================
echo    Configuration terminée !
echo ========================================
echo.
echo Pour démarrer l'application :
echo 1. cd server && npm run dev
echo 2. Dans un autre terminal : npm run dev
echo.
pause
