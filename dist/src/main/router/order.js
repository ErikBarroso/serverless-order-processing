"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_route_adpter_1 = __importDefault(require("../adpters/express-route-adpter"));
const find_orders_1 = __importDefault(require("../factories/controllers/find-orders"));
const create_order_1 = __importDefault(require("../factories/controllers/create-order"));
const delete_order_1 = __importDefault(require("../factories/controllers/delete-order"));
const get_order_by_id_1 = __importDefault(require("../factories/controllers/get-order-by-id"));
const express_middleware_adpter_1 = __importDefault(require("../adpters/express-middleware-adpter"));
const authorizator_1 = __importDefault(require("../factories/middlewares/authorizator"));
const orderRouter = (0, express_1.Router)();
orderRouter.post('/', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(create_order_1.default));
orderRouter.delete('/:id', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(delete_order_1.default));
orderRouter.get('/:id', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(get_order_by_id_1.default));
orderRouter.get('/', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(find_orders_1.default));
exports.default = orderRouter;
