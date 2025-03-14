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
const create_product_1 = require("../../../../src/data/use-cases/product/create-product");
const result_1 = require("../../../../src/data/utils/result");
const product_1 = __importDefault(require("../../../utils/mocks/product"));
const product_2 = require("../../../utils/stubs/repositories/dynamo/product");
const makeSut = () => {
    const dynamoProductRepositoryStub = new product_2.DynamoProductRepositoryStub();
    const sut = new create_product_1.CreateProductUseCaseImpl(dynamoProductRepositoryStub);
    return {
        sut,
        dynamoProductRepositoryStub,
    };
};
describe('CreateProductUseCaseImpl', () => {
    it('should return 201 if an product is created successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const { sut } = makeSut();
        const res = yield sut.exec({
            name: 'name',
            price: 10,
            stock: 40,
        });
        expect(res).toEqual((0, result_1.created)('Produto criado com sucesso!', product_1.default));
    }));
});
