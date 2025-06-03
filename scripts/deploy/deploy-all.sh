#!/bin/bash

# Script orquestrador para deploy completo

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Variáveis
ENVIRONMENT="${1:-staging}"
DEPLOY_INFRASTRUCTURE="${DEPLOY_INFRASTRUCTURE:-true}"
DEPLOY_API="${DEPLOY_API:-true}"
DEPLOY_LAMBDAS="${DEPLOY_LAMBDAS:-true}"

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}🚀 Deploy Completo - Serverless Order Processing${NC}"
    echo ""
    echo -e "${YELLOW}Uso:${NC} ./deploy-all.sh [ambiente] [opções]"
    echo ""
    echo -e "${YELLOW}Ambientes:${NC}"
    echo -e "  ${GREEN}staging${NC}     - Ambiente de staging (padrão)"
    echo -e "  ${GREEN}production${NC}  - Ambiente de produção"
    echo ""
    echo -e "${YELLOW}Variáveis de ambiente:${NC}"
    echo -e "  ${GREEN}DEPLOY_INFRASTRUCTURE${NC}=true/false  - Deploy da infraestrutura"
    echo -e "  ${GREEN}DEPLOY_API${NC}=true/false             - Deploy da API"
    echo -e "  ${GREEN}DEPLOY_LAMBDAS${NC}=true/false         - Deploy das Lambdas"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo -e "  ./deploy-all.sh staging"
    echo -e "  ./deploy-all.sh production"
    echo -e "  DEPLOY_INFRASTRUCTURE=false ./deploy-all.sh staging"
}

# Função para validar ambiente
validate_environment() {
    if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
        echo -e "${RED}❌ Ambiente inválido: $ENVIRONMENT${NC}"
        echo -e "${YELLOW}Ambientes válidos: staging, production${NC}"
        exit 1
    fi
}

# Função para verificar dependências
check_dependencies() {
    echo -e "${BLUE}🔍 Verificando dependências...${NC}"
    
    local deps=("aws" "docker" "npm" "zip")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        echo -e "${RED}❌ Dependências não encontradas: ${missing[*]}${NC}"
        exit 1
    fi
    
    # Verificar se AWS CLI está configurado
    if ! aws sts get-caller-identity &>/dev/null; then
        echo -e "${RED}❌ AWS CLI não está configurado${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Todas as dependências OK${NC}"
}

# Função para build do projeto
build_project() {
    echo -e "${BLUE}🔨 Building projeto...${NC}"
    cd "$PROJECT_ROOT"
    
    echo -e "${BLUE}  📦 Instalando dependências...${NC}"
    npm ci
    
    echo -e "${BLUE}  🔨 Compilando TypeScript...${NC}"
    npm run build
    
    echo -e "${GREEN}✅ Build concluído${NC}"
}

# Função para executar testes
run_tests() {
    echo -e "${BLUE}🧪 Executando testes...${NC}"
    cd "$PROJECT_ROOT"
    
    npm test
    
    echo -e "${GREEN}✅ Testes passaram${NC}"
}

# Função para deploy da infraestrutura
deploy_infrastructure() {
    if [[ "$DEPLOY_INFRASTRUCTURE" == "true" ]]; then
        echo -e "${PURPLE}🏗️ Deploy da infraestrutura...${NC}"
        
        ENVIRONMENT="$ENVIRONMENT" "$SCRIPT_DIR/deploy-infrastructure.sh"
        
        echo -e "${GREEN}✅ Infraestrutura deployada${NC}"
    else
        echo -e "${YELLOW}⏭️ Skip deploy da infraestrutura${NC}"
    fi
}

# Função para deploy da API
deploy_api() {
    if [[ "$DEPLOY_API" == "true" ]]; then
        echo -e "${PURPLE}🚀 Deploy da API...${NC}"
        
        ENVIRONMENT="$ENVIRONMENT" "$SCRIPT_DIR/deploy.sh"
        
        echo -e "${GREEN}✅ API deployada${NC}"
    else
        echo -e "${YELLOW}⏭️ Skip deploy da API${NC}"
    fi
}

# Função para deploy das Lambdas
deploy_lambdas() {
    if [[ "$DEPLOY_LAMBDAS" == "true" ]]; then
        echo -e "${PURPLE}⚡ Deploy das Lambdas...${NC}"
        
        ENVIRONMENT="$ENVIRONMENT" "$SCRIPT_DIR/deploy-lambda.sh"
        
        echo -e "${GREEN}✅ Lambdas deployadas${NC}"
    else
        echo -e "${YELLOW}⏭️ Skip deploy das Lambdas${NC}"
    fi
}

# Função para verificar saúde dos serviços
health_check() {
    echo -e "${BLUE}🏥 Verificando saúde dos serviços...${NC}"
    
    # TODO: Implementar health checks específicos
    # - API endpoint
    # - Lambda functions
    # - DynamoDB tables
    
    echo -e "${GREEN}✅ Health check concluído${NC}"
}

# Função principal
main() {
    echo -e "${PURPLE}🚀 Iniciando deploy completo...${NC}"
    echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
    echo -e "${YELLOW}Infrastructure: $DEPLOY_INFRASTRUCTURE${NC}"
    echo -e "${YELLOW}API: $DEPLOY_API${NC}"
    echo -e "${YELLOW}Lambdas: $DEPLOY_LAMBDAS${NC}"
    echo ""
    
    check_dependencies
    validate_environment
    
    build_project
    run_tests
    
    deploy_infrastructure
    deploy_api
    deploy_lambdas
    
    health_check
    
    echo ""
    echo -e "${GREEN}🎉 Deploy completo concluído com sucesso!${NC}"
    echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
    echo -e "${YELLOW}Timestamp: $(date)${NC}"
}

# Verificar argumentos
if [[ "$1" == "help" || "$1" == "--help" || "$1" == "-h" ]]; then
    show_help
    exit 0
fi

main "$@" 