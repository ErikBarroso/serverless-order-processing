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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./main/router/index"));
const ec2_services_1 = require("./data/services/ec2-services");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = parseInt(process.env.PORT || '3000');
app.use('/api', index_1.default);
app.get('/', (req, res) => {
    res.status(200).send('Order API is active!');
});
function checkServerStartMode() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV === 'development') {
            const isEc2Running = yield (0, ec2_services_1.checkEc2InstanceStatus)();
            if (!isEc2Running) {
                return console.error('A instância EC2 não está ativa.');
            }
            return startAppServer();
        }
        startAppServer();
    });
}
function startAppServer() {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running at PORT: ${PORT}`);
    });
}
checkServerStartMode();
