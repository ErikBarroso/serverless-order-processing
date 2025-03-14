"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delete_orders_1 = require("../../../data/use-cases/order/delete-orders");
const order_1 = require("../../../infrastructure/repositories/dynamo/order");
const delete_order_1 = require("../../../presentation/controllers/orders/delete-order");
exports.default = () => {
    const repo = new order_1.DynamoOrderRepository();
    const useCase = new delete_orders_1.DeleteOrderUseCaseImpl(repo);
    const controller = new delete_order_1.DeleteOrderController(useCase);
    return controller;
};
