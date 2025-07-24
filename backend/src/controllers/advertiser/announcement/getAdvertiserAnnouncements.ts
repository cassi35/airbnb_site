import { Property } from "#database/schemas/property.schema.js";
import { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import Announcement from "services /advertiser/anuncioCrud.service";
// Controller responsável por listar os anúncios do anunciante
interface AnnouncemetsParams extends RouteGenericInterface{
    Params: {
        id: string; // ID do anunciante
    };
}
interface AnnouncementsResponse{
    success: boolean;
    message: string;
    announcements?: Property[]; // Lista de anúncios do anunciante
}
export async function getAdvertiserAnnouncementsController(request:FastifyRequest<AnnouncemetsParams>,reply:FastifyReply):Promise<AnnouncementsResponse>{
    try {
        const {id} = request.params
        if(typeof id !== 'string' || !ObjectId.isValid(id)){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid ID format'
            });
        }
        const params = new ObjectId(id)
        const service = new Announcement(request.server)
        const response = await service.getAnnouncementsById(params)
        if(!response.success){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: response.message
            });
        }
        return reply.status(StatusCodes.OK).send({
            success: true,
            message: 'Announcements retrieved successfully',
            announcements: response.announcement
        })
    } catch (error) {
        const errorMessage:AnnouncementsResponse = {
            success:false,
            message:`internal error ${error}`
        }
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorMessage)
    }
}
