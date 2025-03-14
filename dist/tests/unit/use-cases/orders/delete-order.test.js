"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delete_orders_1 = require("../../../../src/data/use-cases/order/delete-orders");
const result_1 = require("../../../../src/data/utils/result");
const order_1 = __importDefault(require("../../../utils/mocks/order"));
const order_2 = require("../../../utils/stubs/repositories/dynamo/order");
const makeSut = () => {
    const dynamoOrderRepositoryStub = new order_2.DynamoOrderRepositoryStub();
    const sut = new delete_orders_1.DeleteOrderUseCaseImpl(dynamoOrderRepositoryStub);
    return {
        sut,
        dynamoOrderRepositoryStub,
    };
};
describe('DeleteOrderUseCaseImpl', () => {
    it('should return 200 if an order is deleted successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = makeSut();
        const res = yield sut.exec('id-01', 'customerId');
        expect(res).toEqual((0, result_1.ok)('Pedido deletado com sucesso!', order_1.default));
    }));
});
