"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_orders_1 = require("../../../data/use-cases/order/find-orders");
const order_1 = require("../../../infrastructure/repositories/dynamo/order");
const find_orders_2 = require("../../../presentation/controllers/orders/find-orders");
exports.default = () => {
    const repo = new order_1.DynamoOrderRepository();
    const useCase = new find_orders_1.FindOrdersUseCaseImpl(repo);
    const controller = new find_orders_2.FindOrdersController(useCase);
    return controller;
};
