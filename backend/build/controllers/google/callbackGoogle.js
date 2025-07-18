"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackGoogle = callbackGoogle;
const http_status_codes_1 = require("http-status-codes");
const consola_1 = __importDefault(require("consola"));
const chalk_1 = __importDefault(require("chalk"));
const googleAuth_service_1 = __importDefault(require("services /auth_service/googleAuth.service"));
const redis_service_1 = __importDefault(require("services /auth_service/redis.service"));
async function callbackGoogle(request, reply) {
    try {
        const { code, error } = request.query;
        if (error) {
            // return reply.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
            consola_1.default.error('Google authentication error:', error);
            return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'Google authentication failed',
                verified: false
            });
        }
        if (!code) {
            consola_1.default.warn(chalk_1.default.yellow('No authorization code received from Google'));
            // return reply.redirect(`${process.env.FRONTEND_URL}/login?error=missing_code`);
            reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'Authorization code missing',
                verified: false
            });
        }
        const googleService = new googleAuth_service_1.default(request.server);
        //1 trocar code por acess token 
        const tokenResponse = await googleService.exchangeCodeForToken(code);
        if (tokenResponse.error) {
            consola_1.default.error(chalk_1.default.red('Erro ao trocar código por token de acesso:', tokenResponse.error));
            //  return reply.redirect(`${process.env.FRONTEND_URL}/login?error=token_exchange_failed`);
            return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Failed to exchange code for access token',
                verified: false
            });
        }
        if (!tokenResponse.access_token) {
            consola_1.default.warn(chalk_1.default.yellow('Access token not received from Google'));
            return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'Access token not received from Google',
                verified: false
            });
        }
        //2 buscar dados do usuario
        const userResult = await googleService.getGoogleUserData(tokenResponse.access_token);
        if (userResult.error) {
            consola_1.default.error(chalk_1.default.red('Erro ao buscar dados do usuário do Google:', userResult.error));
            //   return reply.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
            return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Failed to retrieve user data from Google',
                verified: false
            });
        }
        if (!userResult.user) {
            consola_1.default.warn(chalk_1.default.yellow('No user data received from Google'));
            return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'No user data received from Google',
                verified: false
            });
        }
        const googleUserWithToken = {
            ...userResult.user,
            access_token: tokenResponse.access_token
        };
        //3 autenticar / criar usuario no banco de dados 
        const authResult = await googleService.authenticateGoogleUser(googleUserWithToken);
        const redirectStatus = authResult.statusLogin === 'signup' ? 'signup' : 'login';
        if (!authResult.success) {
            //   return reply.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
            consola_1.default.error(chalk_1.default.red('Erro ao autenticar usuário do Google:', authResult.message));
            return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: authResult.message || 'Failed to authenticate Google user',
                verified: false
            });
        }
        //4 gerar token jwt 
        const token = authResult.token;
        if (!token) {
            consola_1.default.error(chalk_1.default.red('Token not generated for Google user'));
            return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
                status: 'error',
                success: false,
                message: 'Failed to generate token for Google user',
                verified: false
            });
        }
        //5 definir cookie
        reply.setCookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
        });
        const cache = new redis_service_1.default(request.server, 'googleAuth:');
        const email = authResult.user?.email;
        if (!email) {
            return reply.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
                status: 'error',
                success: false,
                message: 'Email do usuário Google não encontrado',
                verified: false
            });
        }
        const userCache = await cache.get(email);
        //6 redirecionar para o frontend com o token
        return reply.status(http_status_codes_1.StatusCodes.OK).send({
            status: 'success',
            success: true,
            message: 'Google user authenticated successfully',
            user: authResult.user,
            token: token,
            verified: authResult.verified,
            redirectStatus,
            userCache: userCache || null
        });
        //se o redirect status for login vai para o login senao o frontend redireciona 
        //para as credenciais
    }
    catch (error) {
        consola_1.default.error(chalk_1.default.red('Erro ao processar callback do Google:', error));
        return reply.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send({
            status: 'error',
            success: false,
            message: 'Failed to process Google callback',
            verified: false
        });
    }
}
