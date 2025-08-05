import {FastifyInstance} from 'fastify'
import { Server } from 'socket.io';
export type DefineRoutesHandler = (app:FastifyInstance) => Promise<void> | void
// Definir o tipo do usuário JWT
// Definir o tipo do usuário JWT
export interface JWTuser {
    id: string;
    email: string;
}

declare module 'fastify' {
    interface FastifyRequest {
        requestId?: string;
        startTime?: number;
        jwtUser?: JWTuser; // Mudei para jwtUser ao invés de user
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: JWTuser;
    }
}
declare module 'fastify' {
    interface FastifyInstance {
        io:Server
    }
}