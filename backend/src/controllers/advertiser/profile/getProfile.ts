import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from "console";
import ck from "chalk";

import { GoogleUser } from "#interface/google.schema.js";
import Profile from "services /advertiser/gestaoPerfil.service";
import { User } from "#interface/auth.js";
interface JWTuser{
    id:string
    email:string
}
interface getProfileRequest extends FastifyRequest{
    jwtUser?:JWTuser
}

interface getProfileResponse {
    sucess:boolean
    message:string
    profile?:GoogleUser | User
}
//// Buscar perfil do anunciante
export async function getProfileController(request:getProfileRequest,reply:FastifyReply):Promise<getProfileResponse>{
    try {
         if (!request.jwtUser) {
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                sucess:false,
                message:`${ck.red("Token de autenticação não fornecido")}`,
            });
        }
        const userId = request.jwtUser?.id 
        if(!userId){
            log.warn(ck.yellow("User ID não encontrado no token JWT"));
            return reply.status(StatusCodes.BAD_REQUEST).send({
                sucess:false,
                message:`${ck.red("User ID não encontrado no token JWT")}`,
            })
        }
        const profileService = new Profile(request.server)
        const result = await profileService.getAdvertiserProfile(userId);
        if(!result){
            return reply.status(StatusCodes.NOT_FOUND).send({
                sucess:false,
                message:`${ck.red("Perfil de anunciante não encontrado")}`,
            })
        }
        return reply.status(StatusCodes.OK).send({
            sucess:true,
            message:`${ck.green("Perfil de anunciante encontrado")}`,
            profile:result
        })
    } catch (error) {
        log.error(ck.red("Erro ao buscar perfil do anunciante: "), error);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            sucess:false,
            message:error
        })
    }
}