import { GoogleUser } from "#interface/google.schema.js";
import { welcomeEmail } from "emails/email";
import { FastifyReply, FastifyRequest } from "fastify";
import CacheService from "services /auth_service/redis.service";
import log from "console";
import { GoogleCompleteSignupBody } from "#interface/interface.google.response.js";
import { googleCompleteSignupSchema } from "#schemas/auth.schema.js";
const { StatusCodes } = require("http-status-codes");


export async function googleCompleteSignupController(request:FastifyRequest<GoogleCompleteSignupBody>,reply:FastifyReply): Promise<void> {
    try {
        const data = googleCompleteSignupSchema.safeParse(request.body);
        if (!data.success) {
            log.error("Erro de validação no googleCompleteSignup:", data.error);
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: data.error.issues.map(issue => issue.message).join(', '),
                verified: false
            });
        }
        const {role,user,email} = request.body
        if(!user || !role || role != 'user' && role != 'admin' && role != 'advertiser' && role != 'host' || !email){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'User data is required',
                verified: false
            });
        }
        const cache = new CacheService(request.server,'googleAuth:');
    
        const userCache = await cache.get<GoogleUser>(email)
        if(!userCache){
            return reply.status(StatusCodes.NOT_FOUND).send({
                status: 'error',
                success: false,
                message: 'User not found in cache',
                verified: false,
                userCache
            });

        }
        
        const newUser:GoogleUser = {
            id: userCache.id,
           email: userCache.email,
           name: userCache.name,
           picture: userCache.picture,
           googleAccessToken:userCache.googleAccessToken,
           role: role,
        verified:true,
        createdAt: new Date(),
        updatedAt: new Date(),
        advertiserData:user['advertiserData'] || null,
        hostData:user['hostData'] || null,
        }
        
        await cache.clear() //limpa o cache
        switch(role){
            case 'user':
            await reply.server.mongo.db?.collection('user').insertOne(newUser);
            await welcomeEmail(newUser.email);
            log.info("Usuário cadastrado com sucesso:", newUser.email);
            return reply.status(StatusCodes.CREATED).send({
                status: 'success',
                success: true,
                message: 'User registered successfully',
                verified: true,
                cacheUser:userCache
            });
            case 'admin':
            await reply.server.mongo.db?.collection('admin').insertOne(newUser);
            await welcomeEmail(newUser.email);
            log.info("Admin cadastrado com sucesso:", newUser.email);
            return reply.status(StatusCodes.CREATED).send({
                status: 'success',
                success: true,
                message: 'Admin registered successfully',
                verified: true,
                cacheUser:userCache
            });
            case 'advertiser':
            await reply.server.mongo.db?.collection('advertiser').insertOne(newUser);
            await welcomeEmail(newUser.email);
            log.info("Advertiser cadastrado com sucesso:", newUser.email);
            return reply.status(StatusCodes.CREATED).send({
                status: 'success',
                success: true,
                message: 'Adviser registered successfully',
                verified: true,
                cacheUser:userCache
            })
        }
           
        
        
        // await welcomeEmail(userResult.user.email)
    } catch (error) {
        log.error("Erro ao completar o cadastro do Google:", error);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Failed to complete Google signup',
            verified: false
        });
    }
}