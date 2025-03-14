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
exports.LoginController = void 0;
const response_builder_1 = require("../../helpers/response-builder");
class LoginController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = request.body;
                const result = yield this.useCase.exec(email, password);
                return (0, response_builder_1.serverResponse)(result);
            }
            catch (error) {
                return (0, response_builder_1.errorResponse)(error);
            }
        });
    }
}
exports.LoginController = LoginController;
