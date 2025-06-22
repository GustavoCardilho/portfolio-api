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

# Testar execução localmente
./scripts/test-run.sh

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
- Configuração simplificada
- CORS configurado por ambiente

### Performance

- Cache de dependências otimizado
- Build otimizado com SWC
- Imagem final minimalista

## 🔒 Configuração de CORS

### Desenvolvimento

Permite conexões de:

- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173` (Vite dev server)
- `http://localhost:4173` (Vite preview)
- `http://127.0.0.1:*` (equivalente)

### Produção

Permite conexões apenas de:

- `https://gustavocardilho.com.br`
- `https://www.gustavocardilho.com.br`

### Configuração

- **Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers**: Content-Type, Authorization, X-Requested-With
- **Credentials**: true
- **Options Success Status**: 200

## 🔍 Monitoramento

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

1. **Variáveis de ambiente**: Verifique se todas estão configuradas no Railway
2. **Banco de dados**: Confirme se o `DATABASE_URL` está acessível
3. **Logs**: Verifique os logs da aplicação no Railway
4. **Teste local**: Execute `./scripts/test-run.sh` para verificar

### CORS Issues

1. **Desenvolvimento**: Verifique se está usando `NODE_ENV=development`
2. **Produção**: Confirme se o domínio está na lista permitida
3. **Headers**: Verifique se os headers estão sendo enviados corretamente
4. **Credentials**: Certifique-se de que `credentials: true` está configurado no frontend

### Service Unavailable

1. **Health check desabilitado**: Removido para evitar problemas de inicialização
2. **Inicialização simplificada**: Comando direto `node dist/main.js`
3. **Logs detalhados**: Tratamento de erros melhorado no `main.ts`

### Performance

1. Monitore o uso de memória
2. Verifique os logs da aplicação
3. Analise os logs de erro

## 🔧 Correções Recentes

### Prisma Client

- ✅ Corrigido import de `generated/prisma` para `@prisma/client`
- ✅ Prisma client gerado durante o build
- ✅ Dependências do Prisma incluídas na imagem final

### CORS Configuration

- ✅ Configuração baseada em ambiente
- ✅ Domínios permitidos configurados
- ✅ Arquivo de configuração separado
- ✅ Logs de debug para CORS

### Inicialização Simplificada

- ✅ Health check removido do Railway
- ✅ Comando de inicialização simplificado
- ✅ Tratamento de erros melhorado no `main.ts`
- ✅ Logs detalhados durante o startup

### Build Process

- ✅ Multi-stage build otimizado
- ✅ Cache de dependências
- ✅ Configuração Railway simplificada

## 📈 Métricas

A aplicação expõe métricas básicas:

- Status: `/health` (disponível após inicialização)
- Informações: logs de inicialização detalhados

## 🔄 CI/CD

Para deploy automático:

1. Conecte o repositório ao Railway
2. Configure as variáveis de ambiente
3. Cada push para `main` fará deploy automático

## 📞 Suporte

Em caso de problemas:

1. Execute `./scripts/test-build.sh` localmente
2. Execute `./scripts/test-run.sh` para testar execução
3. Verifique os logs no Railway
4. Teste localmente com Docker
5. Verifique as variáveis de ambiente
