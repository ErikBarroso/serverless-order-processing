"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizator_1 = require("../../../data/use-cases/auth/authorizator");
const jwt_1 = require("../../../infrastructure/encrypters/jwt");
const authorizator_2 = require("../../../presentation/middlewares/authorizator");
exports.default = () => {
    const jwt = new jwt_1.JsonWebToken();
    const useCase = new authorizator_1.AuthorizatorUseCaseImpl(jwt);
    const controller = new authorizator_2.AuthorizatorMiddleware(useCase);
    return controller;
};
