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
const find_orders_1 = require("../../../../src/data/use-cases/order/find-orders");
const result_1 = require("../../../../src/data/utils/result");
const order_1 = __importDefault(require("../../../utils/mocks/order"));
const order_2 = require("../../../utils/stubs/repositories/dynamo/order");
const makeSut = () => {
    const dynamoOrderRepositoryStub = new order_2.DynamoOrderRepositoryStub();
    const sut = new find_orders_1.FindOrdersUseCaseImpl(dynamoOrderRepositoryStub);
    return {
        sut,
        dynamoOrderRepositoryStub,
    };
};
describe('FindOrdersUseCaseImpl', () => {
    it('should return 200 if returning existing orders', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = makeSut();
        const res = yield sut.exec('customerId');
        expect(res).toEqual((0, result_1.ok)('Ação realizada com sucesso', [order_1.default]));
    }));
});
