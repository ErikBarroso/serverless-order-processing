"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_products_1 = require("../../../../data/use-cases/product/find-products");
const product_1 = require("../../../../infrastructure/repositories/dynamo/product");
const find_product_1 = require("../../../../presentation/controllers/products/find-product");
exports.default = () => {
    const repo = new product_1.DynamoProductRepository();
    const useCase = new find_products_1.FindProductsUseCaseImpl(repo);
    const controller = new find_product_1.FindProductsController(useCase);
    return controller;
};
