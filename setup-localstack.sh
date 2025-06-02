#!/bin/bash

echo "🚀 Configurando LocalStack para desenvolvimento..."

# Configurações
ENDPOINT_URL="http://localhost:4566"
REGION="us-east-1"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se tabela existe
check_table_exists() {
    local table_name=$1
    aws --endpoint-url=$ENDPOINT_URL dynamodb describe-table --table-name $table_name --region $REGION &>/dev/null
    return $?
}

# Função para criar tabela Users
create_users_table() {
    echo -e "${BLUE}📝 Criando tabela Users...${NC}"
    
    aws --endpoint-url=$ENDPOINT_URL dynamodb create-table \
        --table-name Users \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
            AttributeName=email,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --global-secondary-indexes \
            "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
        --provisioned-throughput \
            ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region $REGION > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Tabela Users criada com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro ao criar tabela Users${NC}"
    fi
}

# Função para criar tabela Product
create_product_table() {
    echo -e "${BLUE}📝 Criando tabela Product...${NC}"
    
    aws --endpoint-url=$ENDPOINT_URL dynamodb create-table \
        --table-name Product \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
            AttributeName=name,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --global-secondary-indexes \
            "IndexName=NameIndex,KeySchema=[{AttributeName=name,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
        --provisioned-throughput \
            ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region $REGION > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Tabela Product criada com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro ao criar tabela Product${NC}"
    fi
}

# Função para criar tabela Orders
create_orders_table() {
    echo -e "${BLUE}📝 Criando tabela Orders...${NC}"
    
    aws --endpoint-url=$ENDPOINT_URL dynamodb create-table \
        --table-name Orders \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
            AttributeName=customerId,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
            AttributeName=customerId,KeyType=RANGE \
        --global-secondary-indexes \
            "IndexName=customerId-index,KeySchema=[{AttributeName=customerId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
        --provisioned-throughput \
            ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region $REGION > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Tabela Orders criada com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro ao criar tabela Orders${NC}"
    fi
}

# Função para criar fila SQS
create_sqs_queue() {
    echo -e "${BLUE}📝 Criando fila SQS...${NC}"
    
    aws --endpoint-url=$ENDPOINT_URL sqs create-queue \
        --queue-name order-processing-queue \
        --region $REGION > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Fila SQS criada com sucesso!${NC}"
    else
        echo -e "${RED}❌ Erro ao criar fila SQS${NC}"
    fi
}

# Função para inserir produtos de teste
insert_test_products() {
    echo -e "${BLUE}🛍️ Criando produtos de teste...${NC}"
    
    local products=(
        '{"id": {"S": "f09c7319-1240-4d8f-b6ea-b7af16870665"}, "name": {"S": "Notebook Dell"}, "price": {"N": "2500.99"}, "stock": {"N": "10"}}'
        '{"id": {"S": "a1b2c3d4-5678-9abc-def0-123456789abc"}, "name": {"S": "Mouse Gamer"}, "price": {"N": "89.90"}, "stock": {"N": "50"}}'
        '{"id": {"S": "b2c3d4e5-6789-abcd-ef01-23456789abcd"}, "name": {"S": "Teclado Mecânico"}, "price": {"N": "299.99"}, "stock": {"N": "25"}}'
        '{"id": {"S": "c3d4e5f6-789a-bcde-f012-3456789abcde"}, "name": {"S": "Monitor 24 polegadas"}, "price": {"N": "899.00"}, "stock": {"N": "15"}}'
    )
    
    for product in "${products[@]}"; do
        aws --endpoint-url=$ENDPOINT_URL dynamodb put-item \
            --table-name Product \
            --item "$product" \
            --region $REGION > /dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}  ✅ Produto criado${NC}"
        else
            echo -e "${RED}  ❌ Erro ao criar produto${NC}"
        fi
    done
}

# Função principal
main() {
    echo -e "${BLUE}🔍 Verificando se LocalStack está rodando...${NC}"
    
    # Verificar se LocalStack está ativo
    if ! curl -s $ENDPOINT_URL/health > /dev/null; then
        echo -e "${RED}❌ LocalStack não está rodando!${NC}"
        echo -e "${YELLOW}💡 Execute: docker-compose up -d${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ LocalStack está ativo!${NC}"
    echo ""
    
    # Verificar e criar tabelas
    echo -e "${BLUE}📊 Verificando tabelas DynamoDB...${NC}"
    
    if check_table_exists "Users"; then
        echo -e "${GREEN}✅ Tabela Users já existe${NC}"
    else
        create_users_table
        sleep 2
    fi
    
    if check_table_exists "Product"; then
        echo -e "${GREEN}✅ Tabela Product já existe${NC}"
    else
        create_product_table
        sleep 2
    fi
    
    if check_table_exists "Orders"; then
        echo -e "${GREEN}✅ Tabela Orders já existe${NC}"
    else
        create_orders_table
        sleep 2
    fi
    
    # Verificar e criar fila SQS
    echo -e "${BLUE}📨 Verificando fila SQS...${NC}"
    
    local queue_exists=$(aws --endpoint-url=$ENDPOINT_URL sqs list-queues --region $REGION 2>/dev/null | grep "order-processing-queue")
    if [ -n "$queue_exists" ]; then
        echo -e "${GREEN}✅ Fila SQS já existe${NC}"
    else
        create_sqs_queue
    fi
    
    # Aguardar tabelas ficarem ativas
    echo -e "${BLUE}⏳ Aguardando tabelas ficarem ativas...${NC}"
    sleep 5
    
    # Inserir dados de teste
    echo -e "${BLUE}🎯 Inserindo dados de teste...${NC}"
    insert_test_user
    insert_test_products
    
    echo ""
    echo -e "${GREEN}🎉 LocalStack configurado com sucesso!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Resumo:${NC}"
    echo -e "  • Tabelas: Users, Product, Orders"
    echo -e "  • Índices: email-index, NameIndex, customerId-index"
    echo -e "  • Fila SQS: order-processing-queue"
    echo -e "  • Usuário de teste: teste@localstack.com / 12345678"
    echo -e "  • 4 produtos de teste criados"
    echo ""
    echo -e "${BLUE}🧪 Para testar:${NC}"
    echo -e "  curl -X POST http://localhost:3000/api/login -H \"Content-Type: application/json\" -d '{\"email\": \"teste@localstack.com\", \"password\": \"12345678\"}'"
}

# Executar função principal
main 