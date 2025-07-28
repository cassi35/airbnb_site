import { Property } from "#database/schemas/property.schema.js";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import Listing from "services /listing/listing.service";
export interface getAnnouncementParams extends RouteGenericInterface{
    Params:{
        id:string 
    }
}
export interface getAnnouncementResponseListing {
    sucess:boolean
    message:string
    announcement?:Property
}
export async function getAnnouncementsController(request:FastifyRequest<getAnnouncementParams>, reply:FastifyReply):Promise<getAnnouncementResponseListing>{
    try {
        const id = request.params.id 
        if(typeof id != 'string'){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                sucess:false,
                message:'Invalid ID format'
            })
        }
        const id_announcement = new ObjectId(id)
        const userId = request.jwtUser?.id 
        if(!userId){
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                sucess:false,
                message:'Unauthorized'
            })
        }
        const service = new Listing(request.server)
        const announcement = await service.getAnnouncementOfUserList(new ObjectId(userId),id_announcement)
        if(!announcement.sucess){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                sucess:false,
                message:announcement.message
            })
        }
        return reply.status(StatusCodes.OK).send(announcement)
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            sucess:false,
            message:'Internal Server Error'
        })
    }
}
//nesse controller eu vou pegar o announcement pelo id