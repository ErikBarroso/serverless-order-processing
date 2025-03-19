#!/bin/bash

# Parar o script em caso de erro
set -e

# Carregar variáveis de ambiente
source .env

# Definir variáveis
IMAGE_NAME="erikbarroso/order-api"
TAG="$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)"
AWS_REGION="us-east-2"
CLUSTER_NAME="order-api"
SERVICE_NAME="service-order-api"

# Passo 1: Build do código TypeScript
echo "🔨 Build do código TypeScript..."
npm run build

# Passo 2: Construir a imagem Docker
echo "🐳 Construindo a imagem Docker..."
docker build -t $IMAGE_NAME:$TAG -f Dockerfile.production .

# Passo 3: Fazer login no Docker Hub (se necessário)
echo "🔑 Fazendo login no Docker Hub..."
docker login --username $DOCKER_HUB_USERNAME --password $DOCKER_HUB_TOKEN

# Passo 4: Fazer push da imagem para o Docker Hub
echo "🚀 Fazendo push da imagem para o Docker Hub..."
docker push $IMAGE_NAME:$TAG

# Passo 5: Atualizar a task definition no ECS
echo "🔄 Atualizando a task definition no ECS..."
aws ecs register-task-definition \
  --family task-order-api \
  --container-definitions '[{
      "name": "container-order-api",
      "image": "'$IMAGE_NAME':'$TAG'",
      "memory": 350,
      "cpu": 350,
      "essential": true,
      "portMappings": [{
          "containerPort": 3000,
          "hostPort": 3000
      }]
  }]' \
  --region $AWS_REGION

# Passo 6: Forçar uma nova implantação no serviço do ECS
echo "🚀 Forçando uma nova implantação no ECS..."
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --task-definition task-order-api \
  --force-new-deployment \
  --region $AWS_REGION

echo "✅ Deploy concluído com sucesso!"