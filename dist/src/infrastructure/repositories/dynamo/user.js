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
exports.DynamoUserRepository = void 0;
const aws_config_1 = require("../../../config/aws-config");
class DynamoUserRepository {
    constructor() {
        this.TABLE_NAME = 'Users';
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield aws_config_1.docClient.put({ TableName: this.TABLE_NAME, Item: user }).promise();
            const result = yield aws_config_1.docClient.get({
                TableName: this.TABLE_NAME,
                Key: { id: user.id },
            }).promise();
            return result.Item;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield aws_config_1.docClient.delete({ Key: { id }, TableName: this.TABLE_NAME }).promise();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield aws_config_1.docClient.get({ Key: { id }, TableName: this.TABLE_NAME }).promise();
            return result.Item || null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const params = {
                TableName: this.TABLE_NAME,
                IndexName: 'email-index',
                KeyConditionExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email,
                },
            };
            const result = yield aws_config_1.docClient.query(params).promise();
            return ((_a = result.Items) === null || _a === void 0 ? void 0 : _a[0]) || null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield aws_config_1.docClient.scan({ TableName: this.TABLE_NAME }).promise();
            return result.Items;
        });
    }
}
exports.DynamoUserRepository = DynamoUserRepository;
