"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
const console_1 = __importDefault(require("console"));
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = __importDefault(require("services /auth_service/auth.service"));
async function loginController(request, reply) {
    try {
        const userData = request.body;
        const authService = new auth_service_1.default(request.server);
        const server = (await authService.serverError());
        if (!server.status) {
            console_1.default.error(chalk_1.default.red('MongoDB não está disponível na instância do servidor'));
            return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(server);
        }
        const status = await authService.loginUser(userData.email, userData.password, userData.role || 'user');
        if (!status.success) {
            console_1.default.warn(chalk_1.default.yellow('Login failed:', status.message));
            return reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                status: 'error',
                success: false,
                message: status.message || 'Login failed',
                verified: false
            });
        }
        const response = {
            user: status.user,
            token: status.token,
            status: status.status || 'success',
            success: status.success,
            message: status.message || 'User logged in successfully',
            verified: status.verified
        };
        reply.setCookie('token', response.token || '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
        });
        return reply.status(http_status_codes_1.StatusCodes.OK).send(response);
    }
    catch (error) {
        console_1.default.error(chalk_1.default.red('Erro ao processar a requisição de login:', error));
        return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}
