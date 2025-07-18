"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectGoogle = redirectGoogle;
const http_status_codes_1 = require("http-status-codes");
const console_1 = __importDefault(require("console"));
const chalk_1 = __importDefault(require("chalk"));
const googleAuth_service_1 = __importDefault(require("services /auth_service/googleAuth.service"));
async function redirectGoogle(request, reply) {
    try {
        const googleService = new googleAuth_service_1.default(request.server);
        const authUrl = googleService.getGoogleAuthUrl();
        console_1.default.info(chalk_1.default.green('Redirecionando para URL de autenticação do Google:', authUrl));
        // return reply.redirect(authUrl); descomentar quando criar o frontend
        return reply.status(http_status_codes_1.StatusCodes.OK).send({
            status: 'success',
            success: true,
            url: authUrl,
            message: 'Use esta URL no navegador para iniciar o login com Google'
        }); //comentar quando criar o frontend
    }
    catch (error) {
        console_1.default.error(chalk_1.default.red('Erro ao redirecionar para o Google:', error));
        return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}
