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
exports.CreateUserUseCaseImpl = void 0;
const crypto_1 = require("crypto");
const result_1 = require("../../utils/result");
class CreateUserUseCaseImpl {
    constructor(repo, encrypter) {
        this.repo = repo;
        this.encrypter = encrypter;
    }
    exec(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                id: (0, crypto_1.randomUUID)(),
                email: data.email.toLowerCase(),
                name: data.name.toLowerCase(),
                password: yield this.encrypter.hash(data.password),
            };
            const result = yield this.repo.create(user);
            return (0, result_1.created)('Usuário criado com sucesso!', result);
        });
    }
}
exports.CreateUserUseCaseImpl = CreateUserUseCaseImpl;
