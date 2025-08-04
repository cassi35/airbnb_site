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
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<any>
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};
export type OptionSearchBody = DeepPartial<searchBody>
const searchSchema = z.object({
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),

  houseRules: z.object({
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    smokingAllowed: z.boolean().optional(),
    petsAllowed: z.boolean().optional(),
    partiesAllowed: z.boolean().optional(),
  }).optional(),

  details: z.object({
    bedrooms: z.number().optional(),
    bathrooms: z.number().optional(),
    beds: z.number().optional(),
    guests: z.number().optional(),
    amenities: z.array(z.string()).optional(),
  }).optional()
}) satisfies z.ZodType<OptionSearchBody>;

//aonde , quantos hospedes , localizacao 
export async function getSearchListingAnnouncementsController(request:FastifyRequest,reply:FastifyReply):Promise<SearchAnnouncementResponse> {
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