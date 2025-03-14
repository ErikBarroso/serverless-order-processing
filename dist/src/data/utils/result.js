"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.forbidden = exports.unauthorized = exports.unprocessableEntity = exports.created = exports.ok = void 0;
const ok = (msg, data) => ({
    code: 200,
    msg,
    data,
});
exports.ok = ok;
const created = (msg, data) => ({
    code: 201,
    msg,
    data,
});
exports.created = created;
const unprocessableEntity = (msg, data) => ({
    code: 422,
    msg,
    data,
});
exports.unprocessableEntity = unprocessableEntity;
const unauthorized = (msg, data) => ({
    code: 401,
    msg,
    data,
});
exports.unauthorized = unauthorized;
const forbidden = (msg, data) => ({
    code: 403,
    msg,
    data,
});
exports.forbidden = forbidden;
const notFound = (msg, data) => ({
    code: 404,
    msg,
    data,
});
exports.notFound = notFound;
