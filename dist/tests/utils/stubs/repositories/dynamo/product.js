"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoProductRepositoryStub = void 0;
const product_1 = __importDefault(require("../../../mocks/product"));
class DynamoProductRepositoryStub {
    create(item) {
        return Promise.resolve(product_1.default);
    }
    delete(id) {
        return Promise.resolve();
    }
    findAll() {
        return Promise.resolve([product_1.default]);
    }
    findByName() {
        return Promise.resolve([product_1.default]);
    }
    findById(id) {
        return Promise.resolve(product_1.default);
    }
}
exports.DynamoProductRepositoryStub = DynamoProductRepositoryStub;
