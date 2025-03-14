"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_user_1 = require("../../../../data/use-cases/user/create-user");
const bcrypt_1 = __importDefault(require("../../../../infrastructure/encrypters/bcrypt"));
const user_1 = require("../../../../infrastructure/repositories/dynamo/user");
const create_user_2 = require("../../../../presentation/controllers/user/create-user");
exports.default = () => {
    const repo = new user_1.DynamoUserRepository();
    const encrypter = new bcrypt_1.default();
    const useCase = new create_user_1.CreateUserUseCaseImpl(repo, encrypter);
    const controller = new create_user_2.CreateUserController(useCase);
    return controller;
};
