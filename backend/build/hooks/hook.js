"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hooksFastify = hooksFastify;
const http_status_codes_1 = require("http-status-codes");
const chalk_1 = __importDefault(require("chalk"));
async function hooksFastify(app) {
    app.addHook("onRequest", async (request, reply) => {
        console.log('🔍 Hook chamado para:', request.method, request.url);
        console.log('🔍 Headers authorization:', request.headers.authorization);
        try {
            const token = request.headers.authorization?.split(" ")[1];
            console.log('🔍 Token extraído:', token);
            if (!token) {
                console.log('❌ Token não encontrado');
                return reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                    error: `${chalk_1.default.red("Token de autenticação não fornecido")}`,
                });
            }
            console.log('✅ Verificando token...');
            const decoded = await app.jwt.verify(token);
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
    }); // para verificar o token JWT em cada requisição
}
