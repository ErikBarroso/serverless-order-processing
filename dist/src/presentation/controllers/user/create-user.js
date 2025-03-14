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
exports.CreateUserController = void 0;
const response_builder_1 = require("../../helpers/response-builder");
class CreateUserController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = request.body;
            const user = { name, email, password };
            try {
                const result = yield this.useCase.exec(user);
                return (0, response_builder_1.serverResponse)(result);
            }
            catch (error) {
                return (0, response_builder_1.errorResponse)(error);
            }
        });
    }
}
exports.CreateUserController = CreateUserController;
