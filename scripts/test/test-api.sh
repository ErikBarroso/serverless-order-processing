#!/bin/bash

# Script para testar endpoints da API

API_URL="http://localhost:3000"
TEST_EMAIL="teste@localstack.com"
TEST_PASSWORD="12345678"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para fazer login e obter token
get_auth_token() {
    local response=$(curl -s -X POST "$API_URL/api/login" \
        -H "Content-Type: application/json" \
        -d '{"email": "'$TEST_EMAIL'", "password": "'$TEST_PASSWORD'"}')
    
    echo "$response" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4
}

# Função para testar endpoint com token
test_endpoint() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local description=$5
    
    echo -e "${BLUE}🧪 Testando: $description${NC}"
    
    local curl_cmd="curl -s -w HTTPSTATUS:%{http_code} -X $method"
    
    if [ -n "$token" ]; then
        curl_cmd="$curl_cmd -H \"Authorization: $token\""
    fi
    
    curl_cmd="$curl_cmd -H \"Content-Type: application/json\""
    
    if [ -n "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    curl_cmd="$curl_cmd \"$API_URL$endpoint\""
    
    local response=$(eval $curl_cmd)
    local http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    local body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}  ✅ Sucesso (status: $http_code)${NC}"
        echo -e "${YELLOW}  📄 Resposta: $body${NC}"
    else
        echo -e "${RED}  ❌ Falhou (status: $http_code)${NC}"
        echo -e "${RED}  📄 Erro: $body${NC}"
    fi
    
    echo ""
}

# Função principal
main() {
    echo -e "${BLUE}🚀 Testando endpoints da API...${NC}"
    echo ""
    
    # Obter token de autenticação
    echo -e "${BLUE}🔐 Fazendo login...${NC}"
    token=$(get_auth_token)
    
    if [ -z "$token" ]; then
        echo -e "${RED}❌ Falha ao obter token de autenticação${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Token obtido: ${token:0:20}...${NC}"
    echo ""
    
    # Testar endpoints públicos
    echo -e "${YELLOW}📋 === ENDPOINTS PÚBLICOS ===${NC}"
    test_endpoint "GET" "/api/products" "" "" "Listar produtos"
    
    # Testar endpoints protegidos
    echo -e "${YELLOW}📋 === ENDPOINTS PROTEGIDOS ===${NC}"
    test_endpoint "GET" "/api/products/name/Mouse%20Gamer" "$token" "" "Produto por nome"
    
    # Testar criação de pedido
    local order_data='{
        "items": [
            "f09c7319-1240-4d8f-b6ea-b7af16870665",
            "a1b2c3d4-5678-9abc-def0-123456789abc"
        ]
    }'
    
    test_endpoint "POST" "/api/orders" "$token" "$order_data" "Criar novo pedido"
    
    # Testar endpoints inexistentes
    echo -e "${YELLOW}📋 === TESTES DE ERRO ===${NC}"
    test_endpoint "GET" "/api/inexistente" "$token" "" "Endpoint inexistente"
    
    echo -e "${GREEN}🎉 Testes de API concluídos!${NC}"
}

main 