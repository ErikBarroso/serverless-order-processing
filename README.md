# Serverless Order Processing

Sistema serverless para processamento de pedidos construído com Node.js, Express e TypeScript, utilizando arquitetura limpa e DynamoDB como banco de dados.

## 📋 Visão Geral

Este projeto implementa um sistema de processamento de pedidos com arquitetura serverless, oferecendo APIs RESTful para gerenciamento de usuários, produtos e pedidos. O sistema utiliza AWS Lambda e DynamoDB para uma solução escalável e de baixo custo.

## 🏗️ Arquitetura

O projeto segue os princípios da Arquitetura Limpa (Clean Architecture) com as seguintes camadas:

- **Domain**: Entidades e regras de negócio
- **Use Cases**: Casos de uso da aplicação
- **Infrastructure**: Implementações concretas (repositórios, ferramentas externas)
- **Presentation**: Controllers e middlewares da API
- **Main**: Configuração e inicialização da aplicação

## 🔧 Tecnologias Utilizadas

- **Node.js** e **TypeScript**
- **Express**: Framework web
- **AWS DynamoDB**: Banco de dados NoSQL
- **Jest**: Framework de testes
- **Docker**: Containerização
- **LocalStack**: Emulação de serviços AWS localmente
- **New Relic**: Monitoramento de desempenho

## 🚀 Começando

### Pré-requisitos

- Node.js (v14+)
- Docker e Docker Compose
- AWS CLI (para deploy)

### Instalação e Execução Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/serverless-order-processing.git
   cd serverless-order-processing
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o ambiente local com Docker Compose:
   ```bash
   docker-compose up
   ```

4. A API estará disponível em: `http://localhost:3000`

## 📊 Endpoints da API (Somente Ambiente Local)

### Autenticação
- `POST /api/login`: Login de usuário


### Usuários
- `GET /api/users`: Lista todos os usuários
- `GET /api/users/:id`: Busca usuário por ID

### Produtos
- `GET /api/products`: Lista todos os produtos
- `POST /api/products`: Cria novo produto
- `GET /api/products/:id`: Busca produto por ID
- `PUT /api/products/:id`: Atualiza produto
- `DELETE /api/products/:id`: Remove produto

### Pedidos
- `GET /api/orders`: Lista todos os pedidos
- `POST /api/orders`: Cria novo pedido
- `GET /api/orders/:id`: Busca pedido por ID
- `DELETE /api/orders/:id`: Remove pedido

## 🧪 Testes

O projeto inclui testes unitários e de integração:

```bash
# Executar todos os testes
npm test

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração
npm run test:integration
```

## 🛠️ Ambiente de Desenvolvimento

O projeto usa Docker Compose para configurar um ambiente de desenvolvimento local que inclui:
- API Node.js
- LocalStack para emular serviços AWS (DynamoDB, EC2)

### Desenvolvimento Futuro

Atualmente em planejamento:
- Implementação em AWS Lambda
- Configuração de CI/CD
- Deploy em ambiente de produção

## 📘 Licença

Este projeto está licenciado sob a licença ISC.