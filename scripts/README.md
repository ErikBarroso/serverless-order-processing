# 📁 Scripts de Gerenciamento

Esta pasta contém scripts organizados para gerenciar o ambiente LocalStack de desenvolvimento e deploy para produção.

## 📂 Estrutura dos Scripts

```
scripts/
├── localstack.sh              # Script principal (orquestrador)
├── setup/
│   ├── init-tables.sh         # Criação de tabelas DynamoDB e SQS
│   └── seed-data.sh           # Inserção de dados de teste
├── test/
│   ├── test-auth.sh           # Testes de autenticação
│   ├── test-sqs.sh            # Testes de processamento SQS
│   └── test-api.sh            # Testes dos endpoints da API
├── deploy/                    # 🆕 Scripts de deploy para produção
│   ├── deploy-all.sh          # Deploy completo orquestrado
│   ├── deploy-infrastructure.sh # Deploy da infraestrutura AWS
│   ├── deploy.sh              # Deploy da API (ECS)
│   ├── deploy-lambda.sh       # Deploy das Lambda functions
│   └── rollback.sh            # Script de rollback
├── utils/
│   └── check-resources.sh     # Verificação de status dos recursos
└── README.md                  # Esta documentação
```

## 🚀 Uso Principal

### Script Orquestrador (`localstack.sh`)

O script principal oferece comandos unificados:

```bash
# Ver ajuda
./scripts/localstack.sh help

# Subir ambiente
./scripts/localstack.sh start

# Configurar tabelas e dados
./scripts/localstack.sh setup

# Executar todos os testes
./scripts/localstack.sh test

# Reset completo
./scripts/localstack.sh reset

# Verificar status
./scripts/localstack.sh status

# Ver logs
./scripts/localstack.sh logs
```

### Usando Makefile

Para facilitar ainda mais o uso:

```bash
# Setup inicial completo
make init

# Comandos básicos
make start
make setup
make test
make status
make stop

# Desenvolvimento
make dev        # start + setup
make reset      # reset completo
make clean      # limpar dados

# Testes específicos
make test-auth
make test-sqs
make test-api
```

## 🚀 Deploy para Produção

### Comandos de Deploy

```bash
# Deploy completo para staging
make deploy-staging

# Deploy completo para produção
make deploy-prod

# Deploy específico de componentes
make deploy-infrastructure ENV=staging
make deploy-api ENV=production
make deploy-lambda ENV=staging

# Rollback em caso de problemas
make rollback ENV=staging COMPONENT=api
make rollback ENV=production COMPONENT=all VERSION=v1.2.3
```

### Scripts de Deploy Individuais

#### 🏗️ `deploy/deploy-infrastructure.sh`
- Cria tabelas DynamoDB com prefixo de ambiente
- Cria filas SQS com DLQ
- Cria políticas IAM para Lambdas
- Suporte para múltiplos ambientes (staging/production)

#### 🚀 `deploy/deploy.sh`
- Deploy da API no ECS
- Build e push de imagem Docker
- Update de task definition
- Rolling deployment

#### ⚡ `deploy/deploy-lambda.sh`
- Deploy das Lambda functions
- Compilação TypeScript otimizada
- Criação de pacotes zip mínimos
- Update de código das functions

#### 🎯 `deploy/deploy-all.sh` (Orquestrador)
- Deploy completo coordenado
- Build + Testes + Deploy
- Suporte a diferentes ambientes
- Health checks integrados

```bash
# Exemplos de uso
./scripts/deploy/deploy-all.sh staging
./scripts/deploy/deploy-all.sh production

# Deploy apenas de alguns componentes
DEPLOY_INFRASTRUCTURE=false ./scripts/deploy/deploy-all.sh staging
DEPLOY_API=false DEPLOY_LAMBDAS=true ./scripts/deploy/deploy-all.sh staging
```

#### 🔄 `deploy/rollback.sh`
- Rollback rápido em caso de problemas
- Suporte a versões específicas
- Health checks após rollback
- Notificações (Slack/Teams)

```bash
# Rollback completo para versão anterior
./scripts/deploy/rollback.sh production all

# Rollback apenas da API
./scripts/deploy/rollback.sh staging api

# Rollback para versão específica
./scripts/deploy/rollback.sh production lambda v1.2.3
```

## 📋 Scripts Individuais

### 🏗️ Setup Scripts

