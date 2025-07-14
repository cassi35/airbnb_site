import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from "console";
import ck from "chalk";
import GoogleAuthService from "services /auth_service/googleAuth.service";
export async function redirectGoogle(request:FastifyRequest,reply:FastifyReply):Promise<void>{
    try {
        const googleService = new GoogleAuthService(request.server);
        const authUrl = googleService.getGoogleAuthUrl();
        log.info(ck.green('Redirecionando para URL de autenticação do Google:', authUrl));
        return reply.redirect(authUrl);
    } catch (error) {   
        log.error(ck.red('Erro ao redirecionar para o Google:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
        
    }
}