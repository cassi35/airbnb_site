import { partialPropertySchema, Property, propertySchema } from "#database/schemas/property.schema.js";
import { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import Announcement from "services /advertiser/anuncioCrud.service";
export interface UpdateAnnouncementResponse {
    success:boolean
    message:string
    announcement?: Property
    object_error?:object
}
export interface UpdateAnnouncementParams extends RouteGenericInterface{
    Params:{
        id:string //id do anuncio
    },
    Body:Partial<Property> // Dados do anúncio a serem atualizados
}
// Controller responsável por atualizar um anúncio
export async function updateAnnouncementController(request:FastifyRequest<UpdateAnnouncementParams>,reply:FastifyReply):Promise<UpdateAnnouncementResponse>{
    try {
        const { id } = request.params;
        if(typeof id !== 'string' || !ObjectId.isValid(id)){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: 'Invalid ID format'
            });
        }
        let body = partialPropertySchema.safeParse(request.body);
        if(!body.success){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: body.error.issues.map(issue => issue.message).join(', ')
            });

        }
        const service = new Announcement(request.server)
        const announcementId = new ObjectId(id);
        const updateResponse = await service.updateAnnouncement(announcementId, body.data);
        if(!updateResponse.success){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: updateResponse.message,
                object_error:updateResponse.object_error
            });
        }
        return reply.status(StatusCodes.OK).send({
            success: true,
            message: 'Announcement updated successfully',
            announcement: updateResponse.announcement
        })
    } catch (error) {
        const errorMessage:UpdateAnnouncementResponse = {
            success: false,
            message: `Internal server error: ${error}`
        }
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorMessage)
    }
}