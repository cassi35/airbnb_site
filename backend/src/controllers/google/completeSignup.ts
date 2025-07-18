import { GoogleUser } from "#interface/google.schema.js";
import { welcomeEmail } from "emails/email";
import { FastifyReply, FastifyRequest } from "fastify";
import CacheService from "services /auth_service/redis.service";
const { StatusCodes } = require("http-status-codes");
interface GoogleCompleteSignupBody {
    Body:{
        role:'user'| 'admin'|'adviser'
        user?:GoogleUser;
    }
}

export function googleCompleteSignupController(request:FastifyRequest<GoogleCompleteSignupBody>,reply:FastifyReply): Promise<void> {
    try {
        const {role,user} = request.body
        if(!user || !role){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'User data is required',
                verified: false
            });
        }
        const cache = new CacheService(request.server);
        const userCache = cache.getUserFromCache(user.email)
        if(!userCache){
            return reply.status(StatusCodes.NOT_FOUND).send({
                status: 'error',
                success: false,
                message: 'User not found in cache',
                verified: false
            });

        }
        const newUser:GoogleUser = {
            role:role,
        }
        // await welcomeEmail(userResult.user.email)
    } catch (error) {
        
    }
}