#!/bin/bash

QUEUE_URL="http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/order-processing-queue"

echo "🧪 Enviando mensagem de teste para a fila SQS..."

aws --endpoint-url=http://localhost:4566 sqs send-message \
  --queue-url "$QUEUE_URL" \
  --message-body '{
    "id": "55b79326-396e-4efc-bed8-fc09d52cffd3",
    "customerId": "11f23291-fbbb-4e5c-8548-08a793295c20", 
    "orderStatus": "PENDING",
    "items": ["f09c7319-1240-4d8f-b6ea-b7af16870665", "f09c7319-1240-4d8f-b6ea-b7af16870665"],
    "createdAt": "'$(date -Iseconds)'"
  }' \
  --region us-east-1

echo "✅ Mensagem enviada!"

echo "📋 Verificando mensagens na fila..."
aws --endpoint-url=http://localhost:4566 sqs receive-message \
  --queue-url "$QUEUE_URL" \
  --region us-east-1 