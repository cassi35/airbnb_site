import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import ck from "chalk";
import { JWTuser } from "#types/type.js";
export async function hooksFastify(app:FastifyInstance){
  app.addHook("onRequest",async (request,reply)=>{
      console.log('🔍 Hook chamado para:', request.method, request.url);
    console.log('🔍 Headers authorization:', request.headers.authorization);
        try {
            const token = request.headers.authorization?.split(" ")[1];
            console.log('🔍 Token extraído:', token);
            if(!token){
                 console.log('❌ Token não encontrado');
                return reply.status(StatusCodes.UNAUTHORIZED).send({
                    error:`${ck.red("Token de autenticação não fornecido")}`,
                })
            }
            console.log('✅ Verificando token...');
            const decoded = await app.jwt.verify(token)
            console.log('✅ Token decodificado:', decoded);
            request.jwtUser = decoded as JWTuser
            console.log('✅ jwtUser atribuído com sucesso');
        } catch (error) {
            console.log('❌ Erro ao verificar token:', error);
            return reply.status(StatusCodes.BAD_REQUEST).send({
                error:`${ck.red("Erro ao verificar autenticação")}`,
            })
        }
    }) // para verificar o token JWT em cada requisição
    
}