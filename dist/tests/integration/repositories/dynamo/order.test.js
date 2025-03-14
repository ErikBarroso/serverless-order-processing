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
const order_1 = require("../../../../src/domain/entities/order");
const order_2 = require("../../../../src/infrastructure/repositories/dynamo/order");
describe('DynamoOrderRepository', () => {
    let sut;
    const testOrder = {
        id: 'test-order-01',
        customerId: 'customerId',
        orderStatus: order_1.OrderStatus.PENDING,
        items: ['id-01', 'id-02'],
        createdAt: 'createdAt',
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        sut = new order_2.DynamoOrderRepository();
    }), 50000);
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.create(testOrder);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.delete(testOrder.id, testOrder.customerId);
    }));
    it('should create a order successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield sut.findById(testOrder.id, testOrder.customerId);
        expect(order).toEqual(testOrder);
    }));
    it('should delete a order successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.delete(testOrder.id, testOrder.customerId);
        const order = yield sut.findById(testOrder.id, testOrder.customerId);
        expect(order).toBeUndefined();
    }), 50000);
    it('should find all orders and include the newly created order', () => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield sut.findAll(testOrder.customerId);
        expect(order).toEqual(expect.arrayContaining([testOrder]));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const existingOrder = yield sut.findById(testOrder.id, testOrder.customerId);
        if (existingOrder) {
            yield sut.delete(testOrder.id, testOrder.customerId);
        }
    }), 50000);
});
