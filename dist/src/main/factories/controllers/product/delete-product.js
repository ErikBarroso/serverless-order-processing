"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delete_product_1 = require("../../../../data/use-cases/product/delete-product");
const product_1 = require("../../../../infrastructure/repositories/dynamo/product");
const delete_product_2 = require("../../../../presentation/controllers/products/delete-product");
exports.default = () => {
    const repo = new product_1.DynamoProductRepository();
    const useCase = new delete_product_1.DeleteProductUseCaseImpl(repo);
    const controller = new delete_product_2.DeleteProductController(useCase);
    return controller;
};
