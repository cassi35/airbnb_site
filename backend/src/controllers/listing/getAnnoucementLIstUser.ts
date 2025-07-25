import { Property } from "#database/schemas/property.schema.js";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import Listing from "services /listing/listing.service";

export interface getAnnouncementListUserResponse {
    success: boolean;
    message: string;
    announcements?: Property[]; // Array of properties
}

export async function getAnnouncementListUserController(request:FastifyRequest,reply:FastifyReply):Promise<getAnnouncementListUserResponse> {
    try {
        const userId = request.jwtUser?.id
        if(!userId){
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                success: false,
                message: "Unauthorized"
            })
        }
        const id = new ObjectId(userId)
        const service = new Listing(request.server)
        const result = await service.getAllAnnouncementLists(id)
        if(!result.success){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: result.message
            })
        }
        return reply.status(StatusCodes.OK).send(result)
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}