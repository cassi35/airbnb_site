import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "interface/auth";
import AuthService from "services /auth_service/auth.service";
import { StatusResponse } from "interface/responses";
import { ResponseSignup, UserBodySignup } from "#interface/interface.auth.response.js";




export async function signupController(
    request: FastifyRequest<UserBodySignup>, 
    reply: FastifyReply
): Promise<void> {  // Alterado o tipo de retorno
    try {
        if (!request.server.mongo || !request.server.mongo.db) {
            log.error(ck.red('MongoDB não está disponível na instância do servidor'));
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            });
        }
        
        const userData = request.body;
        const authService = new AuthService(request.server);
        
        // Adicionado await aqui
        const status: StatusResponse = await authService.createUser(userData);
        
        // Garantindo valores padrão para evitar undefined
        const response: ResponseSignup = {
            user: status.user,
            token: status.token,
            status: status.status || 'pending',
            success: status.success === false ? false : true,
            message: status.message || 'User created successfully, please verify your email',
            verified: status.verified
        };
        
        return reply.status(StatusCodes.CREATED).send(response);
        
    } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de signup:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}