# Makefile para gerenciar ambiente LocalStack

.PHONY: help start stop setup test reset status logs clean install dev

# Comandos principais
help:
	@echo "🚀 LocalStack Manager - Comandos disponíveis:"
	@echo ""
	@echo "  make start     - Subir containers LocalStack"
	@echo "  make stop      - Parar containers"
	@echo "  make setup     - Configurar tabelas e dados"
	@echo "  make test      - Executar todos os testes"
	@echo "  make reset     - Reset completo do ambiente"
	@echo "  make status    - Verificar status dos recursos"
	@echo "  make logs      - Ver logs dos containers"
	@echo ""
	@echo "  make install   - Instalar dependências do projeto"
	@echo "  make dev       - Subir ambiente completo para desenvolvimento"
	@echo "  make clean     - Limpar dados persistidos"
	@echo ""
	@echo "Testes específicos:"
	@echo "  make test-auth - Testar autenticação"
	@echo "  make test-sqs  - Testar processamento SQS"
	@echo "  make test-api  - Testar endpoints da API"

# Comandos do LocalStack
start:
	@./scripts/localstack.sh start

stop:
	@./scripts/localstack.sh stop

setup:
	@./scripts/localstack.sh setup

test:
	@./scripts/localstack.sh test

reset:
	@./scripts/localstack.sh reset

status:
	@./scripts/localstack.sh status

logs:
	@./scripts/localstack.sh logs

# Testes específicos
test-auth:
	@chmod +x scripts/test/test-auth.sh
	@./scripts/test/test-auth.sh

test-sqs:
	@chmod +x scripts/test/test-sqs.sh
	@./scripts/test/test-sqs.sh

test-api:
	@chmod +x scripts/test/test-api.sh
	@./scripts/test/test-api.sh

# Comandos de desenvolvimento
install:
	@echo "📦 Instalando dependências..."
	@npm install

dev: start setup
	@echo "🚀 Ambiente de desenvolvimento pronto!"
	@echo "💡 API disponível em: http://localhost:3000"
	@echo "💡 LocalStack disponível em: http://localhost:4566"

# Limpeza
clean:
	@echo "🧹 Limpando dados persistidos..."
	@sudo rm -rf localstack_data/* 2>/dev/null || true
	@echo "✅ Limpeza concluída!"

# Verificações
check-deps:
	@echo "🔍 Verificando dependências..."
	@which docker > /dev/null || (echo "❌ Docker não encontrado" && exit 1)
	@which docker-compose > /dev/null || (echo "❌ Docker Compose não encontrado" && exit 1)
	@which aws > /dev/null || (echo "❌ AWS CLI não encontrado" && exit 1)
	@echo "✅ Todas as dependências encontradas!"

# Dar permissões aos scripts
permissions:
	@echo "🔧 Configurando permissões dos scripts..."
	@chmod +x scripts/localstack.sh
	@chmod +x scripts/setup/*.sh
	@chmod +x scripts/test/*.sh
	@chmod +x scripts/utils/*.sh
	@echo "✅ Permissões configuradas!"

# Setup inicial completo
init: check-deps permissions dev
	@echo "🎉 Projeto inicializado com sucesso!"
	@echo ""
	@echo "🧪 Execute 'make test' para testar tudo" 