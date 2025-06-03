#!/bin/bash

# Script para inserir dados de teste no LocalStack

ENDPOINT_URL="http://localhost:4566"
REGION="us-east-1"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Dados do usuário de teste
TEST_USER_ID="11f23291-fbbb-4e5c-8548-08a793295c20"
TEST_USER_EMAIL="teste@localstack.com"
TEST_USER_PASSWORD="12345678"
# Hash bcrypt da senha "12345678"
TEST_USER_HASH="$2b$10$xK6iQYTFlEjGJwdhrmrac.ySlZhfSKGVLD4vgCiuqWgBG4MOR3hs."

# Função para inserir usuário de teste
insert_test_user() {
    echo -e "${BLUE}👤 Criando usuário de teste...${NC}"
    
    aws --endpoint-url=$ENDPOINT_URL dynamodb put-item \
        --table-name Users \
        --item '{
            "id": {"S": "'$TEST_USER_ID'"},
            "name": {"S": "Usuário Teste"},
            "email": {"S": "'$TEST_USER_EMAIL'"},
            "password": {"S": "'$TEST_USER_HASH'"}
        }' \
        --region $REGION > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Usuário de teste criado!${NC}"
        echo -e "${YELLOW}📧 Email: $TEST_USER_EMAIL${NC}"
        echo -e "${YELLOW}🔑 Senha: $TEST_USER_PASSWORD${NC}"
        echo -e "${YELLOW}🆔 ID: $TEST_USER_ID${NC}"
    else
        echo -e "${RED}❌ Erro ao criar usuário de teste${NC}"
    fi
}

# Função para inserir produtos de teste
insert_test_products() {
    echo -e "${BLUE}🛍️ Criando produtos de teste...${NC}"
    
    local products=(
        '{"id": {"S": "f09c7319-1240-4d8f-b6ea-b7af16870665"}, "name": {"S": "notebook dell"}, "price": {"N": "2500.99"}, "stock": {"N": "10"}}'
        '{"id": {"S": "a1b2c3d4-5678-9abc-def0-123456789abc"}, "name": {"S": "mouse gamer"}, "price": {"N": "89.90"}, "stock": {"N": "50"}}'
        '{"id": {"S": "b2c3d4e5-6789-abcd-ef01-23456789abcd"}, "name": {"S": "teclado mecanico"}, "price": {"N": "299.99"}, "stock": {"N": "25"}}'
        '{"id": {"S": "c3d4e5f6-789a-bcde-f012-3456789abcde"}, "name": {"S": "monitor 24 polegadas"}, "price": {"N": "899.00"}, "stock": {"N": "15"}}'
    )
    
    local count=0
    for product in "${products[@]}"; do
        aws --endpoint-url=$ENDPOINT_URL dynamodb put-item \
            --table-name Product \
            --item "$product" \
            --region $REGION > /dev/null
        
        if [ $? -eq 0 ]; then
            ((count++))
            echo -e "${GREEN}  ✅ Produto $count criado${NC}"
        else
            echo -e "${RED}  ❌ Erro ao criar produto $count${NC}"
        fi
    done
    
    echo -e "${GREEN}📦 Total de produtos criados: $count${NC}"
}

# Função para verificar se dados já existem
check_existing_data() {
    # Verificar se usuário já existe
    local user_exists=$(aws --endpoint-url=$ENDPOINT_URL dynamodb get-item \
        --table-name Users \
        --key '{"id": {"S": "'$TEST_USER_ID'"}}' \
        --region $REGION 2>/dev/null | grep -c "Item")
    
    if [ "$user_exists" -gt 0 ]; then
        echo -e "${YELLOW}⚠️ Usuário de teste já existe${NC}"
        return 1
    fi
    
    return 0
}

# Função principal
main() {
    echo -e "${BLUE}🌱 Inserindo dados de teste...${NC}"
    
    # Aguardar tabelas estarem prontas
    echo -e "${BLUE}⏳ Aguardando tabelas ficarem ativas...${NC}"
    sleep 5
    
    # Verificar se dados já existem
    if check_existing_data; then
        insert_test_user
        insert_test_products
        
        echo ""
        echo -e "${GREEN}🎉 Dados de teste inseridos com sucesso!${NC}"
        echo ""
        echo -e "${YELLOW}📋 Credenciais de teste:${NC}"
        echo -e "  Email: $TEST_USER_EMAIL"
        echo -e "  Senha: $TEST_USER_PASSWORD"
        echo ""
        echo -e "${BLUE}🧪 Teste de login:${NC}"
        echo -e "  curl -X POST http://localhost:3000/api/login \\"
        echo -e "    -H \"Content-Type: application/json\" \\"
        echo -e "    -d '{\"email\": \"$TEST_USER_EMAIL\", \"password\": \"$TEST_USER_PASSWORD\"}'"
    else
        echo -e "${YELLOW}ℹ️ Dados já existem, pulando inserção${NC}"
    fi
}

main 