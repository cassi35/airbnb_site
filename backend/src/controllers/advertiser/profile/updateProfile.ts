
import { FastifyReply, FastifyRequest } from "fastify";
import Profile from "services /advertiser/gestaoPerfil.service";
import log from "consola";
import ck from "chalk";
import z from "zod";
import { User } from "#interface/auth.js";
import {StatusCodes} from 'http-status-codes'
interface UserUpdate {
    name?: string;
    picture?: string;
    contactEmail?: string;
    phone?: string;
    advertiserData?: {
        isAdvertiser?: boolean;
        companyName?: string;
        contactEmail?: string;
        phone?: string;
        businessType?: 'individual' | 'company' | 'agency';
        status?: 'active' | 'suspended' | 'inactive';
        verificationStatus?: 'pending' | 'verified' | 'rejected';
        totalAnnouncements?: number;
        activeAnnouncements?: number;
        totalSpent?: number;
    };
}
export const UpdateSchema = z.object({

  name: z.string().min(1).max(100).optional(),
  picture: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  phone: z.string().min(8).max(20).optional(),
  advertiserData: z.object({
    isAdvertiser: z.boolean().optional(),
    companyName: z.string().min(1).max(100).optional(),
    contactEmail: z.string().email().optional(),
    phone: z.string().min(8).max(20).optional(),
    businessType: z.enum(['individual', 'company', 'agency']).optional(),
    status: z.enum(['active', 'suspended', 'inactive']).optional(),
    verificationStatus: z.enum(['pending', 'verified', 'rejected']).optional(),
    // Os campos abaixo normalmente não são editáveis pelo usuário, mas podem ser incluídos se necessário:
    totalAnnouncements: z.number().optional(),
    activeAnnouncements: z.number().optional(),
    totalSpent: z.number().optional(),
  }).partial().optional(),
}) satisfies z.ZodType<UserUpdate>;
// Atualizar perfil (empresa, contato, etc.)
export async function updateProfileController(request:FastifyRequest,reply:FastifyReply):Promise<void>{
 
    try {
    const data = UpdateSchema.safeParse(request.body);
    if(!data.success){
        return reply.status(StatusCodes.BAD_REQUEST).send({
            status: 'error',
            message: 'Invalid data',
            errors: data.error.errors
        });

    }
     const userId = request.jwtUser?.id 
    if(!userId){
        return reply.status(StatusCodes.BAD_REQUEST).send({
            status: 'error',
            message: 'User ID is required'
        });
    }
    const service = new Profile(request.server);
    const update = await service.updateAdvertiserProfile(userId, data.data);
    if(!update.sucess){
        return reply.status(StatusCodes.BAD_REQUEST).send({
            status: 'error',
            message: update.message
        });  
    }
    return reply.status(StatusCodes.OK).send({
        status: 'success',
        message: 'Profile updated successfully',
        profile: update.profile
    });
  } catch (error) {
    log.error(`${ck.red('Erro ao atualizar perfil do anunciante:')} ${error}`);
    return reply.status(500).send({
        status: 'error',
        message: 'Internal server error'
    });
  }
   
}