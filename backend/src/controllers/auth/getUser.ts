import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { GetUserByEmailBody, ResponseGetUserByEmail } from "#interface/interface.auth.response.js";
import { User } from "#interface/auth.js";
import AuthService from "services /auth_service/auth.service";
import { getUserSchema } from "#schemas/auth.schema.js";
export async function getUserController(request:FastifyRequest<GetUserByEmailBody>,reply:FastifyReply):Promise<ResponseGetUserByEmail>{
    try {
        const data = getUserSchema.safeParse(request.body);
        if(!data.success) {
            log.error(ck.red('Erro de validação no getUser:', data.error));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                user: undefined,
                status: 'error',
                success: false,
                message: data.error.issues.map(issue => issue.message).join(', '),
                verified: false
            });
        }
        const authService = new AuthService(request.server); 
        const mongo = await authService.serverError()
        const email = request.body.email
        const role = request.body.role || 'user'; // Default to 'user' if role is not provided
        if(!mongo.success){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                user: undefined,
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            })
        }
        const status = await authService.getUserByEmail(email,role);
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
            user: status.user as User,
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