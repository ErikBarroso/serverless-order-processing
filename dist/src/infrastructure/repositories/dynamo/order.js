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
exports.DynamoOrderRepository = void 0;
const aws_config_1 = require("../../../config/aws-config");
class DynamoOrderRepository {
    constructor() {
        this.TABLE_NAME = 'Orders';
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield aws_config_1.docClient.put({ TableName: this.TABLE_NAME, Item: item }).promise();
            const result = yield aws_config_1.docClient.get({
                TableName: this.TABLE_NAME,
                Key: { id: item.id, customerId: item.customerId },
            }).promise();
            return result.Item;
        });
    }
    delete(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield aws_config_1.docClient.delete({ Key: { id, customerId: userId }, TableName: this.TABLE_NAME }).promise();
        });
    }
    findById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield aws_config_1.docClient.get({ Key: { id, customerId: userId }, TableName: this.TABLE_NAME }).promise();
            return result.Item;
        });
    }
    findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.TABLE_NAME,
                IndexName: 'customerId-index',
                KeyConditionExpression: 'customerId = :customerId',
                ExpressionAttributeValues: {
                    ':customerId': userId,
                },
            };
            const result = yield aws_config_1.docClient.query(params).promise();
            return result.Items;
        });
    }
}
exports.DynamoOrderRepository = DynamoOrderRepository;
