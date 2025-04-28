# Serverless Order Processing

Serverless order processing system built with Node.js, Express and TypeScript, using clean architecture and DynamoDB as the database.

## 📋 Overview

This project implements a serverless order processing system, offering RESTful APIs for user, product, and order management. The system uses AWS Lambda and DynamoDB for a scalable and low-cost solution.

## 🏗️ Architecture

The project follows the principles of Clean Architecture with the following layers:

- **Domain**: Entities and business rules
- **Use Cases**: Application use cases
- **Infrastructure**: Concrete implementations (repositories, external tools)
- **Presentation**: API controllers and middlewares
- **Main**: Application configuration and initialization

## 🔧 Technologies Used

- **Node.js** and **TypeScript**
- **Express**: Web Framework
- **AWS DynamoDB**: NoSQL Database
- **Jest**: Testing Framework
- **Docker**: Containerization
- **LocalStack**: Emulation of AWS services locally
- **New Relic**: Performance Monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- Docker and Docker Compose

### Installing and Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/seu-usuario/serverless-order-processing.git
   cd serverless-order-processing
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3.Run the local environment with Docker Compose:
   ```bash
   docker-compose up
   ```

4. The API will be available on: `http://localhost:3000`

## 📊API Endpoints (Local Environment Only)

### Authentication
- `POST /api/login`: User Login


### Users
- `GET /api/users`: List all users
- `GET /api/users/:id`: Search user by ID

### Products
- `GET /api/products`: List all products
- `POST /api/products`: Create new product
- `GET /api/products/:id`: Search product by ID
- `PUT /api/products/:id`: Update product
- `DELETE /api/products/:id`: Remove product

### Orders
- `GET /api/orders`: List all orders
- `POST /api/orders`: Create new order
- `GET /api/orders/:id`: Search order by ID
- `DELETE /api/orders/:id`: Remove order

## 🧪 Tests

The project includes unit and integration tests:

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

## 🛠️ Development Environment

The project uses Docker Compose to set up a local development environment that includes:
- Node.js API
- LocalStack to emulate AWS services (DynamoDB, EC2)

### Future Development

Currently in planning:
- Deployment on AWS Lambda
- CI/CD setup
- Deploy to production environment

## 📘 License

This project is licensed under the ISC license.
