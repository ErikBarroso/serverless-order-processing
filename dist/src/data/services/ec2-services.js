"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.checkEc2InstanceStatus = checkEc2InstanceStatus;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const aws_config_1 = require("../../config/aws-config");
const ENV_FILE_PATH = path.resolve(__dirname, '../../../.env');
dotenv_1.default.config();
function updateEnvFile(instanceId) {
    const envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    if (!envContent.includes(`INSTANCE_ID=${instanceId}`)) {
        const newContent = envContent.replace(/INSTANCE_ID=.*/g, `INSTANCE_ID=${instanceId}`);
        fs.writeFileSync(ENV_FILE_PATH, newContent, 'utf8');
        dotenv_1.default.config({ path: ENV_FILE_PATH });
        console.log(`.env atualizado com INSTANCE_ID: ${instanceId}`);
    }
}
function checkEc2InstanceStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const instanceId = process.env.INSTANCE_ID;
        if (!instanceId) {
            console.log('INSTANCE_ID não encontrado no arquivo .env. Criando uma nova instância...');
            return !!(yield createInstance());
        }
        const instance = yield describeInstance(instanceId);
        if (!instance) {
            console.log('Instância não encontrada. Crie uma nova ou verifique o arquivo .env.');
            return false;
        }
        if (((_a = instance.State) === null || _a === void 0 ? void 0 : _a.Name) === 'running') {
            console.log(`Instância EC2 ${instance.InstanceId} está ${(_b = instance.State) === null || _b === void 0 ? void 0 : _b.Name}`);
            return true;
        }
        if (((_c = instance.State) === null || _c === void 0 ? void 0 : _c.Name) === 'stopped') {
            yield startInstance(instanceId);
            const instance = yield describeInstance(instanceId);
            console.log(`Instância EC2 ${instance === null || instance === void 0 ? void 0 : instance.InstanceId} está ${(_d = instance === null || instance === void 0 ? void 0 : instance.State) === null || _d === void 0 ? void 0 : _d.Name}`);
            return true;
        }
        return false;
    });
}
function createInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const result = yield aws_config_1.ec2.runInstances({
                ImageId: 'ami-12345678',
                InstanceType: 't2.micro',
                MinCount: 1,
                MaxCount: 1,
            }).promise();
            const instanceId = ((_a = result.Instances) === null || _a === void 0 ? void 0 : _a[0].InstanceId) || null;
            if (instanceId) {
                console.log(`Instância EC2 criada com sucesso. ID: ${instanceId}`);
                updateEnvFile(instanceId);
            }
            return instanceId;
        }
        catch (error) {
            console.error('Erro ao criar instância EC2:', error);
            return null;
        }
    });
}
function describeInstance(instanceId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const result = yield aws_config_1.ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
            return ((_c = (_b = (_a = result.Reservations) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Instances) === null || _c === void 0 ? void 0 : _c[0]) || null;
        }
        catch (error) {
            if (error.code === 'InvalidInstanceID.NotFound') {
                return null;
            }
            console.error('Erro ao descrever a instância:', error);
            throw error;
        }
    });
}
function startInstance(instanceId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Iniciando a instância...');
        yield aws_config_1.ec2.startInstances({ InstanceIds: [instanceId] }).promise();
    });
}
