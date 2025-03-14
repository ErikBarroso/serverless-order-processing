"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_product_by_name_1 = require("../../../../data/use-cases/product/get-product-by-name");
const product_1 = require("../../../../infrastructure/repositories/dynamo/product");
const get_product_by_name_2 = require("../../../../presentation/controllers/products/get-product-by-name");
exports.default = () => {
    const repo = new product_1.DynamoProductRepository();
    const useCase = new get_product_by_name_1.GetProductByNameUseCaseImpl(repo);
    const controller = new get_product_by_name_2.GetProductByNameController(useCase);
    return controller;
};
