"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_service_1 = __importDefault(require("./redis.service"));
const google_config_js_1 = require("#config/google.config.js");
const axios_1 = __importDefault(require("axios"));
const console_1 = __importDefault(require("console"));
const generateToken_1 = require("token/generateToken");
class GoogleAuthService {
    app;
    cache;
    constructor(app) {
        this.app = app;
        this.cache = new redis_service_1.default(app, 'googleAuth:');
    }
    // Gerar URL de autenticação do Google
    getGoogleAuthUrl(customData) {
        const stateData = customData ?
            btoa(JSON.stringify(customData)) : // Codificar dados em base64
            this.generateState();
        const params = new URLSearchParams({
            client_id: google_config_js_1.googleConfig.clientId,
            redirect_uri: google_config_js_1.googleConfig.redirectUri,
            response_type: 'code',
            scope: google_config_js_1.googleConfig.scope.join(' '),
            access_type: 'offline',
            prompt: 'consent',
            state: stateData // ← Passa dados personalizados
        });
        return `${google_config_js_1.googleConfig.authUrl}?${params.toString()}`;
    }
    generateState() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
    async ErrorServer() {
        try {
            if (!this.app.mongo || !this.app.mongo.db) {
                console_1.default.error("MongoDB não está disponível na instância do servidor");
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
        }
        catch (error) {
            console_1.default.error("Erro ao verificar o MongoDB:", error);
            return {
                status: 'error',
                success: false,
                message: 'Erro ao verificar o MongoDB',
                verified: false
            };
        }
    }
    async exchangeCodeForToken(code) {
        try {
            const response = await axios_1.default.post(google_config_js_1.googleConfig.tokenUrl, new URLSearchParams({
                code,
                client_id: google_config_js_1.googleConfig.clientId,
                client_secret: google_config_js_1.googleConfig.clientSecret,
                redirect_uri: google_config_js_1.googleConfig.redirectUri,
                grant_type: 'authorization_code'
            }).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const tokenData = response.data;
            if (!tokenData.access_token) {
                console_1.default.error("Erro ao obter access token:", tokenData.error);
                return { error: 'Erro ao obter access token' };
            }
            console_1.default.info("Access token obtido com sucesso");
            return { access_token: tokenData.access_token };
        }
        catch (error) {
            console_1.default.error("Erro ao trocar código por token:", error);
            return { error: 'Erro ao trocar código por token' };
        }
    }
    async getGoogleUserData(accessToken) {
        try {
            const response = await axios_1.default.get(google_config_js_1.googleConfig.userInfoUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const userData = response.data;
            if (!userData.email) {
                console_1.default.error("Dados do usuário do Google inválidos:", userData);
                return { error: 'Dados do usuário do Google inválidos' };
            }
            console_1.default.info("Dados do usuário do Google obtidos com sucesso:", userData.email);
            return { user: userData };
        }
        catch (error) {
            console_1.default.error("Erro ao obter dados do usuário do Google:", error);
            return { error: 'Erro ao obter dados do usuário do Google' };
        }
    }
    async authenticateGoogleUser(googleUser) {
        try {
            const dbCheck = await this.ErrorServer();
            if (!dbCheck.success) {
                return dbCheck;
            }
            const { id, email, name, picture } = googleUser;
            const existsUser = await this.app.mongo.db?.collection('user').findOne({ email });
            if (existsUser) {
                // Atualizar usuário existente
                const updateResult = await this.app.mongo.db?.collection('user').updateOne({ email }, {
                    $set: {
                        googleAccessToken: googleUser.access_token, // ✅ CORRIGIDO
                        updatedAt: new Date()
                    }
                });
                if (!updateResult?.acknowledged) {
                    console_1.default.error("Erro ao atualizar usuário do Google:", existsUser);
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
                const token = (0, generateToken_1.generateToken)(this.app, userId, email);
                console_1.default.info("Google login realizado com sucesso:", existsUser.email);
                return {
                    user: {
                        ...existsUser,
                        id: userId, // ✅ ADICIONADO ID
                    },
                    token, // ✅ RETORNAR TOKEN
                    status: 'success',
                    success: true,
                    message: 'Usuário autenticado com sucesso',
                    verified: false,
                    statusLogin: 'login'
                };
            }
            // ✅ CRIAR OBJETO USER COMPLETO
            const userResponse = {
                id: id,
                email: email,
                name: name,
                verified: true,
                role: 'user',
                picture: picture,
                googleAccessToken: googleUser.access_token,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            // ✅ GERAR TOKEN JWT
            const token = (0, generateToken_1.generateToken)(this.app, userResponse.id || userResponse.id, email);
            //deixa no cache os dados do usuario do google e depois no signup recupera do cache e da um
            // post com os signup completo 
            const cache = new redis_service_1.default(this.app, 'googleAuth:');
            await cache.set(email, userResponse);
            console_1.default.info("Google login realizado com sucesso:", userResponse.email);
            return {
                user: userResponse,
                token, // ✅ RETORNAR TOKEN
                status: 'success',
                success: true,
                message: 'Usuário autenticado com sucesso',
                verified: true,
                statusLogin: 'signup'
            };
        }
        catch (error) {
            console_1.default.error("Erro ao autenticar usuário do Google:", error);
            return {
                status: 'error',
                success: false,
                message: 'Erro ao autenticar usuário do Google: ' + error,
                verified: false
            };
        }
    }
    async revokeGoogleToken(accessToken) {
        try {
            const response = await axios_1.default.post(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (response.status === 200) {
                console_1.default.info("Token do Google revogado com sucesso");
                return {
                    status: 'success',
                    success: true,
                    message: 'Token do Google revogado com sucesso',
                    verified: false
                };
            }
            else {
                console_1.default.error("Erro ao revogar token do Google:", response.data);
                return {
                    status: 'error',
                    success: false,
                    message: 'Erro ao revogar token do Google',
                    verified: false
                };
            }
        }
        catch (error) {
            console_1.default.error("Erro ao revogar token do Google:", error);
            return {
                status: 'error',
                success: false,
                message: 'Erro ao revogar token do Google',
                verified: false
            };
        }
    }
}
exports.default = GoogleAuthService;
