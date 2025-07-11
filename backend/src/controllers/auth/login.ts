import log from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "interface/auth";
import AuthService from "services /auth_service/auth.service";
import { StatusResponse } from "interface/responses";
export interface UserBody{
    Body:{
        email:string,
        password:string,
        role?:string
    }
}
export interface ResponseLogin{
    user?:User,
    token?:string,
    status:string,
    success:boolean,
    verified:boolean,
    cookie?:string
}
export async function loginController(
    request:FastifyRequest<UserBody>,
    reply:FastifyReply
):Promise<void>{
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
        const userData = request.body 
        const authService = new AuthService(request.server);
        const status:StatusResponse = await authService.loginUser(userData.email, userData.password, userData.role || 'user');
        if(!status.success){
            log.warn(ck.yellow('Login failed:', status.message));
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                status: 'error',
                success: false,
                message: status.message || 'Login failed',
                verified: false
            });
        }
        const response = {
            user: status.user,
            token: status.token,
            status: status.status || 'success',
            success: status.success,
            message: status.message || 'User logged in successfully',
            verified: status.verified
        }
        reply.setCookie('token', response.token || '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
        });
        return reply.status(StatusCodes.OK).send(response);
    } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de login:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        })
    }
}