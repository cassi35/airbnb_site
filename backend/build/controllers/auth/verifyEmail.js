"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailController = verifyEmailController;
const console_1 = __importDefault(require("console"));
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = __importDefault(require("services /auth_service/auth.service"));
async function verifyEmailController(request, reply) {
    try {
        const userData = request.body;
        if (!userData || !userData.verificationToken || !userData.email) {
            console_1.default.warn(chalk_1.default.yellow('Dados de verificação de email inválidos:', userData));
            return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'Invalid verification data',
                verified: false
            });
        }
        const authService = new auth_service_1.default(request.server);
        const status = await authService.verifyToken(userData.verificationToken, userData.email);
        if (!status.success) {
            console_1.default.warn(chalk_1.default.yellow('Falha na verificação do token:', status.message));
            return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: status.message || 'Token verification failed',
                verified: false
            });
        }
        const response = {
            user: status.user,
            token: status.token,
            status: status.status || 'verified',
            success: status.success,
            message: status.message || 'Email verified successfully',
            verified: true
        };
        reply.setCookie('token', response.token || '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 
        });
        return reply.status(http_status_codes_1.StatusCodes.OK).send(response);
    }
    catch (error) {
        console_1.default.error(chalk_1.default.red('Erro ao processar a requisição de verificação de email:', error));
        return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}
