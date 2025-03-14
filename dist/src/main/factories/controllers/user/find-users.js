"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_users_1 = require("../../../../data/use-cases/user/find-users");
const user_1 = require("../../../../infrastructure/repositories/dynamo/user");
const find_users_2 = require("../../../../presentation/controllers/user/find-users");
exports.default = () => {
    const repo = new user_1.DynamoUserRepository();
    const useCase = new find_users_1.FindUsersUseCaseImpl(repo);
    const controller = new find_users_2.FindUsersController(useCase);
    return controller;
};
