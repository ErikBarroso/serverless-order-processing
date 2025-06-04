# 🛍️ Serverless Order Processing System

Serverless order processing system built with **Node.js**, **TypeScript**, and **AWS services**. Designed for high scalability, reliability, and maintainability using Clean Architecture principles.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#-architecture)
- [⚡ Features](#-features)
- [🔧 Technology Stack](#-technology-stack)
- [🚀 Quick Start](#-quick-start)
- [📚 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [📊 Monitoring](#-monitoring)

## 🎯 Overview

This system provides a comprehensive solution for order processing in serverless environments, featuring:

- **RESTful APIs** for user, product, and order management
- **Real-time order processing** with SQS message queues
- **Scalable architecture** supporting high throughput
- **Cloud-native design** with AWS Lambda and DynamoDB
- **Clean Architecture** principles for maintainability
- **Comprehensive testing** with unit and integration tests

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   Lambda        │    │   SQS Queues    │    │   API            │
│   (Order        │    │                 │    │                  │
│   Creation)     │───►│ • Order Queue   │───►│                  │
│                 │    │ • Dead Letter Q │    │ • Users API      │
│ • Create Orders │    │ • Priority Queue│    │ • Products API   │
│ • Send to SQS   │    │                 │    │ • Orders API     │
└─────────────────┘    └─────────────────┘    │ • Queue Consumer │
         │                       │            └──────────────────┘
         ▼                       ▼                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DynamoDB      │    │   Worker Pool   │    │   Monitoring    │
│                 │    │   (Processing)  │    │                 │
│ • Users Table   │◄──►│                 │◄──►│ • New Relic     │
│ • Products Table│    │ • Order Worker  │    │ • CloudWatch    │
│ • Orders Table  │    │ • Retry Logic   │    │ • Metrics       │
└─────────────────┘    │ • Error Handling│    └─────────────────┘
                       └─────────────────┘
```

### Clean Architecture Layers
```
┌─────────────────────────────────────────┐
│              Presentation               │
│         (Controllers, Routes)           │
├─────────────────────────────────────────┤
│                Use Cases                │
│         (Business Logic)                │
├─────────────────────────────────────────┤
│              Domain Layer               │
│        (Entities, Interfaces)           │
├─────────────────────────────────────────┤
│             Infrastructure              │
│    (Database, External Services)        │
└─────────────────────────────────────────┘
```

## ⚡ Features

### Core Features
- ✅ **User Management** - Registration, authentication, profile management
- ✅ **Product Catalog** - CRUD operations with inventory tracking
- ✅ **Order Processing** - Order creation, status tracking, history
- ✅ **Asynchronous Processing** - SQS-based order workflow
- ✅ **Real-time Monitoring** - New Relic integration

### Advanced Features  
- 🔒 **JWT Authentication** - Secure token-based authentication
- 📊 **Performance Monitoring** - Application metrics and alerts
- 🔄 **Retry Logic** - Automatic retry with exponential backoff
- 🚨 **Error Handling** - Comprehensive error tracking and logging
- 📈 **Scalability** - Auto-scaling based on demand

## 🔧 Technology Stack

### Core Technologies
| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Node.js | ≥14.0 | JavaScript runtime |
| **Language** | TypeScript | ^5.7 | Type-safe development |
| **Framework** | Express.js | ^4.21 | Web application framework |
| **Database** | DynamoDB | Latest | NoSQL database |
| **Queue** | Amazon SQS | Latest | Message processing |
| **Computing** | AWS Lambda | Latest | Serverless functions |

### Development Tools
| Tool | Version | Purpose |
|------|---------|---------|
| Jest | ^29.7 | Testing framework |
| ESLint | ^9.21 | Code linting |
| Docker | Latest | Containerization |
| LocalStack | Latest | Local AWS emulation |
| GitHub Actions | Latest | CI/CD pipeline |

### Monitoring & Observability
- **New Relic** - Application performance monitoring
- **CloudWatch** - Logs and metrics
- **AWS X-Ray** - Distributed tracing (planned)

## 🚀 Quick Start

### Prerequisites
- Node.js ≥14.0
- Docker & Docker Compose
- AWS CLI (for production deployment)
- Git

### 1. Clone & Install
```bash
# Clone repository
git clone https://github.com/username/serverless-order-processing.git
cd serverless-order-processing

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure your environment variables
# Required: JWT_SECRET, NEW_RELIC_LICENSE_KEY
```

### 3. Start Development Environment
```bash
# Start complete development stack
make dev

# Alternative: Manual start
docker-compose up -d
make setup
```

### 4. Verify Installation
```bash
# Check API health
curl http://localhost:3000/

# Run tests
npm test

# Check infrastructure
make status
```

**🎉 Your API is now running at `http://localhost:3000`**

## 📚 API Documentation

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints Overview

#### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/login` | User authentication | No |

#### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | List all users | Yes |

#### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | List all products | No |
| POST | `/api/products` | Create new product | Yes |
| GET | `/api/products/:id` | Get product by ID | Yes |
| GET | `/api/products/name/:name` | Get product by name | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |

#### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | List orders | Yes |
| POST | `/api/orders` | Create new order | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |
| DELETE | `/api/orders/:id` | Cancel order | Yes |
| POST | `/api/orders/process-queue` | Manual queue processing | Yes |

### Example Requests

#### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": ["product-id-1", "product-id-2"]
  }'
```

#### Response Format
```json
{
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "id": "order-id",
    "customerId": "customer-id",
    "items": ["product-id-1", "product-id-2"],
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🧪 Testing

### Test Structure
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── http/           # HTTP client tests
└── utils/          # Test utilities
```

### Running Tests
```bash
# Run all tests with coverage
npm test

# Run specific test types
npm run test:unit
npm run test:integration

# Watch mode for development
npm test -- --watch
```

### Test Commands via Make
```bash
# Comprehensive testing
make test

# Specific test suites
make test-auth      # Authentication tests
make test-sqs       # SQS processing tests
make test-api       # API endpoint tests
```

### Coverage Reports
- HTML reports: `coverage/lcov-report/index.html`
- Coverage threshold: 80% minimum
- Automated coverage reporting via CI/CD

## 🚢 Deployment

### Local Development
```bash
# Start development environment
make dev

# Reset environment
make reset

# View logs
make logs
```

### Staging Deployment
```bash
# Deploy to staging
make deploy-staging

# Deploy specific components
make deploy-infrastructure ENV=staging
make deploy-api ENV=staging
make deploy-lambda ENV=staging
```

### Production Deployment
```bash
# Full production deployment
make deploy-prod

# Infrastructure only
make deploy-infrastructure ENV=production

# Rollback if needed
make rollback ENV=production COMPONENT=api VERSION=v1.2.3
```

### Environment Variables

#### Required
- `JWT_SECRET` - JWT signing secret
- `NEW_RELIC_LICENSE_KEY` - New Relic monitoring

#### Optional
- `NODE_ENV` - Environment (development/staging/production)
- `PORT` - API port (default: 3000)
- `AWS_REGION` - AWS region (default: us-east-1)

### CI/CD Pipeline
- **GitHub Actions** workflows for automated testing

## 📊 Monitoring

### Application Monitoring
- **New Relic** - Performance metrics, error tracking, transaction tracing
- **CloudWatch** - AWS service metrics and logs

## 📁 Project Structure

```
serverless-order-processing/
├── lambdas/                # AWS Lambda functions
├── scripts/                # Automation scripts
    |── deploy/                 # Deployment configurations
├── src/
│   ├── domain/              # Business logic and entities
│   ├── use-cases/           # Application use cases
│   ├── infrastructure/      # External services integration
│   ├── presentation/        # Controllers and routes
│   ├── main/               # Application configuration
│   └── config/             # Configuration files
├── tests/                  # Test files
├── docs/                   # Documentation
└── .github/               # GitHub workflows
```
