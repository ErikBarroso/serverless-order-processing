"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_route_adpter_1 = __importDefault(require("../adpters/express-route-adpter"));
const create_user_1 = __importDefault(require("../factories/controllers/user/create-user"));
const find_users_1 = __importDefault(require("../factories/controllers/user/find-users"));
const authorizator_1 = __importDefault(require("../factories/middlewares/authorizator"));
const express_middleware_adpter_1 = __importDefault(require("../adpters/express-middleware-adpter"));
const userRouter = (0, express_1.Router)();
userRouter.post('/', (0, express_route_adpter_1.default)(create_user_1.default));
userRouter.get('/', (0, express_middleware_adpter_1.default)(authorizator_1.default), (0, express_route_adpter_1.default)(find_users_1.default));
exports.default = userRouter;
