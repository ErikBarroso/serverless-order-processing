#!/bin/bash

# Script para deploy da infraestrutura AWS

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variáveis de ambiente
AWS_REGION="${AWS_REGION:-us-east-2}"
ENVIRONMENT="${ENVIRONMENT:-staging}"
PROJECT_NAME="serverless-order-processing"

echo -e "${BLUE}🏗️ Deploying AWS Infrastructure...${NC}"
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Region: $AWS_REGION${NC}"

# Função para criar tabelas DynamoDB
create_dynamodb_tables() {
    echo -e "${BLUE}📊 Criando tabelas DynamoDB...${NC}"
    
    # Tabela Users
    echo -e "${BLUE}  📝 Criando tabela Users-${ENVIRONMENT}...${NC}"
    aws dynamodb create-table \
        --table-name "Users-${ENVIRONMENT}" \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
            AttributeName=email,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --global-secondary-indexes \
            "IndexName=email-index,KeySchema=[{AttributeName=email,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
        --provisioned-throughput \
            ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region $AWS_REGION \
        --tags "Key=Environment,Value=${ENVIRONMENT}" "Key=Project,Value=${PROJECT_NAME}" || echo "Tabela já existe"

    # Tabela Product
    echo -e "${BLUE}  📝 Criando tabela Product-${ENVIRONMENT}...${NC}"
    aws dynamodb create-table \
        --table-name "Product-${ENVIRONMENT}" \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
            AttributeName=name,AttributeType=S \
        --key-schema \
            AttributeName=id,KeyType=HASH \
        --global-secondary-indexes \
            "IndexName=NameIndex,KeySchema=[{AttributeName=name,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}" \
        --provisioned-throughput \
            ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region $AWS_REGION \
        --tags "Key=Environment,Value=${ENVIRONMENT}" "Key=Project,Value=${PROJECT_NAME}" || echo "Tabela já existe"

    # Tabela Orders
    echo -e "${BLUE}  📝 Criando tabela Orders-${ENVIRONMENT}...${NC}"
    aws dynamodb create-table \
        --table-name "Orders-${ENVIRONMENT}" \
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
        --region $AWS_REGION \
        --tags "Key=Environment,Value=${ENVIRONMENT}" "Key=Project,Value=${PROJECT_NAME}" || echo "Tabela já existe"
}

# Função para criar filas SQS
create_sqs_queues() {
    echo -e "${BLUE}📨 Criando filas SQS...${NC}"
    
    # Fila principal
    echo -e "${BLUE}  📝 Criando fila order-processing-queue-${ENVIRONMENT}...${NC}"
    aws sqs create-queue \
        --queue-name "order-processing-queue-${ENVIRONMENT}" \
        --attributes '{
            "VisibilityTimeoutSeconds": "60",
            "MessageRetentionPeriod": "1209600",
            "DelaySeconds": "0",
            "ReceiveMessageWaitTimeSeconds": "20"
        }' \
        --region $AWS_REGION \
        --tags "Environment=${ENVIRONMENT},Project=${PROJECT_NAME}" || echo "Fila já existe"

    # Dead Letter Queue
    echo -e "${BLUE}  📝 Criando DLQ order-processing-dlq-${ENVIRONMENT}...${NC}"
    aws sqs create-queue \
        --queue-name "order-processing-dlq-${ENVIRONMENT}" \
        --attributes '{
            "MessageRetentionPeriod": "1209600"
        }' \
        --region $AWS_REGION \
        --tags "Environment=${ENVIRONMENT},Project=${PROJECT_NAME}" || echo "DLQ já existe"
}

# Função para criar políticas IAM
create_iam_policies() {
    echo -e "${BLUE}🔐 Criando políticas IAM...${NC}"
    
    # Política para Lambda
    cat > /tmp/lambda-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:${AWS_REGION}:*:table/*-${ENVIRONMENT}",
                "arn:aws:dynamodb:${AWS_REGION}:*:table/*-${ENVIRONMENT}/index/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "sqs:ReceiveMessage",
                "sqs:DeleteMessage",
                "sqs:SendMessage",
                "sqs:GetQueueAttributes"
            ],
            "Resource": "arn:aws:sqs:${AWS_REGION}:*:*-${ENVIRONMENT}"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF

    aws iam create-policy \
        --policy-name "${PROJECT_NAME}-lambda-policy-${ENVIRONMENT}" \
        --policy-document file:///tmp/lambda-policy.json \
        --description "Policy for ${PROJECT_NAME} Lambda functions in ${ENVIRONMENT}" || echo "Política já existe"
}

# Função principal
main() {
    echo -e "${BLUE}🚀 Iniciando deploy da infraestrutura...${NC}"
    
    # Verificar se AWS CLI está configurado
    if ! aws sts get-caller-identity &>/dev/null; then
        echo -e "${RED}❌ AWS CLI não está configurado${NC}"
        exit 1
    fi
    
    create_dynamodb_tables
    sleep 5
    
    create_sqs_queues
    sleep 2
    
    create_iam_policies
    
    echo -e "${GREEN}✅ Deploy da infraestrutura concluído!${NC}"
    echo -e "${YELLOW}💡 Aguarde alguns minutos para que todos os recursos estejam disponíveis${NC}"
}

main "$@" 