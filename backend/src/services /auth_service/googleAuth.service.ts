import { FastifyInstance } from "fastify";
import CacheService from "./redis.service";
import { googleConfig } from "#config/google.config.js";
import { StatusResponse } from "#interface/responses.js";
import { GoogleUserData } from "#interface/google.js";
import axios from 'axios'
import  log  from "console";
import { generateToken, setTokenCookie } from "token/generateToken";
type changeForTokenResponse = {
    access_token?: string;
    error?:string
}
type getGoogleUserDataResponse = {
    user?:GoogleUserData,
    error?:string
}
//colocar redis aqul
class GoogleAuthService{
    private app:FastifyInstance
    private cache:CacheService
    constructor(app:FastifyInstance)
    {
        this.app = app;
        this.cache = new CacheService(app, 'googleAuth:');
    }
     // Gerar URL de autenticação do Google
    getGoogleAuthUrl():string {
        const params = new URLSearchParams({
            client_id:googleConfig.clientId,
            redirect_uri: googleConfig.redirectUri,
            response_type: 'code',
            scope: googleConfig.scope.join(' '),
            access_type: 'offline',
            prompt: 'consent',
            state: this.generateState()
        })
        return `${googleConfig.authUrl}?${params.toString()}`;
    }
     // Gerar state para segurança

    private  generateState():string{
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
     // Verificar se o MongoDB está disponível
    private async ErrorServer():Promise<StatusResponse>{
        try {
        if(!this.app.mongo || !this.app.mongo.db) {
        log.error("MongoDB não está disponível na instância do servidor");
        return {
            status: 'error',
            success: false,
            message: 'Database connection error',
            verified: false
        }
        }
        return {
            status: 'success',
            success: true,
            message: 'MongoDB está disponível',
            verified: true
        }
        } catch (error) {
            log.error("Erro ao verificar o MongoDB:", error);
            const errorResponse:StatusResponse = {
                status: 'error',
                success: false,
                message: 'Erro ao verificar o MongoDB',
                verified: false
            }
            return errorResponse
        }
    }
      // Trocar código por access token
    async exchangeCodeForToken(code:string):Promise<changeForTokenResponse>{
        try {
           const response = await axios.post(googleConfig.tokenUrl, 
            // Body - dados enviados como form-urlencoded
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
        const tokenData = response.data
        if(!tokenData.access_token){
            log.error("Erro ao obter access token:", tokenData.error);
            return { error: 'Erro ao obter access token' };
        }
        log.info("Access token obtido com sucesso:", tokenData.access_token);
        return { access_token: tokenData.access_token };
        } catch (error) {
            log.error("Erro ao trocar código por token:", error);
            return { error: 'Erro ao trocar código por token' };
        }
    }
    async getGoogleUserData(acessToken:string):Promise<getGoogleUserDataResponse>{
        try {
            const respose = await axios.get(googleConfig.userInfoUrl,{
                headers:{
                    Authorization: `Bearer ${acessToken}`
                } 
            })
            const userData:GoogleUserData = respose.data 
            if(!userData.email){
                log.error("Dados do usuário do Google inválidos:", userData);
                return { error: 'Dados do usuário do Google inválidos' };
            }
            log.info("Dados do usuário do Google obtidos com sucesso:", userData);
            return { user: userData };
        } catch (error) {
            log.error("Erro ao obter dados do usuário do Google:", error);
            return { error: 'Erro ao obter dados do usuário do Google' };
        }
    }
    async authenticateGoogleUser(googleUser:GoogleUserData):Promise<StatusResponse >{
        try {
            const dbCheck = await this.ErrorServer();
            if(!dbCheck.success){
                return dbCheck; // Retorna erro se o MongoDB não estiver disponível
            }
            const {email,name,picture,verified_email} = googleUser
            const existsUser = await this.app.mongo.db?.collection<GoogleUserData>('users').findOne({ email });
            if(existsUser){
               log.info("google login realizado com sucesso:", existsUser);
               return {
                    user: existsUser,
                    status: 'success',
                    success: true,
                    message: 'Usuário autenticado com sucesso',
                    verified: verified_email || false
                };
               }else{
                  const token = generateToken(this.app, googleUser.id);
                const newUser:GoogleUserData = {
                    id: googleUser.id,
                    email,
                    token,
                    name,
                    picture,
                    verified_email: verified_email || false,
                    role:'user',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                const result = await this.app.mongo.db?.collection<GoogleUserData>('users').insertOne(newUser);
               if(!result?.acknowledged){
                    log.error("Erro ao criar novo usuário do Google:", newUser);
                    return {
                        status: 'error',
                        success: false,
                        message: 'Erro ao criar novo usuário do Google',
                        verified: false
                    }
                }
               //no controller gerar token 
             
               log.info("Novo usuário do Google criado com sucesso:", newUser) 
               return {
                user: newUser,
                token,
                status: 'success',
                success: true,
                message: 'Novo usuário do Google criado com sucesso',
                verified: verified_email || false
               }
            }
            
        } catch (error) {
            log.error("Erro ao autenticar usuário do Google:", error);
            return {
                status: 'error',
                success: false,
                message: 'Erro ao autenticar usuário do Google'+error,
                verified: false
            }
        }
    }
    async revokeGoogleToken(acessToken:string):Promise<StatusResponse>{
        try {
            const response = await axios.post(`https://oauth2.googleapis.com/revoke?token=${acessToken}`, null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            if(response.status === 200){
                log.info("Token do Google revogado com sucesso");
                return {
                    status: 'success',
                    success: true,
                    message: 'Token do Google revogado com sucesso',
                    verified: true
                }

            }else{
                log.error("Erro ao revogar token do Google:", response.data);
                return {
                    status: 'error',
                    success: false,
                    message: 'Erro ao revogar token do Google',
                    verified: false
                }
            }
        } catch (error) {
            log.error("Erro ao revogar token do Google:", error);
            return {
                status: 'error',
                success: false,
                message: 'Erro ao revogar token do Google',
                verified: false
            }
        }
    }
}
export default GoogleAuthService;