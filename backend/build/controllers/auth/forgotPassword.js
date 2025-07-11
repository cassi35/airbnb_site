"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordController = forgotPasswordController;
const console_1 = __importDefault(require("console"));
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = __importDefault(require("services /auth_service/auth.service"));
async function forgotPasswordController(request, reply) {
    try {
        if (!request.server.mongo || !request.server.mongo.db) {
            console_1.default.error(chalk_1.default.red('MongoDB não está disponível na instância do servidor'));
            return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            });
        }
        const userData = request.body;
        const authService = new auth_service_1.default(request.server);
        const status = await authService.forgotPassword(userData.email);
        if (!status.success) {
            console_1.default.warn(chalk_1.default.yellow('Falha ao solicitar redefinição de senha:', status.message));
            return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: status.message || 'Failed to request password reset',
                verified: false
            });
        }
        const response = {
            status: status.status || 'pending',
            success: status.success,
            message: status.message || 'Password reset email sent successfully',
            verified: status.verified
        };
        return reply.status(http_status_codes_1.StatusCodes.OK).send(response);
    }
    catch (error) {
        console_1.default.error(chalk_1.default.red('Erro ao processar a requisição de redefinição de senha:', error));
        return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}
