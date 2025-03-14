"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_route_adpter_1 = __importDefault(require("../adpters/express-route-adpter"));
const get_product_by_id_1 = __importDefault(require("../factories/controllers/product/get-product-by-id"));
const find_products_1 = __importDefault(require("../factories/controllers/product/find-products"));
const delete_product_1 = __importDefault(require("../factories/controllers/product/delete-product"));
const create_product_1 = __importDefault(require("../factories/controllers/product/create-product"));
const express_middleware_adpter_1 = __importDefault(require("../adpters/express-middleware-adpter"));
const authorizator_1 = __importDefault(require("../factories/middlewares/authorizator"));
const get_product_by_name_1 = __importDefault(require("../factories/controllers/product/get-product-by-name"));
const productRouter = (0, express_1.Router)();
productRouter.post('/', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(create_product_1.default));
productRouter.delete('/:id', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(delete_product_1.default));
productRouter.get('/id/:id', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(get_product_by_id_1.default));
productRouter.get('/name/:name', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(get_product_by_name_1.default));
productRouter.get('/', (0, express_route_adpter_1.default)(find_products_1.default));
exports.default = productRouter;
