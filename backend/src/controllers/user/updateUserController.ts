import { User } from "#interface/auth.js";
import { GoogleUser } from "#interface/google.schema.js";
import user from "#routes/user/user.js";
;
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import UserService from "services /user/user.service";
import z from "zod";

export interface UpdateUserResponse{
    sucess:boolean
    message:string
    user?:any
}
export interface UpdateUserSchema
{
    email?:string 
    password?:string 
    name?:string
    profile?:string
}
export const updateSchemaUser = z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    name: z.string().min(1).optional(),
    profile: z.string().url().optional()
}) satisfies z.ZodType<UpdateUserSchema>
export async function updateUserController(request:FastifyRequest,reply:FastifyReply):Promise<UpdateUserResponse>{
    try {
    const data = updateSchemaUser.safeParse(request.body);
          if(!data.success){
        return reply.status(StatusCodes.BAD_REQUEST).send({
            status: 'error',
            message: 'Invalid data',
            errors: data.error.errors
        });
    }
    const userId = request.jwtUser?.id
    if(!userId)
    {   
        return reply.status(StatusCodes.BAD_REQUEST).send({
            status: 'error',
            message: 'User ID is required'
        });
    }
    const userService = new UserService(request.server)
    const profile = await userService.updateUserProfile(data.data,new ObjectId(userId))
    if(!profile.sucess){
        return reply.status(StatusCodes.NOT_FOUND).send({
            sucess:false,
            message:profile.message,
            user:null
        })
    }
    return reply.status(StatusCodes.OK).send({
        sucess:true,
        message:profile.message,
        user: profile.user ?? undefined
    })
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success:false,
            message:"an error to update the user",
            user:null 
        })
    }
}