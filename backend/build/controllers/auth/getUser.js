"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserController = getUserController;
const console_1 = __importDefault(require("console"));
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = __importDefault(require("services /auth_service/auth.service"));
async function getUserController(request, reply) {
    try {
        const authService = new auth_service_1.default(request.server);
        const mongo = await authService.serverError();
        const email = request.body.email;
        if (!mongo.success) {
            return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                user: undefined,
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            });
        }
        const status = await authService.getUserByEmail(email);
        if (!status.success) {
            console_1.default.warn(chalk_1.default.yellow('Failed to get user by email:', status.message));
            return reply.status(http_status_codes_1.StatusCodes.NOT_FOUND).send({
                user: undefined,
                status: 'error',
                success: false,
                message: status.message || 'User not found',
                verified: false
            });
        }
        const response = {
            user: status.user,
            status: status.status || 'found',
            success: status.success,
            message: status.message || 'User retrieved successfully',
            verified: status.verified
        };
        return reply.status(http_status_codes_1.StatusCodes.OK).send(response);
    }
    catch (error) {
        console_1.default.error(chalk_1.default.red('Erro ao processar a requisição de busca de usuário:', error));
        return {
            user: undefined,
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        };
    }
}
