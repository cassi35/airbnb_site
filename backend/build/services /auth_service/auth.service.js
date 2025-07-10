"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consola_1 = __importDefault(require("consola"));
const chalk_1 = __importDefault(require("chalk"));
const redis_service_1 = __importDefault(require("./redis.service"));
const generateVerificationToken_1 = require("token/generateVerificationToken");
const email_1 = require("emails/email");
const generateToken_1 = require("token/generateToken");
class AuthService {
    app;
    userCollection;
    redis;
    constructor(fastify) {
        this.app = fastify;
        this.userCollection = this.app.mongo.db?.collection("users");
        this.redis = this.app.redis;
    }
    async createUser(userData) {
        try {
            const existsUser = await this.userCollection.find({ email: userData.email })
                .toArray();
            if (existsUser.length > 0) {
                consola_1.default.warn(chalk_1.default.yellow('User already exists:', userData.email));
                throw new Error('User already exists');
            }
            const haskPassword = await this.app.bcrypt.hash(userData.password);
            const tokenVerification = (0, generateVerificationToken_1.generateVerificationToken)();
            const tempUser = {
                ...userData,
                password: haskPassword,
                verified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                verificationToken: tokenVerification,
                role: 'user', // Default to 'user' if role is not provided
                provider: 'local'
            };
            const cache = new redis_service_1.default(this.app, 'auth:');
            // Verificação do cache
            const userExistsInCache = await cache.get(`verify:${userData.email}`);
            if (userExistsInCache) {
                consola_1.default.warn(chalk_1.default.yellow('User already exists in cache:', userData.email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'User already exists in cache',
                    verified: false
                };
                return errorResponse;
            }
            // Envio do email
            const teste = await (0, email_1.sendVerificationToken)(tokenVerification, userData.email);
            if (!teste) {
                consola_1.default.error(chalk_1.default.red('Failed to send verification email'));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'Failed to send verification email',
                    verified: false
                };
                return errorResponse;
            }
            // Salvar no cache
            await cache.set(`verify:${userData.email}`, tempUser, 300); // Expira em 5 minutos
            consola_1.default.success(chalk_1.default.green('Verification token sent to:', userData.email));
            const response = {
                user: tempUser,
                token: tokenVerification,
                verified: false,
                status: 'pending',
                success: true,
                message: 'User created'
            };
            return response;
        }
        catch (error) {
            const response = {
                status: 'error',
                success: false,
                message: 'Failed to create user',
                verified: false
            };
            consola_1.default.error(chalk_1.default.red('Error creating user:', error));
            return response;
        }
    }
    async verifyToken(token, email) {
        try {
            const cache = new redis_service_1.default(this.app, 'auth:');
            const userData = await cache.get(`verify:${email}`);
            if (!userData) {
                consola_1.default.warn(chalk_1.default.yellow('User not found in cache:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'User not found in cache',
                    verified: false
                };
                return errorResponse;
            }
            if (userData.verificationToken != token) {
                consola_1.default.warn(chalk_1.default.yellow('Invalid verification token:', token));
                console.log('=== DEBUG REDIS ===');
                console.log('Email buscado:', email);
                console.log('Dados do cache:', userData);
                console.log('Token enviado:', token);
                console.log('Token no cache:', userData?.verificationToken);
                console.log('==================');
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'Invalid verification token',
                    verified: false
                };
                return errorResponse;
            }
            // Atualizar o usuário no banco de dados
            const user = await cache.get(`verify:${email}`);
            if (!user) {
                consola_1.default.warn(chalk_1.default.yellow('User not found in cache:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'User not found in cache',
                    verified: false
                };
                return errorResponse;
            }
            const newUser = {
                ...user,
                verified: true,
                verificationToken: undefined, // Limpar o token de verificação
                updatedAt: new Date()
            };
            const result = await this.app.mongo.db?.collection('users').insertOne(newUser);
            if (!result?.acknowledged && !result?.insertedId) {
                consola_1.default.error(chalk_1.default.red('Failed to update user in database:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'error to insert user in database',
                    verified: false
                };
                return errorResponse;
            }
            //remove do cache 
            await cache.del(`verify:${email}`);
            const userDeleted = await cache.get(`user:${email}`);
            if (userDeleted) {
                consola_1.default.warn(chalk_1.default.yellow('User still exists in cache after deletion:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'User still exists in cache after deletion',
                    verified: false
                };
                return errorResponse;
            }
            const sendWelcomeEmail = await (0, email_1.welcomeEmail)(user.email);
            if (!sendWelcomeEmail) {
                consola_1.default.error(chalk_1.default.red('Failed to send welcome email'));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'Failed to send welcome email',
                    verified: false
                };
                return errorResponse;
            }
            const tokenCookie = (0, generateToken_1.generateToken)(this.app, result.insertedId.toString());
            const responseSucess = {
                user: newUser,
                status: 'success',
                success: true,
                message: 'User verified successfully',
                verified: true,
                token: tokenCookie // Retorna o token JWT
            };
            return responseSucess;
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error verifying token:', error));
            const errorResponse = {
                status: 'error',
                success: false,
                message: 'Failed to verify token',
                verified: false
            };
            return errorResponse;
        }
    }
}
exports.default = AuthService;
//colocar redis aqul
