import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "interface/auth";
import AuthService from "services /auth_service/auth.service";
import { StatusResponse } from "interface/responses";
import { ResetPasswordBody, ResetPasswordResponse } from "#interface/interface.auth.response.js";
import { resetPasswordSchema } from "#schemas/auth.schema.js";

export async function resetPasswordController(
    request: FastifyRequest<ResetPasswordBody>,
    reply: FastifyReply
):Promise<ResetPasswordResponse| void>{
    try {
        const data = resetPasswordSchema.safeParse(request.body);
        if(!data.success) {
            log.error(ck.red('Erro de validação no resetPassword:', data.error));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: data.error.issues.map(issue => issue.message).join(', '),
                verified: false
            });
        }
        if (!request.server.mongo || !request.server.mongo.db) {
            log.error(ck.red('MongoDB não está disponível na instância do servidor'));
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            });
        }
        const { token, email, newPassword,role } = request.body;
        const authService = new AuthService(request.server);
        const status: StatusResponse = await authService.resetPassword(token, email, newPassword,role);
        
        if (!status.success) {
            log.warn(ck.yellow('Falha ao redefinir a senha:', status.message));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: status.message || 'Failed to reset password',
                verified: false
            });
        }
        
        const response: ResetPasswordResponse = {
            user: status.user as User,
            token: status.token,
            status: status.status || 'reset',
            success: status.success,
            message: status.message || 'Password reset successfully',
            verified: status.verified
        };
          reply.setCookie('token',response.token|| '',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'strict',
            maxAge:7*24*60*60*1000 // 
        })
        return reply.status(StatusCodes.OK).send(response);
    } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de redefinição de senha:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        })
    }
}