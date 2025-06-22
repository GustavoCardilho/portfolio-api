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

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Comando para executar a aplicação
CMD ["node", "dist/main"] 