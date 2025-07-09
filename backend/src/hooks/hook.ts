import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import ck from "chalk";
export const verifyAuth = async function(app:FastifyInstance){
    app.addHook("onRequest",async (request,reply)=>{
        try {
            const token = request.headers.authorization?.split(" ")[1];
            if(!token){
                return reply.status(StatusCodes.UNAUTHORIZED).send({
                    error:`${ck.red("Token de autenticação não fornecido")}`,
                })
            }
            const decoded = await app.jwt.verify(token)
            request.user = decoded 
        } catch (error) {
            return reply.status(StatusCodes.BAD_REQUEST).send({
                error:`${ck.red("Erro ao verificar autenticação")}`,
            })
        }
    })
}