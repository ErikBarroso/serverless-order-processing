"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverResponse = exports.errorResponse = void 0;
const errorResponse = (error) => {
    console.error('Error processing request:', error);
    return {
        statusCode: 500,
        body: {
            message: 'Ocorreu um erro ao processar a solicitação.',
            details: (error === null || error === void 0 ? void 0 : error.message) || error,
        },
    };
};
exports.errorResponse = errorResponse;
const serverResponse = (data) => {
    var _a;
    return ({
        statusCode: (_a = data.code) !== null && _a !== void 0 ? _a : 200,
        body: data,
    });
};
exports.serverResponse = serverResponse;
