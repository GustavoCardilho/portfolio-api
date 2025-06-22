# 🚀 Deploy na Railway

Este projeto está configurado para deploy otimizado na Railway com Docker.

## 📋 Pré-requisitos

- Conta no Railway
- Git configurado
- Variáveis de ambiente configuradas

## 🔧 Configuração

### 1. Variáveis de Ambiente

Configure as seguintes variáveis no Railway:

```bash
# Database
DATABASE_URL=sua_url_do_banco

# Email (Resend)
EMAIL_API_KEY=sua_chave_api_resend
EMAIL_FROM=seu_email@dominio.com

# AWS S3
AWS_ACCESS_KEY_ID=sua_aws_key
AWS_SECRET_ACCESS_KEY=sua_aws_secret
AWS_REGION=sua_regiao_aws
AWS_S3_BUCKET=seu_bucket_s3

# App
NODE_ENV=production
PORT=3000
```

### 2. Teste Local Antes do Deploy

```bash
# Testar build localmente
./scripts/test-build.sh

# Build da imagem Docker
docker build -t portfolio-api .

# Teste local com Docker
docker run -p 3000:3000 portfolio-api
```

### 3. Deploy Automático

1. Conecte seu repositório ao Railway
2. O Railway detectará automaticamente o `Dockerfile`
3. Configure as variáveis de ambiente
4. Deploy será iniciado automaticamente

### 4. Deploy Manual

```bash
# Build local para teste
docker build -t portfolio-api .

# Teste local
docker run -p 3000:3000 portfolio-api

# Push para Railway
railway up
```

## 🐳 Docker

### Build Local

```bash
# Build da imagem
docker build -t portfolio-api .

# Executar container
docker run -p 3000:3000 portfolio-api
```

### Docker Compose

```bash
# Executar com docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

## 📊 Otimizações Implementadas

### Multi-stage Build

- **Stage 1**: Instalação de dependências
- **Stage 2**: Build da aplicação
- **Stage 3**: Imagem final otimizada

### Segurança

- Usuário não-root (`nestjs`)
- Imagem Alpine Linux (menor tamanho)
- Health checks configurados

### Performance

- Cache de dependências otimizado
- Build otimizado com SWC
- Imagem final minimalista

## 🔍 Monitoramento

### Health Check

- Endpoint: `/health`
- Intervalo: 30s
- Timeout: 3s
- Retries: 3

### Logs

```bash
# Ver logs no Railway
railway logs

# Ver logs locais
docker logs container_id
```

## 🚨 Troubleshooting

### Build Falha

1. **Erro de Prisma**: Verifique se o `DATABASE_URL` está configurado
2. **Dependências**: Confirme se o `pnpm-lock.yaml` está atualizado
3. **TypeScript**: Execute `./scripts/test-build.sh` localmente

### Runtime Errors

1. Verifique as variáveis de ambiente
2. Confirme se o banco de dados está acessível
3. Verifique os logs da aplicação

### Performance

1. Monitore o uso de memória
2. Verifique se o health check está passando
3. Analise os logs de erro

## 🔧 Correções Recentes

### Prisma Client

- ✅ Corrigido import de `generated/prisma` para `@prisma/client`
- ✅ Prisma client gerado durante o build
- ✅ Dependências do Prisma incluídas na imagem final

### Build Process

- ✅ Multi-stage build otimizado
- ✅ Cache de dependências
- ✅ Health checks configurados

## 📈 Métricas

A aplicação expõe métricas básicas:

- Status: `/health`
- Informações: logs de inicialização

## 🔄 CI/CD

Para deploy automático:

1. Conecte o repositório ao Railway
2. Configure as variáveis de ambiente
3. Cada push para `main` fará deploy automático

## 📞 Suporte

Em caso de problemas:

1. Execute `./scripts/test-build.sh` localmente
2. Verifique os logs no Railway
3. Teste localmente com Docker
4. Verifique as variáveis de ambiente
