"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_1 = require("../../../../data/use-cases/auth/login");
const bcrypt_1 = __importDefault(require("../../../../infrastructure/encrypters/bcrypt"));
const jwt_1 = require("../../../../infrastructure/encrypters/jwt");
const user_1 = require("../../../../infrastructure/repositories/dynamo/user");
const login_2 = require("../../../../presentation/controllers/auth/login");
exports.default = () => {
    const repo = new user_1.DynamoUserRepository();
    const bcrypt = new bcrypt_1.default();
    const jsonWebToken = new jwt_1.JsonWebToken();
    const useCase = new login_1.LoginUseCaseImpl(repo, jsonWebToken, bcrypt);
    const controller = new login_2.LoginController(useCase);
    return controller;
};
