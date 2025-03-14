"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_order_1 = require("../../../data/use-cases/order/get-order");
const order_1 = require("../../../infrastructure/repositories/dynamo/order");
const get_order_by_id_1 = require("../../../presentation/controllers/orders/get-order-by-id");
exports.default = () => {
    const repo = new order_1.DynamoOrderRepository();
    const useCase = new get_order_1.GetOrderByIdUseCaseImpl(repo);
    const controller = new get_order_by_id_1.GetOrderByIdController(useCase);
    return controller;
};
