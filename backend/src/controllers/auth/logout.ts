import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "interface/auth";
import AuthService from "services /auth_service/auth.service";
import { StatusResponse } from "interface/responses";
export async function logoutController(request:FastifyRequest,reply:FastifyReply):Promise<StatusResponse>{
    try {
        if(!request.server.mongo || !request.server.mongo.db){
            log.error(ck.red('MongoDB não está disponível na instância do servidor'));
            return {
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            };

        }
        const authService = new AuthService(request.server);
        const status:StatusResponse = await authService.logoutUser(reply);
        if(!status.success){
            log.warn(ck.yellow('Logout failed:', status.message));
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                status: 'error',
                success: false,
                message: status.message || 'Logout failed',
                verified: false
            })
        }
        return reply.status(StatusCodes.OK).send({
            status: status.status || 'success',
            success: status.success,
            message: status.message || 'User logged out successfully',
            verified: true
        })
    } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de logout:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        })
    }
} 