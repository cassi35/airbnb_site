import  log  from "console";
import ck from "chalk";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { User } from "interface/auth";
import AuthService, { StatusResponse } from "services /auth.service";
interface UserBody{
    Body:User
}
function controller(request:FastifyRequest<UserBody>,reply:FastifyReply) {
      // Verifique se MongoDB está disponível
      try {
          if (!request.server.mongo || !request.server.mongo.db) {
            log.error(ck.red('MongoDB não está disponível na instância do servidor'));
            reply.code(500).send({
                status: 'error',
                success: false,
                message: 'Database connection error',
                verified: false
            });
            return
        }
    const userData = request.body
    const authService = new AuthService(request.server)
    return authService.createUser(userData).then((response)=>{
        reply.status(StatusCodes.CREATED).send(response)
    }).catch((error)=>{
         const response:StatusResponse = {
          status: 'error',
          success: false,
          message: error,
          verified: false
        }
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(response)
    })
      } catch (error) {
        log.error(ck.red('Erro ao processar a requisição de signup:', error));
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Internal server error',
            verified: false
        });
      }  
    
}
export {controller as signupController}
