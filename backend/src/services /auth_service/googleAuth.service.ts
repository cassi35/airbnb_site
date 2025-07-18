// Em googleAuth.service.ts
import { FastifyInstance } from "fastify";
import CacheService from "./redis.service";
import { googleConfig } from "#config/google.config.js";
import { StatusResponse } from "#interface/responses.js";
import { GoogleUserData } from "#interface/google.js";
import { User } from "#interface/auth.js";
import axios from 'axios'
import log from "console";
import { generateToken } from "token/generateToken";
import { GoogleUser } from "#interface/google.schema.js";

type changeForTokenResponse = {
    access_token?: string;
    error?: string;
}

type getGoogleUserDataResponse = {
    user?: GoogleUserData;
    error?: string;
}
export type googleUserOmited = Omit<GoogleUser,'id'> & {id:string}

class GoogleAuthService {
    private app: FastifyInstance;
    private cache: CacheService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.cache = new CacheService(app, 'googleAuth:');
    }

    // Gerar URL de autenticação do Google
    getGoogleAuthUrl(customData?: any): string {
          const stateData = customData ? 
            btoa(JSON.stringify(customData)) : // Codificar dados em base64
            this.generateState();
        const params = new URLSearchParams({
            client_id: googleConfig.clientId,
            redirect_uri: googleConfig.redirectUri,
            response_type: 'code',
            scope: googleConfig.scope.join(' '),
            access_type: 'offline',
            prompt: 'consent',
            state: stateData // ← Passa dados personalizados
        });
        return `${googleConfig.authUrl}?${params.toString()}`;
    }

    private generateState(): string {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    private async ErrorServer(): Promise<StatusResponse> {
        try {
            if (!this.app.mongo || !this.app.mongo.db) {
                log.error("MongoDB não está disponível na instância do servidor");
                return {
                    status: 'error',
                    success: false,
                    message: 'Database connection error',
                    verified: false
                };
            }
            return {
                status: 'success',
                success: true,
                message: 'MongoDB está disponível',
                verified: true
            };
        } catch (error) {
            log.error("Erro ao verificar o MongoDB:", error);
            return {
                status: 'error',
                success: false,
                message: 'Erro ao verificar o MongoDB',
                verified: false
            };
        }
    }

    async exchangeCodeForToken(code: string): Promise<changeForTokenResponse> {
        try {
            const response = await axios.post(googleConfig.tokenUrl, 
                new URLSearchParams({
                    code,
                    client_id: googleConfig.clientId,
                    client_secret: googleConfig.clientSecret,
                    redirect_uri: googleConfig.redirectUri,
                    grant_type: 'authorization_code'
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            const tokenData = response.data;
            if (!tokenData.access_token) {
                log.error("Erro ao obter access token:", tokenData.error);
                return { error: 'Erro ao obter access token' };
            }
            
            log.info("Access token obtido com sucesso");
            return { access_token: tokenData.access_token };
        } catch (error) {
            log.error("Erro ao trocar código por token:", error);
            return { error: 'Erro ao trocar código por token' };
        }
    }

    async getGoogleUserData(accessToken: string): Promise<getGoogleUserDataResponse> {
        try {
            const response = await axios.get(googleConfig.userInfoUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            
            const userData: GoogleUserData = response.data;
            if (!userData.email) {
                log.error("Dados do usuário do Google inválidos:", userData);
                return { error: 'Dados do usuário do Google inválidos' };
            }
            
            log.info("Dados do usuário do Google obtidos com sucesso:", userData.email);
            return { user: userData };
        } catch (error) {
            log.error("Erro ao obter dados do usuário do Google:", error);
            return { error: 'Erro ao obter dados do usuário do Google' };
        }
    }

    async authenticateGoogleUser(googleUser: GoogleUserData): Promise<StatusResponse> {
        try {
            const dbCheck = await this.ErrorServer();
            if (!dbCheck.success) {
                return dbCheck;
            }

            const {id,  email, name, picture } = googleUser;
            const existsUser = await this.app.mongo.db?.collection<GoogleUser>('users').findOne({ email });

            if (existsUser) {
                // Atualizar usuário existente
                const updateResult = await this.app.mongo.db?.collection('users').updateOne(
                    { email },
                    { 
                        $set: { 
                            googleAccessToken: googleUser.access_token, // ✅ CORRIGIDO
                            updatedAt: new Date() 
                        } 
                    }
                );
            
                if (!updateResult?.acknowledged) {
                    log.error("Erro ao atualizar usuário do Google:", existsUser);
                    return {
                        status: 'error',
                        success: false,
                        message: 'Erro ao atualizar usuário do Google',
                        verified: false
                    };
                }
                    const userId = typeof existsUser.id === 'string'
                    ? existsUser.id
                    : existsUser._id
                    ? existsUser._id.toString()
                    : '';
                const token = generateToken(this.app, userId, email);
                  log.info("Google login realizado com sucesso:", existsUser.email);
                return {
                    user: {
                        ...existsUser,
                        id: userId, // ✅ ADICIONADO ID
                    }as googleUserOmited,
                    token, // ✅ RETORNAR TOKEN
                    status: 'success',
                    success: true,
                    message: 'Usuário autenticado com sucesso',
                    verified:false ,
                    statusLogin: 'login'
                };
            }
                // ✅ CRIAR OBJETO USER COMPLETO
                const userResponse: googleUserOmited = {
                    id: id,
                    email: email,
                    name:  name,
                    verified: true,
                    role: 'user',
                    picture: picture,
                    googleAccessToken: googleUser.access_token,
                    createdAt: new Date(),
                    updatedAt: new Date()
                    };
                      // ✅ GERAR TOKEN JWT
                const token = generateToken(this.app, userResponse.id || userResponse.id,email);
                 //deixa no cache os dados do usuario do google e depois no signup recupera do cache e da um
                 // post com os signup completo 
                const cache = new CacheService(this.app, 'googleAuth:');
                await cache.set(email, userResponse);
                log.info("Google login realizado com sucesso:", userResponse.email);
                return {
                    user: userResponse,
                    token, // ✅ RETORNAR TOKEN
                    status: 'success',
                    success: true,
                    message: 'Usuário autenticado com sucesso',
                    verified: true,
                    statusLogin: 'signup'
                };
             
        } catch (error) {
            log.error("Erro ao autenticar usuário do Google:", error);
            return {
                status: 'error',
                success: false,
                message: 'Erro ao autenticar usuário do Google: ' + error,
                verified: false
            };
        }
    }

    async revokeGoogleToken(accessToken: string): Promise<StatusResponse> {
        try {
            const response = await axios.post(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (response.status === 200) {
                log.info("Token do Google revogado com sucesso");
                return {
                    status: 'success',
                    success: true,
                    message: 'Token do Google revogado com sucesso',
                    verified: false
                };
            } else {
                log.error("Erro ao revogar token do Google:", response.data);
                return {
                    status: 'error',
                    success: false,
                    message: 'Erro ao revogar token do Google',
                    verified: false
                };
            }
        } catch (error) {
            log.error("Erro ao revogar token do Google:", error);
            return {
                status: 'error',
                success: false,
                message: 'Erro ao revogar token do Google',
                verified: false
            };
        }
    }
   

}

export default GoogleAuthService;