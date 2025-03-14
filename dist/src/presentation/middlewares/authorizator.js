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
exports.AuthorizatorMiddleware = void 0;
const response_builder_1 = require("../helpers/response-builder");
class AuthorizatorMiddleware {
    constructor(authorizator) {
        this.authorizator = authorizator;
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { headers } = request;
                const loggedUser = yield this.authorizator.isAuthorized(headers.authorization);
                if (!loggedUser) {
                    return (0, response_builder_1.serverResponse)({
                        code: 401,
                        data: {},
                    });
                }
                request.currentUser = loggedUser;
                return (0, response_builder_1.serverResponse)({
                    data: loggedUser,
                });
            }
            catch (error) {
                return (0, response_builder_1.errorResponse)(error);
            }
        });
    }
}
exports.AuthorizatorMiddleware = AuthorizatorMiddleware;
