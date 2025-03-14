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
exports.FindOrdersUseCaseImpl = void 0;
const result_1 = require("../../utils/result");
class FindOrdersUseCaseImpl {
    constructor(repo) {
        this.repo = repo;
    }
    exec(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.repo.findAll(userId);
            return (0, result_1.ok)('Ação realizada com sucesso', orders);
        });
    }
}
exports.FindOrdersUseCaseImpl = FindOrdersUseCaseImpl;
