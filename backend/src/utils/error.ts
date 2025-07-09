import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import {StatusCodes} from 'http-status-codes'
import { ZodError } from "zod/v4";
function handler(error:FastifyError,_:FastifyRequest,reply:FastifyReply){
    if(error instanceof ZodError){
        return reply.status(StatusCodes.BAD_REQUEST).send({
            status:StatusCodes.BAD_REQUEST,
            message:"Validation error",
            errors:error
        })
    }
    if(error.validation){
        return reply.status(StatusCodes.BAD_REQUEST).send({
            status:StatusCodes.BAD_REQUEST,
            message:"Validation error",
            errors:error.validation
        })
    }
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        status:StatusCodes.INTERNAL_SERVER_ERROR,
        message:"Internal server error",
        error:error.message
    })
}
export {handler as errorHandler}