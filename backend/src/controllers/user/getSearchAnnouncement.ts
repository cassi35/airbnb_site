//aqui é aonde eu vou fazer a pesquisa das acomodacoes
//ativos 

import { Property } from "#database/schemas/property.schema.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import UserService from "services /user/user.service";
import z from "zod";
export interface SearchAnnouncementResponse {
    success: boolean;
    message: string;
    announcements?: Property[]; // Array of announcements
}
export type searchBody = Pick<Property,'location' | 'houseRules' | 'details'>
export interface SearchBody{
    Body:searchBody
} 
const searchSchema = z.object({
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
  }),

  houseRules: z.object({
    checkIn: z.string(),
    checkOut: z.string(),
    smokingAllowed: z.boolean(),
    petsAllowed: z.boolean(),
    partiesAllowed: z.boolean(),
  }),

  details: z.object({
    bedrooms: z.number(),
    bathrooms: z.number(),
    beds: z.number(),
    guests: z.number(),
    amenities: z.array(z.string()),
  })
}) satisfies z.ZodType<searchBody>;

//aonde , quantos hospedes , localizacao 
export async function getSearchListingAnnouncementsController(request:FastifyRequest<SearchBody>,reply:FastifyReply):Promise<SearchAnnouncementResponse> {
    try {
        const data = searchSchema.safeParse(request.body);
        if(!data.success){
            return reply.status(400).send({
                success: false,
                message: "Invalid search parameters",
                errors: data.error.errors
            });
        } 
      const service = new UserService(request.server)
      const search = await service.searchAnnouncements(data.data)
      if(!search.success){
        return reply.status(StatusCodes.NOT_FOUND).send({
            success: false,
            message: search.message
        })
      }
      return reply.status(StatusCodes.OK).send({
          success: true,
          message: "Search completed successfully",
          announcements: search.announcements
      })
    } catch (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "An error occurred while processing your request",
            error: error instanceof Error ? error.message : "Unknown error"
        })
    }
}