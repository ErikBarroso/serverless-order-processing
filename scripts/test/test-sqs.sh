#!/bin/bash

# Script para testar processamento de mensagens SQS

ENDPOINT_URL="http://localhost:4566"
QUEUE_URL="http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-processing-queue"
REGION="us-east-1"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# IDs de teste (usuário e produto existentes)
TEST_USER_ID="11f23291-fbbb-4e5c-8548-08a793295c20"
TEST_PRODUCT_ID="f09c7319-1240-4d8f-b6ea-b7af16870665"

# Função para gerar UUID simples
generate_uuid() {
    cat /proc/sys/kernel/random/uuid
}

# Função para enviar mensagem de teste
send_test_message() {
    local order_id=$(generate_uuid)
    local timestamp=$(date -Iseconds)
    
    echo -e "${BLUE}📤 Enviando mensagem de teste para SQS...${NC}"
    echo -e "${YELLOW}Order ID: $order_id${NC}"
    
    aws --endpoint-url=$ENDPOINT_URL sqs send-message \
        --queue-url "$QUEUE_URL" \
        --message-body '{
            "id": "'$order_id'",
            "customerId": "'$TEST_USER_ID'", 
            "orderStatus": "PENDING",
            "items": ["'$TEST_PRODUCT_ID'", "'$TEST_PRODUCT_ID'"],
            "createdAt": "'$timestamp'"
        }' \
        --region $REGION > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Mensagem enviada com sucesso!${NC}"
        return 0
    else
        echo -e "${RED}❌ Erro ao enviar mensagem${NC}"
        return 1
    fi
}

# Função para verificar mensagens na fila
check_queue_messages() {
    echo -e "${BLUE}📋 Verificando mensagens na fila...${NC}"
    
    local response=$(aws --endpoint-url=$ENDPOINT_URL sqs receive-message \
        --queue-url "$QUEUE_URL" \
        --region $REGION 2>/dev/null)
    
    if echo "$response" | grep -q "Messages"; then
        echo -e "${YELLOW}📨 Mensagens encontradas na fila${NC}"
        echo "$response"
    else
        echo -e "${GREEN}✅ Fila vazia (mensagens foram processadas)${NC}"
    fi
}

# Função para verificar aproximadamente quantas mensagens estão na fila
get_queue_attributes() {
    echo -e "${BLUE}📊 Obtendo atributos da fila...${NC}"
    
    aws --endpoint-url=$ENDPOINT_URL sqs get-queue-attributes \
        --queue-url "$QUEUE_URL" \
        --attribute-names ApproximateNumberOfMessages \
        --region $REGION 2>/dev/null | \
        grep -o '"ApproximateNumberOfMessages":"[0-9]*"' | \
        cut -d'"' -f4
}

# Função para monitorar processamento
monitor_processing() {
    echo -e "${BLUE}👀 Monitorando processamento (30s)...${NC}"
    
    for i in {1..6}; do
        local count=$(get_queue_attributes)
        echo -e "${YELLOW}[${i}/6] Mensagens na fila: ${count:-"N/A"}${NC}"
        
        if [ "$count" = "0" ]; then
            echo -e "${GREEN}✅ Todas as mensagens foram processadas!${NC}"
            break
        fi
        
        sleep 5
    done
}

# Função principal
main() {
    echo -e "${BLUE}🧪 Testando processamento SQS...${NC}"
    echo ""
    
    # Verificar se fila existe
    local queue_exists=$(aws --endpoint-url=$ENDPOINT_URL sqs list-queues --region $REGION 2>/dev/null | grep "order-processing-queue")
    
    if [ -z "$queue_exists" ]; then
        echo -e "${RED}❌ Fila SQS não encontrada!${NC}"
        echo -e "${YELLOW}💡 Execute: ./scripts/localstack.sh setup${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Fila SQS encontrada${NC}"
    
    # Estado inicial da fila
    local initial_count=$(get_queue_attributes)
    echo -e "${BLUE}📊 Mensagens na fila: ${initial_count:-"0"}${NC}"
    
    # Enviar mensagem de teste
    send_test_message
    
    echo ""
    echo -e "${YELLOW}⏳ Aguardando worker processar (o worker roda a cada 30s)...${NC}"
    echo -e "${YELLOW}💡 Verifique os logs da API: docker-compose logs -f api${NC}"
    
    # Monitorar processamento
    monitor_processing
    
    echo ""
    echo -e "${BLUE}🏁 Teste de SQS concluído!${NC}"
}

main 