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
exports.CreateProductUseCaseImpl = void 0;
const crypto_1 = require("crypto");
const result_1 = require("../../utils/result");
class CreateProductUseCaseImpl {
    constructor(repo) {
        this.repo = repo;
    }
    exec(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = {
                id: (0, crypto_1.randomUUID)(),
                name: item.name.toLowerCase(),
                price: item.price,
                stock: item.stock,
            };
            const result = yield this.repo.create(product);
            return (0, result_1.created)('Produto criado com sucesso!', result);
        });
    }
}
exports.CreateProductUseCaseImpl = CreateProductUseCaseImpl;
