#!/bin/bash

# Script para testar a execução da aplicação
set -e

echo "🧪 Testando execução da aplicação..."

# Verificar se o build existe
if [ ! -d "dist" ]; then
    echo "❌ Build não encontrado. Execute ./scripts/test-build.sh primeiro"
    exit 1
fi

# Verificar se o arquivo main.js existe
if [ ! -f "dist/main.js" ]; then
    echo "❌ Arquivo main.js não encontrado"
    exit 1
fi

echo "✅ Build encontrado"
echo "🚀 Iniciando aplicação..."

# Definir variáveis de ambiente para teste
export NODE_ENV=production
export PORT=3000

# Executar a aplicação em background
node dist/main.js &
APP_PID=$!

echo "📊 PID da aplicação: $APP_PID"

# Aguardar um pouco para a aplicação inicializar
sleep 5

# Verificar se a aplicação está rodando
if kill -0 $APP_PID 2>/dev/null; then
    echo "✅ Aplicação está rodando"
    
    # Testar health check
    echo "🏥 Testando health check..."
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Health check funcionando"
    else
        echo "❌ Health check falhou"
    fi
    
    # Parar a aplicação
    echo "🛑 Parando aplicação..."
    kill $APP_PID
    wait $APP_PID 2>/dev/null || true
    
    echo "🎉 Teste concluído com sucesso!"
else
    echo "❌ Aplicação não está rodando"
    exit 1
fi 