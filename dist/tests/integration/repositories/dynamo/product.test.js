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
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../../../../src/infrastructure/repositories/dynamo/product");
describe('DynamoProductRepository', () => {
    let sut;
    const testProduct = {
        id: 'test-product-01',
        name: 'name',
        price: 10,
        stock: 30,
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        sut = new product_1.DynamoProductRepository();
    }), 50000);
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.create(testProduct);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.delete(testProduct.id);
    }));
    it('should create a product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield sut.findById(testProduct.id);
        expect(product).toEqual(testProduct);
    }));
    it('should delete a product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.delete(testProduct.id);
        const product = yield sut.findById(testProduct.id);
        expect(product).toBeUndefined();
    }), 50000);
    it('should find all products and include the newly created product', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield sut.findAll();
        expect(product).toEqual(expect.arrayContaining([testProduct]));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const existingProduct = yield sut.findById(testProduct.id);
        if (existingProduct) {
            yield sut.delete(testProduct.id);
        }
    }), 50000);
});
