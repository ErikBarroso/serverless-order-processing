#!/bin/bash

# Script para testar autenticação da API

API_URL="http://localhost:3000"
TEST_EMAIL="teste@localstack.com"
TEST_PASSWORD="12345678"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔐 Testando autenticação...${NC}"

# Teste de login
echo -e "${BLUE}📋 Testando login...${NC}"
response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
    -X POST "$API_URL/api/login" \
    -H "Content-Type: application/json" \
    -d '{"email": "'$TEST_EMAIL'", "password": "'$TEST_PASSWORD'"}')

# Extrair status code e body
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Login bem-sucedido!${NC}"
    
    # Extrair token - a resposta tem formato: {"data":{"accessToken":"..."}}
    token=$(echo $body | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$token" ]; then
        echo -e "${YELLOW}🎫 Token obtido: ${token:0:20}...${NC}"
        
        # Teste de rota protegida - usar endpoint de pedidos que requer autenticação
        echo -e "${BLUE}🔒 Testando rota protegida (/api/products/name/Mouse%20Gamer)...${NC}"
        auth_response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
            -X GET "$API_URL/api/products/name/Mouse%20Gamer" \
            -H "Authorization: $token")
        
        auth_http_code=$(echo $auth_response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
        auth_body=$(echo $auth_response | sed -e 's/HTTPSTATUS:.*//g')
        
        if [ "$auth_http_code" -eq 200 ]; then
            echo -e "${GREEN}✅ Acesso a rota protegida funcionando!${NC}"
        else
            echo -e "${RED}❌ Falha ao acessar rota protegida (status: $auth_http_code)${NC}"
            echo -e "${RED}Resposta: $auth_body${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Token não encontrado na resposta${NC}"
        echo -e "${YELLOW}Resposta completa: $body${NC}"
    fi
else
    echo -e "${RED}❌ Falha no login (status: $http_code)${NC}"
    echo -e "${RED}Resposta: $body${NC}"
fi

echo -e "${BLUE}🧪 Teste de autenticação concluído!${NC}" 