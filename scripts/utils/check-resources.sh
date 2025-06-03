#!/bin/bash

# Script para verificar status dos recursos AWS no LocalStack

ENDPOINT_URL="http://localhost:4566"
REGION="us-east-1"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para verificar tabelas DynamoDB
check_dynamodb_tables() {
    echo -e "${BLUE}📊 Verificando tabelas DynamoDB...${NC}"
    
    local tables=("Users" "Product" "Orders")
    
    for table in "${tables[@]}"; do
        local status=$(aws --endpoint-url=$ENDPOINT_URL dynamodb describe-table \
            --table-name $table --region $REGION 2>/dev/null | \
            grep -o '"TableStatus"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
        
        if [ "$status" = "ACTIVE" ]; then
            echo -e "${GREEN}  ✅ $table: ATIVA${NC}"
            
            # Contar itens
            local count=$(aws --endpoint-url=$ENDPOINT_URL dynamodb scan \
                --table-name $table --select COUNT --region $REGION 2>/dev/null | \
                grep -o '"Count"[[:space:]]*:[[:space:]]*[0-9]*' | grep -o '[0-9]*$')
            
            echo -e "${YELLOW}     📊 Itens: ${count:-"0"}${NC}"
        else
            echo -e "${RED}  ❌ $table: ${status:-"NÃO ENCONTRADA"}${NC}"
        fi
    done
}

# Função para verificar filas SQS
check_sqs_queues() {
    echo -e "${BLUE}📨 Verificando filas SQS...${NC}"
    
    local queues=$(aws --endpoint-url=$ENDPOINT_URL sqs list-queues \
        --region $REGION 2>/dev/null | grep -o 'http://[^"]*' || echo "")
    
    if [ -n "$queues" ]; then
        while IFS= read -r queue_url; do
            local queue_name=$(basename "$queue_url")
            echo -e "${GREEN}  ✅ Fila: $queue_name${NC}"
            
            # Verificar atributos da fila
            local attrs=$(aws --endpoint-url=$ENDPOINT_URL sqs get-queue-attributes \
                --queue-url "$queue_url" \
                --attribute-names ApproximateNumberOfMessages,ApproximateNumberOfMessagesNotVisible \
                --region $REGION 2>/dev/null)
            
            local visible=$(echo "$attrs" | grep -o '"ApproximateNumberOfMessages":"[0-9]*"' | cut -d'"' -f4)
            local processing=$(echo "$attrs" | grep -o '"ApproximateNumberOfMessagesNotVisible":"[0-9]*"' | cut -d'"' -f4)
            
            echo -e "${YELLOW}     📊 Mensagens visíveis: ${visible:-"0"}${NC}"
            echo -e "${YELLOW}     ⏳ Mensagens processando: ${processing:-"0"}${NC}"
        done <<< "$queues"
    else
        echo -e "${RED}  ❌ Nenhuma fila encontrada${NC}"
    fi
}

# Função para verificar saúde do LocalStack
check_localstack_health() {
    echo -e "${BLUE}🏥 Verificando saúde do LocalStack...${NC}"
    
    # Testar se DynamoDB está funcionando
    local dynamodb_works=$(aws --endpoint-url=$ENDPOINT_URL dynamodb list-tables --region $REGION 2>/dev/null | grep -c "TableNames")
    
    # Testar se SQS está funcionando
    local sqs_works=$(aws --endpoint-url=$ENDPOINT_URL sqs list-queues --region $REGION 2>/dev/null | grep -c "QueueUrls\|{}")
    
    if [ "$dynamodb_works" -gt 0 ] && [ "$sqs_works" -gt 0 ]; then
        echo -e "${GREEN}  ✅ LocalStack respondendo${NC}"
        echo -e "${GREEN}    ✅ dynamodb: disponível${NC}"
        echo -e "${GREEN}    ✅ sqs: disponível${NC}"
    elif [ "$dynamodb_works" -gt 0 ]; then
        echo -e "${YELLOW}  ⚠️ LocalStack parcialmente funcionando${NC}"
        echo -e "${GREEN}    ✅ dynamodb: disponível${NC}"
        echo -e "${RED}    ❌ sqs: indisponível${NC}"
    elif [ "$sqs_works" -gt 0 ]; then
        echo -e "${YELLOW}  ⚠️ LocalStack parcialmente funcionando${NC}"
        echo -e "${RED}    ❌ dynamodb: indisponível${NC}"
        echo -e "${GREEN}    ✅ sqs: disponível${NC}"
    else
        echo -e "${RED}  ❌ LocalStack não está respondendo${NC}"
        echo -e "${RED}    ❌ dynamodb: indisponível${NC}"
        echo -e "${RED}    ❌ sqs: indisponível${NC}"
    fi
}

# Função para mostrar resumo de recursos
show_resources_summary() {
    echo -e "${BLUE}📋 Resumo dos recursos:${NC}"
    echo ""
    
    # Contar tabelas ativas
    local active_tables=0
    local tables=("Users" "Product" "Orders")
    
    for table in "${tables[@]}"; do
        local status=$(aws --endpoint-url=$ENDPOINT_URL dynamodb describe-table \
            --table-name $table --region $REGION 2>/dev/null | \
            grep -o '"TableStatus"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4)
        
        if [ "$status" = "ACTIVE" ]; then
            ((active_tables++))
        fi
    done
    
    # Contar filas
    local queue_count=$(aws --endpoint-url=$ENDPOINT_URL sqs list-queues \
        --region $REGION 2>/dev/null | grep -c "http://" || echo "0")
    
    echo -e "  📊 Tabelas DynamoDB: $active_tables/3"
    echo -e "  📨 Filas SQS: $queue_count"
    
    if [ "$active_tables" -eq 3 ] && [ "$queue_count" -gt 0 ]; then
        echo -e "${GREEN}  🎉 Ambiente configurado corretamente!${NC}"
    else
        echo -e "${YELLOW}  ⚠️ Configuração incompleta${NC}"
        echo -e "${YELLOW}  💡 Execute: ./scripts/localstack.sh setup${NC}"
    fi
}

# Função principal
main() {
    echo -e "${BLUE}🔍 Verificando recursos do LocalStack...${NC}"
    echo ""
    
    check_localstack_health
    echo ""
    
    check_dynamodb_tables
    echo ""
    
    check_sqs_queues
    echo ""
    
    show_resources_summary
}

main 