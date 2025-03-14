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
const get_product_1 = require("../../../../src/data/use-cases/product/get-product");
const result_1 = require("../../../../src/data/utils/result");
const product_1 = __importDefault(require("../../../utils/mocks/product"));
const product_2 = require("../../../utils/stubs/repositories/dynamo/product");
const makeSut = () => {
    const dynamoProductRepositoryStub = new product_2.DynamoProductRepositoryStub();
    const sut = new get_product_1.GetProductByIdUseCaseImpl(dynamoProductRepositoryStub);
    return {
        sut,
        dynamoProductRepositoryStub,
    };
};
describe('GetProductByIdUseCaseImpl', () => {
    it('should return 200 if it returns the searched product', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = makeSut();
        const res = yield sut.exec('id-01');
        expect(res).toEqual((0, result_1.ok)('Ação realizada com sucesso!', product_1.default));
    }));
});
