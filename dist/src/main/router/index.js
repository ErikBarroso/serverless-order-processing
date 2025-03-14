"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = __importDefault(require("./product"));
const order_1 = __importDefault(require("./order"));
const user_1 = __importDefault(require("./user"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
router.use('/products', product_1.default);
router.use('/orders', order_1.default);
router.use('/users', user_1.default);
router.use('/login', auth_1.default);
exports.default = router;
