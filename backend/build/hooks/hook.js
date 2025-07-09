"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
const http_status_codes_1 = require("http-status-codes");
const chalk_1 = __importDefault(require("chalk"));
const verifyAuth = async function (app) {
    app.addHook("onRequest", async (request, reply) => {
        try {
            const token = request.headers.authorization?.split(" ")[1];
            if (!token) {
                return reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                    error: `${chalk_1.default.red("Token de autenticação não fornecido")}`,
                });
            }
            const decoded = await app.jwt.verify(token);
            request.user = decoded;
        }
        catch (error) {
            return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                error: `${chalk_1.default.red("Erro ao verificar autenticação")}`,
            });
        }
    });
};
exports.verifyAuth = verifyAuth;
