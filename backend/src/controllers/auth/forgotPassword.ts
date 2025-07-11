import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "interface/auth";
import AuthService from "services /auth_service/auth.service";
import { StatusResponse } from "interface/responses";
export interface UserBody{
    Body:{
        email:string

    }
}
export interface ForgotPasswordResponse {
    status:string;
    success:boolean;
    message:string;
    verified:boolean;
}
export async function forgotPasswordController(  request: FastifyRequest<UserBody>, 
    reply: FastifyReply): Promise<void> {
    try {
        if(!request.server.mongo || !request.server.mongo.db) {
            log.error(ck.red('MongoDB não está disponível na instância do servidor'));
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            });

        }
        const userData= request.body 
        const authService = new AuthService(request.server);
        const status:StatusResponse = await authService.forgotPassword(userData.email);
        if(!status.success){
            log.warn(ck.yellow('Falha ao solicitar redefinição de senha:', status.message));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: status.message || 'Failed to request password reset',
                verified: false
            });
        }
        const response: ForgotPasswordResponse = {
            status: status.status || 'pending',
            success: status.success,
            message: status.message || 'Password reset email sent successfully',
            verified: status.verified
        };
        return reply.status(StatusCodes.OK).send(response);
    } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de redefinição de senha:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}