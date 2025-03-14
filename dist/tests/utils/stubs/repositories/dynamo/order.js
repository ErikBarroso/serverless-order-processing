"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoOrderRepositoryStub = void 0;
const order_1 = __importDefault(require("../../../mocks/order"));
class DynamoOrderRepositoryStub {
    create(item) {
        return Promise.resolve(order_1.default);
    }
    delete(id, userId) {
        return Promise.resolve();
    }
    findAll(userId) {
        return Promise.resolve([order_1.default]);
    }
    findById(id, userId) {
        return Promise.resolve(order_1.default);
    }
}
exports.DynamoOrderRepositoryStub = DynamoOrderRepositoryStub;
