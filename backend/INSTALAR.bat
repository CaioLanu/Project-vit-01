@echo off
REM Script de inicialização rápida para Windows

echo ==========================================
echo 🚀 Iniciando Login Futurista
echo ==========================================
echo.

REM Verificar se npm está instalado
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm não encontrado. Instale Node.js primeiro.
    pause
    exit /b 1
)

echo 1️⃣ Instalando dependências do Backend...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do backend
    pause
    exit /b 1
)

echo.
echo 2️⃣ Instalando dependências do Frontend...
cd ..
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências do frontend
    pause
    exit /b 1
)

echo.
echo ==========================================
echo ✅ Instalação completa!
echo ==========================================
echo.
echo 📋 Próximos passos:
echo.
echo 1️⃣ Configure o banco de dados:
echo    - Abra DBeaver
echo    - Crie uma conexão ao MySQL (localhost:3306, user:root)
echo    - Abra o arquivo backend/setup.sql e execute
echo    - Ou no CMD: mysql -u root -p ^< backend\setup.sql
echo.
echo 2️⃣ Inicie o Backend (em um terminal):
echo    cd backend ^&^& npm run dev
echo.
echo 3️⃣ Inicie o Frontend (em outro terminal):
echo    npm run dev
echo.
echo 4️⃣ Acesse: http://localhost:5173
echo.
echo 🔑 Credenciais de teste:
echo    Email: admin@example.com
echo    Senha: admin123
echo.
pause
