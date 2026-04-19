#!/bin/bash

# Script de inicialização rápida para Windows

echo "=========================================="
echo "🚀 Iniciando Login Futurista"
echo "=========================================="
echo ""

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale Node.js primeiro."
    exit 1
fi

# Verificar se mysql está instalado
if ! command -v mysql &> /dev/null; then
    echo "⚠️  mysql não encontrado no PATH"
    echo "📝 Execute manualmente: mysql -u root -p < bd/setup.sql"
fi

echo "1️⃣  Instalando dependências do Backend..."
cd bd
npm install

echo ""
echo "2️⃣  Instalando dependências do Frontend..."
cd ..
npm install

echo ""
echo "=========================================="
echo "✅ Instalação completa!"
echo "=========================================="
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1️⃣  Configure o banco de dados:"
echo "   mysql -u root -p < bd/setup.sql"
echo ""
echo "2️⃣  Inicie o Backend (em um terminal):"
echo "   cd bd && npm run dev"
echo ""
echo "3️⃣  Inicie o Frontend (em outro terminal):"
echo "   npm run dev"
echo ""
echo "4️⃣  Acesse: http://localhost:5173"
echo ""
echo "🔑 Credenciais de teste:"
echo "   Email: admin@example.com"
echo "   Senha: admin123"
echo ""
