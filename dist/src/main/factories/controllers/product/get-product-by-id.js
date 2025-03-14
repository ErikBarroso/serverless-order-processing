"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_product_1 = require("../../../../data/use-cases/product/get-product");
const product_1 = require("../../../../infrastructure/repositories/dynamo/product");
const get_product_by_id_1 = require("../../../../presentation/controllers/products/get-product-by-id");
exports.default = () => {
    const repo = new product_1.DynamoProductRepository();
    const useCase = new get_product_1.GetProductByIdUseCaseImpl(repo);
    const controller = new get_product_by_id_1.GetProductByIdController(useCase);
    return controller;
};
