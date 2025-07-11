"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = logoutController;
const console_1 = __importDefault(require("console"));
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = __importDefault(require("services /auth_service/auth.service"));
async function logoutController(request, reply) {
    try {
        if (!request.server.mongo || !request.server.mongo.db) {
            console_1.default.error(chalk_1.default.red('MongoDB não está disponível na instância do servidor'));
            return {
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            };
        }
        const authService = new auth_service_1.default(request.server);
        const status = await authService.logoutUser(reply);
        if (!status.success) {
            console_1.default.warn(chalk_1.default.yellow('Logout failed:', status.message));
            return reply.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send({
                status: 'error',
                success: false,
                message: status.message || 'Logout failed',
                verified: false
            });
        }
        return reply.status(http_status_codes_1.StatusCodes.OK).send({
            status: status.status || 'success',
            success: status.success,
            message: status.message || 'User logged out successfully',
            verified: true
        });
    }
    catch (error) {
        console_1.default.error(chalk_1.default.red('Erro ao processar a requisição de logout:', error));
        return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}
