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
exports.LoginUseCaseImpl = void 0;
const result_1 = require("../../utils/result");
class LoginUseCaseImpl {
    constructor(userRepository, jwt, passwordEncrypter) {
        this.userRepository = userRepository;
        this.jwt = jwt;
        this.passwordEncrypter = passwordEncrypter;
    }
    exec(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                return (0, result_1.unauthorized)('Email ou senha inválido');
            }
            const isPasswordValid = yield this.passwordEncrypter.compare(password, user.password);
            if (!isPasswordValid) {
                return (0, result_1.unauthorized)('Email ou senha inválido');
            }
            const accessToken = yield this.jwt.sign({
                id: user.id
            }, process.env.JWT_SECRET || 'defaultKey', parseInt(process.env.JWT_EXPIRES_IN) || 60);
            const result = {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            };
            return (0, result_1.ok)('Ação realizada com sucesso!', result);
        });
    }
}
exports.LoginUseCaseImpl = LoginUseCaseImpl;
