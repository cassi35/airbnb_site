import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetUserByEmailBody, ResponseGetUserByEmail } from "#interface/interface.auth.response.js";
import { User } from "#interface/auth.js";
import AuthService from "services /auth_service/auth.service";
export async function getUserController(request:FastifyRequest<GetUserByEmailBody>,reply:FastifyReply):Promise<ResponseGetUserByEmail>{
    try {
        const authService = new AuthService(request.server); 
        const mongo = await authService.serverError()
        const email = request.body.email
        if(!mongo.success){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                user: undefined,
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            })
        }
        const status = await authService.getUserByEmail(email);
        if(!status.success){
            log.warn(ck.yellow('Failed to get user by email:', status.message));
            return reply.status(StatusCodes.NOT_FOUND).send({
                user: undefined,
                status: 'error',
                success: false,
                message: status.message || 'User not found',
                verified: false
            });

        }
        const response: ResponseGetUserByEmail = {
            user: status.user,
            status: status.status || 'found',
            success: status.success,
            message: status.message || 'User retrieved successfully',
            verified: status.verified
        };
        return reply.status(StatusCodes.OK).send(response);
        } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de busca de usuário:', error));
        return {
            user: undefined,
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        };
    }

}