#!/bin/bash

# Script de build otimizado para produção
set -e

echo "🚀 Iniciando build otimizado para produção..."

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

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
pnpm run build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos gerados em: dist/"
    echo "📊 Tamanho do build: $(du -sh dist | cut -f1)"
else
    echo "❌ Erro no build!"
    exit 1
fi

echo "�� Build finalizado!" 