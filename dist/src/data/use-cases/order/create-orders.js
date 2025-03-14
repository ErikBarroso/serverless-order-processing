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
exports.CreateOrderUseCaseImpl = void 0;
const crypto_1 = require("crypto");
const order_1 = require("../../../domain/entities/order");
const result_1 = require("../../utils/result");
class CreateOrderUseCaseImpl {
    constructor(ordersRepo, productRepo) {
        this.ordersRepo = ordersRepo;
        this.productRepo = productRepo;
    }
    exec(products, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productsDb = yield this.productRepo.findAll();
            const notFoundProducts = products.filter(product => !productsDb.some(productDb => productDb.id === product));
            if (notFoundProducts.length > 0) {
                return (0, result_1.notFound)('Algum dos produtos enviados são inválidos!');
            }
            const order = {
                id: (0, crypto_1.randomUUID)(),
                customerId: customerId.toLowerCase(),
                orderStatus: order_1.OrderStatus.PENDING,
                items: products,
                createdAt: new Date().toISOString(),
            };
            const result = yield this.ordersRepo.create(order);
            return (0, result_1.created)('Pedido criado com sucesso!', result);
        });
    }
}
exports.CreateOrderUseCaseImpl = CreateOrderUseCaseImpl;
