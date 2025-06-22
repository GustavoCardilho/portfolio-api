# Multi-stage build para otimizar o tamanho da imagem
FROM node:20-alpine AS base

# Instalar dependências necessárias para o build
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Stage de dependências
FROM base AS deps
# Instalar dependências de produção
RUN pnpm install --frozen-lockfile --prod=false

# Stage de build
FROM base AS builder
# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiar código fonte
COPY . .

# Gerar Prisma client
RUN npx prisma generate

# Build da aplicação
RUN pnpm run build

# Stage de produção
FROM node:20-alpine AS runner

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar apenas arquivos necessários para produção
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Mudar propriedade dos arquivos para o usuário nestjs
RUN chown -R nestjs:nodejs /app

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Script de inicialização com debug
COPY --chown=nestjs:nodejs <<EOF /app/start.sh
#!/bin/sh
echo "🚀 Iniciando aplicação..."
echo "📊 Variáveis de ambiente:"
echo "   NODE_ENV: \$NODE_ENV"
echo "   PORT: \$PORT"
echo "   DATABASE_URL: \$DATABASE_URL"

# Verificar se o arquivo main.js existe
if [ ! -f "dist/main.js" ]; then
    echo "❌ Erro: dist/main.js não encontrado!"
    exit 1
fi

echo "✅ Arquivo main.js encontrado"
echo "🌐 Iniciando servidor na porta \$PORT"

# Executar a aplicação
exec node dist/main.js
EOF

RUN chmod +x /app/start.sh

# Comando para executar a aplicação
CMD ["/app/start.sh"] 