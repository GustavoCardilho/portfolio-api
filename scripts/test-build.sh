#!/bin/bash

# Script para testar o build localmente
set -e

echo "🧪 Testando build localmente..."

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf dist
rm -rf node_modules

# Instalar dependências
echo "📦 Instalando dependências..."
pnpm install --frozen-lockfile

# Gerar Prisma client
echo "🗄️ Gerando Prisma client..."
npx prisma generate

# Verificar se o Prisma client foi gerado
if [ ! -d "node_modules/.prisma" ] && [ ! -d "node_modules/@prisma/client" ]; then
    echo "❌ Prisma client não foi gerado!"
    exit 1
fi

echo "✅ Prisma client gerado com sucesso!"

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
pnpm run build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos gerados em: dist/"
    echo "📊 Tamanho do build: $(du -sh dist | cut -f1)"
    
    # Testar se o arquivo main.js existe
    if [ -f "dist/main.js" ]; then
        echo "✅ Arquivo main.js encontrado!"
    else
        echo "❌ Arquivo main.js não encontrado!"
        exit 1
    fi
else
    echo "❌ Erro no build!"
    exit 1
fi

echo "🎉 Teste de build finalizado com sucesso!" 