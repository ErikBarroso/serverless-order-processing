# 📁 Scripts de Gerenciamento

Esta pasta contém scripts organizados para gerenciar o ambiente LocalStack de desenvolvimento.

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
├── utils/
│   └── check-resources.sh     # Verificação de status dos recursos
└── README.md                  # Esta documentação
```

## Uso Principal

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

## 📋 Scripts Individuais

### Setup Scripts

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

### Test Scripts

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

### Utility Scripts

#### `utils/check-resources.sh`
- Verifica saúde do LocalStack
- Lista status de todas as tabelas DynamoDB
- Mostra estatísticas das filas SQS
- Conta itens nas tabelas
- Resumo geral do ambiente

## Configuração de Permissões

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
```

## Fluxo de Desenvolvimento

### Primeiro uso:
```bash
make init          # Setup inicial completo
```

### Desenvolvimento diário:
```bash
make dev           # Subir ambiente
make test          # Verificar se tudo funciona
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
./scripts/setup/seed-data.sh          # Reinserir dados
```

### Testes falhando:
```bash
make test-auth     # Testar autenticação primeiro
make status        # Verificar infraestrutura
```

## 📊 Dados de Teste

### Usuário:
- **Email:** `teste@localstack.com`
- **Senha:** `12345678`
- **ID:** `11f23291-fbbb-4e5c-8548-08a793295c20`

### Produtos:
- Notebook Dell (`f09c7319-1240-4d8f-b6ea-b7af16870665`)
- Mouse Gamer (`a1b2c3d4-5678-9abc-def0-123456789abc`)
- Teclado Mecânico (`b2c3d4e5-6789-abcd-ef01-23456789abcd`)
- Monitor 24" (`c3d4e5f6-789a-bcde-f012-3456789abcde`)

## Vantagens desta Organização

1. **Separação de responsabilidades** - cada script tem função específica
2. **Reutilização** - scripts podem ser chamados individualmente
3. **Manutenção** - fácil localizar e editar funcionalidades
4. **Testabilidade** - testes isolados e focados
5. **Documentação** - cada script é autoexplicativo
6. **Flexibilidade** - use via Makefile ou diretamente
7. **Padrão profissional** - estrutura escalável e organizada 