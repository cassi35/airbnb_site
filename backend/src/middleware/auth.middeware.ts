import { FastifyRequest, FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import ck from 'chalk';
import { JWTuser } from '#types/type.js';

export async function verifyAuthMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    try {
        console.log('🔍 Middleware de auth chamado para:', request.method, request.url);
        console.log('🔍 Headers authorization:', request.headers.authorization);
        
        const token = request.headers.authorization?.split(" ")[1];
        console.log('🔍 Token extraído:', token);
        
        if (!token) {
            console.log('❌ Token não encontrado');
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                error: `${ck.red("Token de autenticação não fornecido")}`,
            });
        }
        
        console.log('✅ Verificando token...');
        const decoded = await request.server.jwt.verify(token);
        console.log('✅ Token decodificado:', decoded);
        
        request.jwtUser = decoded as JWTuser;
        console.log('✅ jwtUser atribuído com sucesso');
        
    } catch (error) {
        console.log('❌ Erro ao verificar token:', error);
        return reply.status(StatusCodes.BAD_REQUEST).send({
            error: `${ck.red("Erro ao verificar autenticação")}`,
        });
    }
}