#### `setup/init-tables.sh`
- Cria tabelas DynamoDB (Users, Product, Orders)
- Cria índices GSI necessários
- Cria fila SQS (order-processing-queue)
- Verifica se recursos já existem antes de criar

#### `setup/seed-data.sh`
- Insere usuário de teste: `teste@localstack.com` / `12345678`
- Insere 4 produtos de exemplo
- Verifica duplicatas antes de inserir
- Hash bcrypt correto para a senha

### 🧪 Test Scripts

#### `test/test-auth.sh`
- Testa login com usuário de teste
- Verifica obtenção de token JWT
- Testa acesso a rotas protegidas
- Valida autenticação end-to-end

#### `test/test-sqs.sh`
- Envia mensagem de teste para SQS
- Monitora processamento pelo worker
- Verifica contadores da fila
- Gera UUIDs únicos para cada teste

#### `test/test-api.sh`
- Testa endpoints públicos (produtos)
- Testa endpoints protegidos (perfil, pedidos)
- Testa criação de novos pedidos
- Testa casos de erro (401, 404)

### 🔧 Utility Scripts

#### `utils/check-resources.sh`
- Verifica saúde do LocalStack
- Lista status de todas as tabelas DynamoDB
- Mostra estatísticas das filas SQS
- Conta itens nas tabelas
- Resumo geral do ambiente

## 🔒 Configuração de Permissões

Os scripts são automaticamente configurados com permissões de execução quando você usa o Makefile:

```bash
make permissions
```

Ou manualmente:

```bash
chmod +x scripts/localstack.sh
chmod +x scripts/setup/*.sh
chmod +x scripts/test/*.sh
chmod +x scripts/utils/*.sh
chmod +x scripts/deploy/*.sh  # 🆕
```

## 🎯 Fluxo de Desenvolvimento

### Primeiro uso:
```bash
make init          # Setup inicial completo
```

### Desenvolvimento diário:
```bash
make dev           # Subir ambiente
make test          # Verificar se tudo funciona
```

### Deploy para staging:
```bash
make deploy-staging  # Deploy automático
```

### Deploy para produção:
```bash
make deploy-prod     # Deploy com verificações extras
```

### Em caso de problemas:
```bash
make rollback ENV=production COMPONENT=all
```

### Debugging:
```bash
make status        # Ver estado dos recursos
make logs          # Ver logs dos containers
```

### Reset quando necessário:
```bash
make reset         # Limpar e reconfigurar tudo
```

## 🔍 Troubleshooting

### LocalStack não responde:
```bash
make status        # Verificar se está rodando
make logs          # Ver erros nos logs
make reset         # Reset completo
```

### Tabelas não criadas:
```bash
./scripts/utils/check-resources.sh    # Verificar estado
./scripts/setup/init-tables.sh        # Recriar tabelas
```

### Dados de teste ausentes:
```bash
./scripts/setup/seed-data.sh          # Recriar dados
```

### Deploy falhou:
```bash
# Verificar logs de deploy
./scripts/deploy/deploy-all.sh staging

# Fazer rollback se necessário
make rollback ENV=staging COMPONENT=all
```

### Lambda não funciona:
```bash
# Redeploy apenas da Lambda
make deploy-lambda ENV=staging

# Verificar logs da Lambda
aws logs tail /aws/lambda/create-order-staging --follow
```

## 🌟 Boas Práticas

### Ambientes
- **Local**: Use `make dev` para desenvolvimento
- **Staging**: Use `make deploy-staging` para testes
- **Production**: Use `make deploy-prod` com cuidado

### Segurança
- Sempre teste em staging primeiro
- Use rollback em caso de problemas
- Configure notificações para deploys em produção

### Monitoramento
- Use `make status` para verificar saúde
- Configure alertas para falhas de deploy
- Monitore logs após deployments

### Versionamento
- Use tags git para releases
- Documente mudanças importantes
- Mantenha histórico de deploys

## 🔗 Integração com CI/CD

Os scripts são compatíveis com pipelines de CI/CD:

```yaml
# GitHub Actions example
- name: Deploy to staging
  run: make deploy-staging

- name: Run tests
  run: make test

- name: Deploy to production
  run: make deploy-prod
  if: github.ref == 'refs/heads/main'
```

Esta estrutura segue as **melhores práticas da indústria** e é amplamente utilizada em empresas de tecnologia! 🚀 