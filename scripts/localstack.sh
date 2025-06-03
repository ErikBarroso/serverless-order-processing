#!/bin/bash

# Script principal para gerenciar LocalStack
# Uso: ./scripts/localstack.sh [start|stop|setup|test|reset]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}🚀 LocalStack Manager${NC}"
    echo ""
    echo -e "${YELLOW}Uso:${NC} ./scripts/localstack.sh [comando]"
    echo ""
    echo -e "${YELLOW}Comandos disponíveis:${NC}"
    echo -e "  ${GREEN}start${NC}   - Subir containers (docker-compose up -d)"
    echo -e "  ${GREEN}stop${NC}    - Parar containers (docker-compose down)"
    echo -e "  ${GREEN}setup${NC}   - Configurar tabelas e dados de teste"
    echo -e "  ${GREEN}test${NC}    - Executar testes de funcionalidade"
    echo -e "  ${GREEN}reset${NC}   - Reset completo (parar, limpar, subir, configurar)"
    echo -e "  ${GREEN}status${NC}  - Verificar status do LocalStack"
    echo -e "  ${GREEN}logs${NC}    - Ver logs dos containers"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo -e "  ./scripts/localstack.sh start"
    echo -e "  ./scripts/localstack.sh setup"
    echo -e "  ./scripts/localstack.sh reset"
}

# Função para verificar dependências
check_dependencies() {
    local deps=("docker" "docker-compose" "aws" "curl")
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
}

# Função para verificar se está no diretório correto
check_project_structure() {
    if [ ! -f "$PROJECT_ROOT/docker-compose.yml" ]; then
        echo -e "${RED}❌ Execute este script a partir da raiz do projeto${NC}"
        exit 1
    fi
}

# Função start
cmd_start() {
    echo -e "${BLUE}🚀 Subindo containers...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose up -d
    
    echo -e "${YELLOW}⏳ Aguardando LocalStack ficar pronto...${NC}"
    sleep 10
    
    if curl -s http://localhost:4566/health > /dev/null; then
        echo -e "${GREEN}✅ Containers rodando!${NC}"
        echo -e "${YELLOW}💡 Execute './scripts/localstack.sh setup' para configurar${NC}"
    else
        echo -e "${RED}❌ LocalStack não respondeu${NC}"
        exit 1
    fi
}

# Função stop
cmd_stop() {
    echo -e "${BLUE}🛑 Parando containers...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose down
    echo -e "${GREEN}✅ Containers parados!${NC}"
}

# Função setup
cmd_setup() {
    echo -e "${BLUE}⚙️ Configurando LocalStack...${NC}"
    "$SCRIPT_DIR/setup/init-tables.sh"
    "$SCRIPT_DIR/setup/seed-data.sh"
}

# Função test
cmd_test() {
    echo -e "${BLUE}🧪 Executando testes...${NC}"
    "$SCRIPT_DIR/test/test-auth.sh"
    "$SCRIPT_DIR/test/test-sqs.sh"
    "$SCRIPT_DIR/test/test-api.sh"
}

# Função reset
cmd_reset() {
    echo -e "${PURPLE}🔄 Reset completo do ambiente...${NC}"
    
    cmd_stop
    
    echo -e "${YELLOW}🧹 Limpando dados persistidos...${NC}"
    cd "$PROJECT_ROOT"
    sudo rm -rf localstack_data/* 2>/dev/null || true
    
    cmd_start
    cmd_setup
    
    echo -e "${GREEN}🎉 Reset completo concluído!${NC}"
}

# Função status
cmd_status() {
    echo -e "${BLUE}📊 Status do ambiente...${NC}"
    
    if curl -s http://localhost:4566/health > /dev/null; then
        echo -e "${GREEN}✅ LocalStack: Ativo${NC}"
        
        # Verificar API
        if curl -s http://localhost:3000 > /dev/null; then
            echo -e "${GREEN}✅ API: Ativa${NC}"
        else
            echo -e "${RED}❌ API: Inativa${NC}"
        fi
        
        # Verificar tabelas
        "$SCRIPT_DIR/utils/check-resources.sh"
    else
        echo -e "${RED}❌ LocalStack: Inativo${NC}"
    fi
}

# Função logs
cmd_logs() {
    echo -e "${BLUE}📋 Logs dos containers...${NC}"
    cd "$PROJECT_ROOT"
    docker-compose logs -f
}

# Função principal
main() {
    check_dependencies
    check_project_structure
    
    case "${1:-help}" in
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        setup)
            cmd_setup
            ;;
        test)
            cmd_test
            ;;
        reset)
            cmd_reset
            ;;
        status)
            cmd_status
            ;;
        logs)
            cmd_logs
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}❌ Comando inválido: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@" 