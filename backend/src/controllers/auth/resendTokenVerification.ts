import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "interface/auth";
import AuthService from "services /auth_service/auth.service";
import { StatusResponse } from "interface/responses";
type verificationType = 'verification' | 'reset';
export interface ResendVerificationTokenBody{
    Body: {
        email: string;
        type: verificationType;
    };
} 
export interface ResendVerificationTokenResponse {
    status: string;
    success: boolean;
    message: string;
    verified: boolean;
}
export async function resendVerificationTokenController(request:FastifyRequest<ResendVerificationTokenBody>,reply:FastifyReply):Promise<ResendVerificationTokenResponse>{
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
        const {email,type} = request.body 
        const authService= new AuthService(request.server);
        const status:StatusResponse = await authService.resendToken(email,type);
        if(!status.success){
            log.warn(ck.yellow('Falha ao reenviar o token de verificação:', status.message));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: status.message || 'Failed to resend verification token',
                verified: false
            });
        }
        const response: ResendVerificationTokenResponse = {
            status: status.status || 'pending',
            success: status.success,
            message: status.message || 'Verification token resent successfully',
            verified: status.verified
        };
        return reply.status(StatusCodes.OK).send(response);
    } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de reenvio de token:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        })
    }
}