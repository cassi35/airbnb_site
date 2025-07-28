import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";
import { ObjectId } from "mongodb";
import { StatusCodes } from "http-status-codes"; 
import Listing from "services /listing/listing.service";
import { Property } from "#database/schemas/property.schema.js";
import log from 'consola'
import ck from 'chalk';
export interface InsertListingResponse {
    sucess:boolean
    message:string
    announcement?: Property // Assuming Property is the type for the listing
}
//insert listing controller 
interface Params extends RouteGenericInterface{
    Params:{
        id:string 
    }
}
export async function insertListController(request:FastifyRequest<Params>,reply:FastifyReply):Promise<InsertListingResponse>{
    try {
        const id = request.params.id
        if(typeof id != 'string'|| !ObjectId.isValid(id)){
            return reply.status(StatusCodes.BAD_REQUEST).send({
                sucess: false,
                message: 'Invalid ID format'
            });
        }
        const idAnnnouncement = new ObjectId(id)
        const userId = request.jwtUser?.id
        if(!userId){
            return reply.status(StatusCodes.UNAUTHORIZED).send({
                sucess: false,
                message: 'Unauthorized'
            });
        }
        const service = new Listing(request.server)
        const insert = await service.insertingList(new ObjectId(userId), idAnnnouncement);
        if(!insert.sucess){
            return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                sucess: false,
                message: insert.message
            });
        }
        return reply.status(StatusCodes.CREATED).send({
            sucess: true,
            message: 'Listing inserted successfully',
            listing: insert.announcement // Assuming the service returns the updated listing
        })
    } catch (error) {
        log.error(ck.red(`Error in insertListController: ${error}`));
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            sucess: false,
            message: 'Internal Server Error'
        });
    }
}
//vou pegar o id do usuario e inserir na lista o id do anuncio
//e retornar o anuncio atualizado com o id do usuario