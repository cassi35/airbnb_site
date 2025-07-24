import { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import Announcement from "services /advertiser/anuncioCrud.service";
// Controller responsável por deletar um anúncio
export interface DeleteRouteAnnouncement extends RouteGenericInterface{
    Params: {
        id: string;
    };
}

export interface DeleteAnnouncementResponse{
    success: boolean;
    message: string;
}
export async function deleteAnnouncementController(request:FastifyRequest<DeleteRouteAnnouncement>,reply:FastifyReply):Promise<DeleteAnnouncementResponse>{
    try {
        const idParams = request.params.id
        if(typeof idParams !== 'string' || !ObjectId.isValid(idParams)){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid ID format'
            })
        }
        const service = new Announcement(request.server) 
        const id = new ObjectId(idParams)
        const deleteAnnoucement = await service.deleteAnnouncement(id)
        if(!deleteAnnoucement.success){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: deleteAnnoucement.message
            })
        }
        return reply.status(StatusCodes.OK).send(deleteAnnoucement)
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success:false,
            message:`internal error :${error}`
        })
    }
}
