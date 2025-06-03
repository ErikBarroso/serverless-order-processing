#!/bin/bash

# Script para rollback de deployments

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Variáveis
ENVIRONMENT="${1:-staging}"
COMPONENT="${2:-all}"
VERSION="${3}"

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}🔄 Rollback Script${NC}"
    echo ""
    echo -e "${YELLOW}Uso:${NC} ./rollback.sh [ambiente] [componente] [versão]"
    echo ""
    echo -e "${YELLOW}Argumentos:${NC}"
    echo -e "  ${GREEN}ambiente${NC}     - staging/production (padrão: staging)"
    echo -e "  ${GREEN}componente${NC}   - api/lambda/all (padrão: all)"
    echo -e "  ${GREEN}versão${NC}       - versão para rollback (opcional)"
    echo ""
    echo -e "${YELLOW}Exemplos:${NC}"
    echo -e "  ./rollback.sh staging api"
    echo -e "  ./rollback.sh production lambda v1.2.3"
    echo -e "  ./rollback.sh production all"
}

# Função para rollback da API (ECS)
rollback_api() {
    echo -e "${BLUE}🔄 Rollback da API...${NC}"
    
    local cluster_name="order-api-${ENVIRONMENT}"
    local service_name="service-order-api-${ENVIRONMENT}"
    
    if [ -n "$VERSION" ]; then
        echo -e "${YELLOW}Fazendo rollback para versão: $VERSION${NC}"
        # Implementar rollback para versão específica
        # aws ecs update-service --cluster $cluster_name --service $service_name --task-definition task-order-api:$VERSION
    else
        echo -e "${YELLOW}Fazendo rollback para versão anterior${NC}"
        
        # Obter a task definition anterior
        local previous_task=$(aws ecs describe-services \
            --cluster $cluster_name \
            --services $service_name \
            --query 'services[0].deployments[?status==`PRIMARY`].taskDefinition' \
            --output text)
        
        if [ -n "$previous_task" ]; then
            echo -e "${BLUE}Rollback para task definition: $previous_task${NC}"
            aws ecs update-service \
                --cluster $cluster_name \
                --service $service_name \
                --task-definition $previous_task \
                --force-new-deployment
        else
            echo -e "${RED}❌ Não foi possível encontrar versão anterior${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ Rollback da API iniciado${NC}"
}

# Função para rollback das Lambdas
rollback_lambda() {
    echo -e "${BLUE}🔄 Rollback das Lambdas...${NC}"
    
    local lambda_name="create-order-${ENVIRONMENT}"
    
    if [ -n "$VERSION" ]; then
        echo -e "${YELLOW}Fazendo rollback para versão: $VERSION${NC}"
        aws lambda update-function-code \
            --function-name $lambda_name \
            --s3-bucket "serverless-order-processing-deploys" \
            --s3-key "lambdas/$VERSION/lambda-deployment.zip"
    else
        echo -e "${YELLOW}Fazendo rollback para $LATEST-1${NC}"
        
        # Listar versões e pegar a anterior
        local versions=$(aws lambda list-versions-by-function \
            --function-name $lambda_name \
            --query 'Versions[?Version!=`$LATEST`].Version' \
            --output text)
        
        local previous_version=$(echo $versions | tr ' ' '\n' | tail -2 | head -1)
        
        if [ -n "$previous_version" ]; then
            echo -e "${BLUE}Rollback para versão: $previous_version${NC}"
            aws lambda update-alias \
                --function-name $lambda_name \
                --name "${ENVIRONMENT}" \
                --function-version $previous_version
        else
            echo -e "${RED}❌ Não foi possível encontrar versão anterior${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}✅ Rollback das Lambdas concluído${NC}"
}

# Função para verificar saúde após rollback
health_check_after_rollback() {
    echo -e "${BLUE}🏥 Verificando saúde após rollback...${NC}"
    
    local retries=5
    local delay=30
    
    for i in $(seq 1 $retries); do
        echo -e "${YELLOW}Tentativa $i/$retries...${NC}"
        
        # Verificar API (se disponível)
        if [[ "$COMPONENT" == "api" || "$COMPONENT" == "all" ]]; then
            local api_url="https://api-${ENVIRONMENT}.yourdomain.com/health"
            if curl -f -s "$api_url" > /dev/null; then
                echo -e "${GREEN}✅ API está respondendo${NC}"
            else
                echo -e "${RED}❌ API não está respondendo${NC}"
                if [ $i -eq $retries ]; then
                    exit 1
                fi
            fi
        fi
        
        # Verificar Lambda (se disponível)
        if [[ "$COMPONENT" == "lambda" || "$COMPONENT" == "all" ]]; then
            local lambda_name="create-order-${ENVIRONMENT}"
            if aws lambda get-function --function-name $lambda_name > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Lambda está ativa${NC}"
            else
                echo -e "${RED}❌ Lambda com problemas${NC}"
                if [ $i -eq $retries ]; then
                    exit 1
                fi
            fi
        fi
        
        if [ $i -lt $retries ]; then
            echo -e "${YELLOW}Aguardando ${delay}s...${NC}"
            sleep $delay
        fi
    done
    
    echo -e "${GREEN}✅ Health check após rollback OK${NC}"
}

# Função para notificar rollback
notify_rollback() {
    echo -e "${BLUE}📢 Enviando notificação de rollback...${NC}"
    
    local message="🔄 ROLLBACK EXECUTADO
Environment: $ENVIRONMENT
Component: $COMPONENT
Version: ${VERSION:-'anterior'}
Timestamp: $(date)
User: $(whoami)"

    # Slack notification (se configurado)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    # Teams notification (se configurado)
    if [ -n "$TEAMS_WEBHOOK_URL" ]; then
        curl -H "Content-Type: application/json" -d "{
            \"@type\": \"MessageCard\",
            \"summary\": \"Rollback Executado\",
            \"text\": \"$message\"
        }" "$TEAMS_WEBHOOK_URL"
    fi
    
    echo -e "${GREEN}✅ Notificações enviadas${NC}"
}

# Função principal
main() {
    echo -e "${PURPLE}🔄 Iniciando rollback...${NC}"
    echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
    echo -e "${YELLOW}Component: $COMPONENT${NC}"
    echo -e "${YELLOW}Version: ${VERSION:-'anterior'}${NC}"
    echo ""
    
    # Confirmação de segurança para produção
    if [[ "$ENVIRONMENT" == "production" ]]; then
        echo -e "${RED}⚠️ ATENÇÃO: Rollback em PRODUÇÃO!${NC}"
        read -p "Tem certeza? Digite 'yes' para continuar: " confirm
        if [[ "$confirm" != "yes" ]]; then
            echo -e "${YELLOW}Rollback cancelado${NC}"
            exit 0
        fi
    fi
    
    case $COMPONENT in
        "api")
            rollback_api
            ;;
        "lambda")
            rollback_lambda
            ;;
        "all")
            rollback_api
            rollback_lambda
            ;;
        *)
            echo -e "${RED}❌ Componente inválido: $COMPONENT${NC}"
            exit 1
            ;;
    esac
    
    health_check_after_rollback
    notify_rollback
    
    echo ""
    echo -e "${GREEN}🎉 Rollback concluído com sucesso!${NC}"
    echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
    echo -e "${YELLOW}Component: $COMPONENT${NC}"
    echo -e "${YELLOW}Timestamp: $(date)${NC}"
}

# Verificar argumentos
if [[ "$1" == "help" || "$1" == "--help" || "$1" == "-h" ]]; then
    show_help
    exit 0
fi

main "$@" 