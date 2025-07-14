// src/controllers/google/logoutWithGoogle.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from 'consola';
import ck from 'chalk';
import GoogleAuthService from "services /auth_service/googleAuth.service";

interface LogoutGoogleBody {
    Body: {
        email: string;
    }
}

export async function logoutWithGoogle(request: FastifyRequest<LogoutGoogleBody>, reply: FastifyReply): Promise<void> {
    try {
        const { email } = request.body;
        
        if (!email) {
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'Email is required',
                verified: false
            });
        }

        // ✅ BUSCAR USUÁRIO NO BANCO
        const user = await request.server.mongo.db?.collection('users').findOne({ email });
        
        // ✅ VERIFICAR SE USUÁRIO EXISTE
        if (!user) {
            log.warn(ck.yellow('User not found for logout:', email));
            return reply.status(StatusCodes.NOT_FOUND).send({
                status: 'error',
                success: false,
                message: 'User not found',
                verified: false
            });
        }

        // ✅ VERIFICAR SE TEM GOOGLE ACCESS TOKEN
        if (!user.googleAccessToken) {
            log.warn(ck.yellow('No Google access token found for user:', email));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'No Google access token found for this user',
                verified: false
            });
        }

        const googleService = new GoogleAuthService(request.server);
        
        // ✅ REVOGAR TOKEN NO GOOGLE
        const revokeResult = await googleService.revokeGoogleToken(user.googleAccessToken);
        
        if (!revokeResult.success) {
            log.error(ck.red('Failed to revoke Google token:', revokeResult.message));
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Failed to revoke Google token',
                verified: false
            });
        }

        // ✅ LIMPAR GOOGLE ACCESS TOKEN DO BANCO
        const updateResult = await request.server.mongo.db?.collection('users').updateOne(
            { email },
            { $unset: { googleAccessToken: "" } }
        );

        if (!updateResult?.acknowledged) {
            log.error(ck.red('Failed to update user in database:', email));
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Failed to update user in database',
                verified: false
            });
        }

        // ✅ LIMPAR COOKIE
        reply.clearCookie('token');

        log.success(ck.green('Google logout successful for user:', email));
        return reply.status(StatusCodes.OK).send({
            status: 'success',
            success: true,
            message: 'Google logout successful',
            verified: false
        });
        
    } catch (error) {
        log.error(ck.red('Error during Google logout:', error));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
    }
}