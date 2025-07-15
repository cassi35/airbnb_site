"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hooksFastify = hooksFastify;
const http_status_codes_1 = require("http-status-codes");
const chalk_1 = __importDefault(require("chalk"));
async function hooksFastify(app) {
    // ✅ Hook para autenticação (apenas rotas protegidas)
    app.addHook("onRequest", async (request, reply) => {
        // ✅ Definir quais rotas precisam de autenticação
        const protectedRoutes = [
            '/api/bookings',
            '/api/properties/create',
            '/api/properties/update',
            '/api/properties/delete',
            '/api/user/profile',
            '/api/reviews'
        ]; //adicinando as rotas que precisam de autenticacao
        // ✅ Verificar se a rota atual precisa de autenticação
        const isProtected = protectedRoutes.some(route => request.url.startsWith(route));
        // ✅ Só verificar token se for rota protegida
        if (isProtected) {
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
        }
    });
}
