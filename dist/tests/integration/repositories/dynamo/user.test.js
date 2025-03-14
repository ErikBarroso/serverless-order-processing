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
const user_1 = require("../../../../src/infrastructure/repositories/dynamo/user");
describe('DynamoUserRepository', () => {
    let sut;
    const testUser = {
        id: 'test-user-01',
        name: 'name',
        email: 'email',
        password: 'password',
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        sut = new user_1.DynamoUserRepository();
    }), 50000);
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.create(testUser);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.delete(testUser.id);
    }));
    it('should create a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield sut.findById(testUser.id);
        expect(user).toEqual(testUser);
    }));
    it('should delete a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut.delete(testUser.id);
        const user = yield sut.findById(testUser.id);
        expect(user).toBeNull();
    }), 50000);
    it('should find all users and include the newly created user', () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield sut.findAll();
        expect(users).toEqual(expect.arrayContaining([testUser]));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield sut.findById(testUser.id);
        if (existingUser) {
            yield sut.delete(testUser.id);
        }
    }), 50000);
});
