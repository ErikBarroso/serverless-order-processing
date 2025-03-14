"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_product_1 = require("../../../../data/use-cases/product/create-product");
const product_1 = require("../../../../infrastructure/repositories/dynamo/product");
const create_product_2 = require("../../../../presentation/controllers/products/create-product");
exports.default = () => {
    const repo = new product_1.DynamoProductRepository();
    const useCase = new create_product_1.CreateProductUseCaseImpl(repo);
    const controller = new create_product_2.CreateProductController(useCase);
    return controller;
};
