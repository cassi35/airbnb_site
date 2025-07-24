import { FastifyRequest, FastifyReply, RouteGenericInterface } from "fastify";
//aqui vai ser responsavel por pegar o anuncio feito pelo anunciante
import log from 'consola'
import ck from 'chalk';
import { Property } from "#database/schemas/property.schema.js";
import { StatusCodes } from "http-status-codes";
import Announcement from "services /advertiser/anuncioCrud.service";
export interface GetActiveAnnouncementsResponse {
    success: boolean;
    message: string;
    announcements?: Property[]; // Lista de anúncios ativos
}
export async function getActiveAnnouncementsController(request:FastifyRequest,reply:FastifyReply):Promise< GetActiveAnnouncementsResponse >{
 try {
    const service = new Announcement(request.server)
    const all = await service.getAllActiveAnnouncements()
    if(!all.success){
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: all.message
        });
    }
    return reply.status(StatusCodes.OK).send({
        success: true,
        message: `${ck.green('Active announcements retrieved successfully')}`,
        announcements: all.announcements
    })
 } catch (error) {
    log.error(`${ck.red('Error fetching active announcements:')} ${error}`);
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: `Internal server error: ${error}`
    })
 }
}
