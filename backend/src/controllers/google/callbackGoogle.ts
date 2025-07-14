import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
interface GoogleCallbackQuery {
    Querystring: {
        code: string;
        state?: string;
    }
}

export async function callbackGoogle(request:FastifyRequest<GoogleCallbackQuery>,reply:FastifyReply):Promise<void>{
    try {
        const {code,state} = request.query
        if(!code){
            reply.status(StatusCodes.BAD_REQUEST).send({
               status: 'error',
                success: false,
                message: 'Authorization code missing',
                verified: false
            })
        }
        
    } catch (error) {
        
    }
}