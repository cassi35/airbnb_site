import { Property } from "#database/schemas/property.schema.js";
import { RouteGenericInterface } from "fastify";
import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { StatusCodes } from "http-status-codes";
import { success } from "zod/v4";
import ck from "chalk";
import { type } from "node:os";
import Listing from "services /listing/listing.service";
import { ObjectId } from "mongodb";
import { de } from "zod/v4/locales";

export interface deleteAnnouncementLListingParams extends RouteGenericInterface
{
    Params:{
        id:string
    }
}
export interface deleteAnnouncementFromListResponse {
    success: boolean;
    message: string;
    announcements?: Property[];
}
export async function deleteAnnouncementFromListController(request:FastifyRequest<deleteAnnouncementLListingParams>, reply:FastifyReply):Promise<deleteAnnouncementFromListResponse>{
    try {
        const id = request.params.id
        const userId = request.jwtUser?.id
        if(!userId){
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                success: false,
                message: "Unauthorized"
            });
        }
        if(typeof id !== 'string'){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: "Invalid ID format"
            });
        }
        const service = new Listing(request.server)
        const deletedAnnouncement = await service.deleteAnnouncementFromList(new ObjectId(userId), new ObjectId(id));
        if(!deletedAnnouncement.success){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: deletedAnnouncement.message
            });
        }
        return reply.status(StatusCodes.OK).send({
                success: true,
                message: "Announcement deleted successfully",
                announcements: deletedAnnouncement.announcements
            })
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success:false,
            message:`Internal Server Error: ${ck.red(error)}`
        })
    }
}
//nesse controller eu vou deletar o announcement da lista