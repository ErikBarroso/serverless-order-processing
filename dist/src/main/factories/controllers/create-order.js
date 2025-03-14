"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_orders_1 = require("../../../data/use-cases/order/create-orders");
const order_1 = require("../../../infrastructure/repositories/dynamo/order");
const product_1 = require("../../../infrastructure/repositories/dynamo/product");
const create_order_1 = require("../../../presentation/controllers/orders/create-order");
exports.default = () => {
    const odersRepo = new order_1.DynamoOrderRepository();
    const productRepo = new product_1.DynamoProductRepository();
    const useCase = new create_orders_1.CreateOrderUseCaseImpl(odersRepo, productRepo);
    const controller = new create_order_1.CreateOrderController(useCase);
    return controller;
};
