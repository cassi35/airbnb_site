import { FastifyInstance } from "fastify";
// Importe o tipo correto que inclui setCookie
import { FastifyReply } from "fastify";

export const generateToken = (app: FastifyInstance, id: string, reply: FastifyReply): string => {
    const token = app.jwt.sign({ id }, { expiresIn: "1d" });
    reply.setCookie('token', token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: "strict",
         maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return token;
}