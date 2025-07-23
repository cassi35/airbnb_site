import { Property, propertySchema } from "#database/schemas/property.schema.js";
import { FastifyRequest, FastifyReply } from "fastify";
import Announcement from "services /advertiser/anuncioCrud.service";
import {StatusCodes} from 'http-status-codes'
import Profile from "services /advertiser/gestaoPerfil.service";
import { ObjectId } from "mongodb";
// Controller responsável por criar um novo anúncio
interface CreateAnnouncementResponse {
    success:boolean
    message:string
    announcement?: Property
}
export async function createAnnouncementController(request:FastifyRequest,reply:FastifyReply):Promise<void | CreateAnnouncementResponse>{
    try {
       const data = propertySchema.safeParse(request.body);
       if(!data.success){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: data.error.issues.map(issue => issue.message).join(', ')
            });
       }
       const service = new Announcement(request.server)
       const response = await service.createAnnouncement(data.data);
       if(!response.success){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                success: false,
                message: response.message
            });
       }
       const userId = request.jwtUser?.id
       if(!userId){
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                success: false,
                message: 'User ID not found in JWT token'
            });
       }
       if(!response.announcement){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'Announcement creation failed, no announcement returned'
            });
       }
       const postGetAnnouncement = await service.getAnnouncements(new ObjectId(userId),response.announcement)
       if(!postGetAnnouncement.success){
           return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
               success: false,
               message: 'Error fetching announcements after creation'
           });
       }
       return reply.status(StatusCodes.CREATED).send({
           success: true,
           message: 'Announcement created successfully',
           announcement: postGetAnnouncement.announcements
       });
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Internal server error'
        });
    }
}