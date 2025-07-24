import log from 'consola'
import ck from 'chalk'
import { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import Announcement from 'services /advertiser/anuncioCrud.service'
export async function getAllAnnouncementsController(request:FastifyRequest,reply:FastifyReply):Promise<void>{
    try {
        const serviceAnnouncement = new Announcement(request.server)
        const announcements = await serviceAnnouncement.getAllAnnouncements()
        if(!announcements){
            return reply.status(StatusCodes.NOT_FOUND).send({
                success:false,
                message:`${ck.red('No announcements found')}`
            })
        }
        return  reply.status(StatusCodes.OK).send({
            success:true,
            message:`${ck.green('Announcements retrieved successfully')}`,
            announcements:announcements
        })
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            sucess:false,
            message:`error internal ${ck.red(error)}`
        })
    }
}