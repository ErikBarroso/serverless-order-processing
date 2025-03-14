"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../../../src/domain/entities/order");
const mockedOrder = {
    id: 'id',
    customerId: 'customerId',
    orderStatus: order_1.OrderStatus.PENDING,
    items: ['id-01', 'id-02'],
    createdAt: '01/01/2025',
};
exports.default = mockedOrder;
