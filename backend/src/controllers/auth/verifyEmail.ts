    import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "interface/auth";
import AuthService from "services /auth_service/auth.service";
import { StatusResponse } from "interface/responses";
import { ResponseVerifyEmail, UserBodyVerifyEmail } from "#interface/interface.auth.response.js";


export async function verifyEmailController(
    request:FastifyRequest<UserBodyVerifyEmail>,
    reply:FastifyReply
):Promise<void>{
    try {
        const userData = request.body 
        if (!userData || !userData.verificationToken || !userData.email) {
            log.warn(ck.yellow('Dados de verificação de email inválidos:', userData));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'Invalid verification data',
                verified: false
            });
        }
        const authService = new AuthService(request.server);
        const status:StatusResponse = await authService.verifyToken(userData.verificationToken, userData.email);
        if(!status.success){
            log.warn(ck.yellow('Falha na verificação do token:', status.message));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: status.message || 'Token verification failed',
                verified: false
            });
        }

        const response:ResponseVerifyEmail = {
            user: status.user,
            token: status.token,
            status: status.status || 'verified',
            success: status.success,
            message: status.message || 'Email verified successfully',
            verified: true
        };
        reply.setCookie('token',response.token|| '',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'strict',
            maxAge:7*24*60*60*1000 // 
        })
        return reply.status(StatusCodes.OK).send(response);
    } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de verificação de email:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });      
    }
}
