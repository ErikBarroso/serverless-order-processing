#!/bin/bash

# Script para criar tabelas DynamoDB no LocalStack

ENDPOINT_URL="http://localhost:4566"
REGION="us-east-1"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Função para verificar se tabela existe
check_table_exists() {
    local table_name=$1
    aws --endpoint-url=$ENDPOINT_URL dynamodb describe-table --table-name $table_name --region $REGION &>/dev/null
    return $?
}

# Criar tabela Users
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
        echo -e "${GREEN}✅ Tabela Users criada${NC}"
    else
        echo -e "${RED}❌ Erro ao criar tabela Users${NC}"
    fi
}

# Criar tabela Product
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
        echo -e "${GREEN}✅ Tabela Product criada${NC}"
    else
        echo -e "${RED}❌ Erro ao criar tabela Product${NC}"
    fi
}

# Criar tabela Orders
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
        echo -e "${GREEN}✅ Tabela Orders criada${NC}"
    else
        echo -e "${RED}❌ Erro ao criar tabela Orders${NC}"
    fi
}

# Criar fila SQS
create_sqs_queue() {
    echo -e "${BLUE}📝 Criando fila SQS...${NC}"
    
    aws --endpoint-url=$ENDPOINT_URL sqs create-queue \
        --queue-name order-processing-queue \
        --region $REGION > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Fila SQS criada${NC}"
    else
        echo -e "${RED}❌ Erro ao criar fila SQS${NC}"
    fi
}

# Função principal
main() {
    echo -e "${BLUE}🏗️ Inicializando tabelas e recursos...${NC}"
    
    # Verificar e criar tabelas
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
    local queue_exists=$(aws --endpoint-url=$ENDPOINT_URL sqs list-queues --region $REGION 2>/dev/null | grep "order-processing-queue")
    if [ -n "$queue_exists" ]; then
        echo -e "${GREEN}✅ Fila SQS já existe${NC}"
    else
        create_sqs_queue
    fi
    
    echo -e "${GREEN}🎉 Recursos criados com sucesso!${NC}"
}

main 