import { FastifyInstance } from "fastify";
import { StatusCodes } from "http-status-codes";
import ck from "chalk";
import log from "consola";
export async function hooksFastify(app:FastifyInstance){
     // ✅ Hook para autenticação (apenas rotas protegidas)
    app.addHook("onRequest", async (request, reply) => {
        // ✅ Definir quais rotas precisam de autenticação
        const protectedRoutes = [
            '/api/bookings',
            '/api/properties/create',
            '/api/properties/update',
            '/api/properties/delete',
            '/api/user/profile',
            '/api/reviews'
        ];//adicinando as rotas que precisam de autenticacao
        
        // ✅ Verificar se a rota atual precisa de autenticação
        const isProtected = protectedRoutes.some(route => 
            request.url.startsWith(route)
        );
        
        // ✅ Só verificar token se for rota protegida
        if (isProtected) {
            try {
                const token = request.headers.authorization?.split(" ")[1];
                if (!token) {
                    return reply.status(StatusCodes.UNAUTHORIZED).send({
                        error: `${ck.red("Token de autenticação não fornecido")}`,
                    });
                }
                const decoded = await app.jwt.verify(token);
                request.user = decoded;
            } catch (error) {
                return reply.status(StatusCodes.BAD_REQUEST).send({
                    error: `${ck.red("Erro ao verificar autenticação")}`,
                });
            }
        }
    });
}