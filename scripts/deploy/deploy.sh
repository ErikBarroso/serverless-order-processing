#!/bin/bash

# Parar o script em caso de erro
set -e

# Carregar variáveis de ambiente
source .env

# Definir variáveis
IMAGE_NAME="erikbarroso/order-api"
TAG="latest"
AWS_REGION="us-east-2"
CLUSTER_NAME="order-api"
SERVICE_NAME="service-order-api"
TASK_DEFINITION="task-order-api"

echo "🔨 Build do código TypeScript..."
npm run build

echo "🐳 Construindo a imagem Docker..."
docker build -t $IMAGE_NAME:$TAG -f Dockerfile.production .

echo "🔑 Fazendo login no Docker Hub..."
docker login --username $DOCKER_HUB_USERNAME --password $DOCKER_HUB_TOKEN

echo "🚀 Fazendo push da imagem para o Docker Hub..."
docker push $IMAGE_NAME:$TAG

# Passo 5: Atualizar a task definition no ECS
echo "🔄 Atualizando a task definition no ECS..."
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --task-definition $TASK_DEFINITION \
  --force-new-deployment \
  --region $AWS_REGION

echo "✅ Deploy concluído com sucesso!"