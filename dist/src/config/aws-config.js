"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ec2 = exports.docClient = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV === 'development') {
    dotenv_1.default.config();
}
else {
    dotenv_1.default.config({ path: '.env.production' });
}
aws_sdk_1.default.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    logger: process.env.NODE_ENV === 'development' ? console : undefined,
});
exports.docClient = new aws_sdk_1.default.DynamoDB.DocumentClient({
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});
exports.ec2 = new aws_sdk_1.default.EC2({
    endpoint: process.env.EC2_ENDPOINT || undefined,
    region: process.env.AWS_REGION || 'us-east-1',
});
