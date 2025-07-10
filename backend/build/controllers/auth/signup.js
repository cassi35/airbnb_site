"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = signupController;
const console_1 = __importDefault(require("console"));
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = __importDefault(require("services /auth_service/auth.service"));
async function signupController(request, reply) {
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
        // Adicionado await aqui
        const status = await authService.createUser(userData);
        // Garantindo valores padrão para evitar undefined
        const response = {
            user: status.user,
            token: status.token,
            status: status.status || 'pending',
            success: status.success === false ? false : true,
            message: status.message || 'User created successfully, please verify your email',
            verified: status.verified
        };
        return reply.status(http_status_codes_1.StatusCodes.CREATED).send(response);
    }
    catch (error) {
        console_1.default.error(chalk_1.default.red('Erro ao processar a requisição de signup:', error));
        return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}
