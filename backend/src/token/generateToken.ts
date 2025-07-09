import { FastifyInstance } from "fastify";
import { FastifyReply } from "fastify";

// Apenas gera o token JWT
export const generateJWT = (app: FastifyInstance, id: string): string => {
    return app.jwt.sign({ id }, { expiresIn: "1d" });
};

// Configura cookie (usado apenas nas rotas)
export const setTokenCookie = (reply: FastifyReply, token: string): void => {
    reply.setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

// Função completa (para uso nas rotas)
export const generateToken = (app: FastifyInstance, id: string, reply: FastifyReply): string => {
    const token = generateJWT(app, id);
    setTokenCookie(reply, token);
    return token;
};