"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupController = controller;
const console_1 = __importDefault(require("console"));
const chalk_1 = __importDefault(require("chalk"));
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = __importDefault(require("services /auth.service"));
function controller(request, reply) {
    // Verifique se MongoDB está disponível
    try {
        if (!request.server.mongo || !request.server.mongo.db) {
            console_1.default.error(chalk_1.default.red('MongoDB não está disponível na instância do servidor'));
            reply.code(500).send({
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            });
            return;
        }
        const userData = request.body;
        const authService = new auth_service_1.default(request.server);
        return authService.createUser(userData).then((response) => {
            reply.status(http_status_codes_1.StatusCodes.CREATED).send(response);
        }).catch((error) => {
            const response = {
                status: 'error',
                success: false,
                message: error,
                verified: false
            };
            reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(response);
        });
    }
    catch (error) {
        console_1.default.error(chalk_1.default.red('Erro ao processar a requisição de signup:', error));
        reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}
