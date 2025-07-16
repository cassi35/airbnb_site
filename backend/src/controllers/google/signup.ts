import { FastifyRequest, FastifyReply } from "fastify";
import { StatusCodes } from "http-status-codes";
import GoogleAuthService from "services /auth_service/googleAuth.service";
import { generateToken, setTokenCookie } from "token/generateToken";
import { User } from "interface/auth";
import  log  from "console";
import CacheService from "services /auth_service/redis.service";

interface GoogleSignupBody {
    Body: {
        token: string; // Token temporário do cache
        role: 'user' | 'advertiser' | 'host';
        advertiserData?: {
            isAdvertiser: boolean;
            companyName: string;
            contactEmail: string;
            phone: string;
            businessType: string;
            totalAnnouncements?: number;
            activeAnnouncements?: number;
            totalSpent?: number;
            status?: string;
            verificationStatus?: string;
        };
        hostData?: {
            isHost: boolean;
            propertyCount?: number;
            totalEarnings?: number;
            verificationStatus?: string;
        };
    };
}

export async function googleSignupController(request:FastifyRequest<GoogleSignupBody>,reply:FastifyReply):Promise<void>{
    try {
        const {token,role,advertiserData,hostData}= request.body
        // 1 busca de dados do google no cache 
        const cache = new CacheService(request.server)
        
        const cacheData = await cache.get<{googleUser: User}>(token);
        if(!cacheData || !cacheData.googleUser){
            log.warn('Dados do Google não encontrados no cache para o token:', token);
            return reply.status(StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'Invalid or expired token',
                verified: false
            });
        }
         console.log('✅ Dados do Google encontrados no cache');
         const googleData = cacheData.googleUser
         const finalUserData:User = {
            email: googleData.email,
            name: googleData.name,
            picture: googleData.picture,
            role: role || 'user', // Define o papel do usuário
            provider: 'google',
               createdAt: new Date(),
            updatedAt: new Date()
         }
         if(role == 'advertiser' && advertiserData){
            finalUserData.advertiserData = {
                isAdvertiser: true,
                companyName: advertiserData.companyName,
                contactEmail: advertiserData.contactEmail,
                phone: advertiserData.phone,
                businessType: advertiserData.businessType,
                totalAnnouncements: advertiserData.totalAnnouncements || 0,
                activeAnnouncements: advertiserData.activeAnnouncements || 0,
                totalSpent: advertiserData.totalSpent || 0,
                status: advertiserData.status || 'active',
                verificationStatus: advertiserData.verificationStatus || 'pending'
            };
         }
    } catch (error) {
        log.error('Erro ao processar o signup com Google:', error);
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: error,
            verified: false
        })
    }
}