import { GoogleUser } from "#interface/google.schema.js";
import { User } from "@sentry/node";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import UserService from "services /user/user.service";
export interface UserResponse{
    success: boolean,
    message: string,
    user?: User | GoogleUser | null
}
export async function getUserProfileController(request:FastifyRequest,reply:FastifyReply):Promise<UserResponse>{
    try {
        const userId = request.jwtUser?.id
        if (!userId) {
           return reply.status(StatusCodes.UNAUTHORIZED).send({
                success:false,
                message: "Unauthorized access"
           })
        }
        const service = new UserService(request.server);
        const user = await service.getUserById(new ObjectId(userId))
        if(!user.success){
            return reply.status(StatusCodes.NOT_FOUND).send({
                success: false,
                message: "User not found"
            })
        }
        return reply.status(StatusCodes.OK).send({
            success: true,
            message: "User retrieved successfully",
            user: user.user
        })
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "An error occurred while processing your request",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}