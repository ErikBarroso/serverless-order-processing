"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_schema_1 = __importDefault(require("../adpters/validate-schema"));
const login_validator_1 = require("../../presentation/helpers/login-validator");
const express_route_adpter_1 = __importDefault(require("../adpters/express-route-adpter"));
const login_1 = __importDefault(require("../factories/controllers/auth/login"));
const authRouter = (0, express_1.Router)();
authRouter.post('/', (0, validate_schema_1.default)(login_validator_1.loginSchema), (0, express_route_adpter_1.default)(login_1.default));
exports.default = authRouter;
