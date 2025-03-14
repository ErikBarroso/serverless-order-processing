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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonWebToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JsonWebToken {
    sign(data, key, expiresIn) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(data, key, { expiresIn: expiresIn * 60 });
        });
    }
    verify(token, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (jsonwebtoken_1.default.verify(token, key));
            }
            catch (err) {
                console.log('err', err);
                return null;
            }
        });
    }
}
exports.JsonWebToken = JsonWebToken;
