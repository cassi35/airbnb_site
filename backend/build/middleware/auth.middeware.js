"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthMiddleware = verifyAuthMiddleware;
const http_status_codes_1 = require("http-status-codes");
const chalk_1 = __importDefault(require("chalk"));
async function verifyAuthMiddleware(request, reply) {
    try {
        console.log('🔍 Middleware de auth chamado para:', request.method, request.url);
        console.log('🔍 Headers authorization:', request.headers.authorization);
        const token = request.headers.authorization?.split(" ")[1];
        console.log('🔍 Token extraído:', token);
        if (!token) {
            console.log('❌ Token não encontrado');
            return reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                error: `${chalk_1.default.red("Token de autenticação não fornecido")}`,
            });
        }
        console.log('✅ Verificando token...');
        const decoded = await request.server.jwt.verify(token);
        console.log('✅ Token decodificado:', decoded);
        request.jwtUser = decoded;
        console.log('✅ jwtUser atribuído com sucesso');
    }
    catch (error) {
        console.log('❌ Erro ao verificar token:', error);
        return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
            error: `${chalk_1.default.red("Erro ao verificar autenticação")}`,
        });
    }
}
