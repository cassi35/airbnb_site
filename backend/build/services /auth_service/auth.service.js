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
    async loginUser(email, password, role) {
        try {
            let exists = await this.app.mongo.db?.collection('users').findOne({ email: email });
            if (!exists) {
                consola_1.default.warn(chalk_1.default.yellow('User not found:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'User not found',
                    verified: false
                };
                return errorResponse;
            }
            let isMatch = await this.app.bcrypt.compare(password, exists.password);
            if (!isMatch) {
                consola_1.default.warn(chalk_1.default.yellow('Password does not match for user:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'Password does not match',
                    verified: false
                };
                return errorResponse;
            }
            if (!exists.verified) {
                consola_1.default.warn(chalk_1.default.yellow('User is not verified:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'User is not verified',
                    verified: false
                };
                return errorResponse;
            }
            const token = (0, generateToken_1.generateToken)(this.app, exists._id.toString());
            const responseSuccess = {
                user: exists,
                token: token,
                status: 'success',
                success: true,
                message: 'User logged in successfully',
                verified: true
            };
            return responseSuccess;
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error logging in user:', error));
            const errorResponse = {
                status: 'error',
                success: false,
                message: error instanceof Error ? error.message : 'Failed to login user',
                verified: false
            };
            return errorResponse;
        }
    }
    async logoutUser(reply) {
        try {
            reply.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            const response = {
                status: 'success',
                success: true,
                message: 'User logged out successfully',
                verified: false
            };
            return response;
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error logging out user:', error));
            const errorResponse = {
                status: 'error',
                success: false,
                message: error instanceof Error ? error.message : 'Failed to logout user',
                verified: false
            };
            return errorResponse;
        }
    }
    async forgotPassword(email) {
        try {
            const user = await this.app.mongo.db?.collection('users').findOne({ email: email });
            if (!user) {
                consola_1.default.warn(chalk_1.default.yellow('User not found for forgot password:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'User not found',
                    verified: false
                };
                return errorResponse;
            }
            const cache = new redis_service_1.default(this.app, 'auth:');
            const userExistsInCache = await cache.get(`verify:${email}`);
            if (userExistsInCache) {
                consola_1.default.warn(chalk_1.default.yellow('User already exists in cache:', email));
                const errorResponse = {
                    status: 'error',
                    success: false,
                    message: 'User already exists in cache',
                    verified: false
                };
                return errorResponse;
            }
            const tokenVerification = (0, generateVerificationToken_1.generateVerificationToken)();
            // Envio do email
            const teste = await (0, email_1.sendVerificationToken)(tokenVerification, email);
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
            await cache.set(`verify:${email}`, {
                ...user,
                resetPasswordToken: tokenVerification,
                resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hora
            }, 300); // Expira em 5 minutos
            consola_1.default.success(chalk_1.default.green('Verification token sent to:', email));
            const response = {
                user: {
                    ...user,
                    resetPasswordToken: tokenVerification,
                    resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hora
                },
                token: tokenVerification,
                verified: false,
                status: 'pending',
                success: true,
                message: 'Password reset token sent'
            };
            return response;
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error in forgot password:', error));
            const errorResponse = {
                status: 'error',
                success: false,
                message: error instanceof Error ? error.message : 'Failed to process forgot password',
                verified: false
            };
            return errorResponse;
        }
    }
    async resetPassword(token, email, newPassword) {
        try {
            const cache = new redis_service_1.default(this.app, 'auth:');
            // Usar o tipo específico do MongoDB
            const userData = await cache.get(`verify:${email}`);
            if (!userData || userData.resetPasswordToken !== token || !userData.resetPasswordExpires || userData.resetPasswordExpires < new Date()) {
                consola_1.default.warn(chalk_1.default.yellow('Invalid or expired reset password token:', token));
                return {
                    status: 'error',
                    success: false,
                    message: 'Invalid or expired reset password token',
                    verified: false
                };
            }
            const hashedPassword = await this.app.bcrypt.hash(newPassword);
            // Fazer update apenas dos campos necessários
            const result = await this.app.mongo.db?.collection('users').updateOne({ email }, {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date()
                },
                $unset: {
                    resetPasswordToken: "",
                    resetPasswordExpires: ""
                }
            });
            if (!result?.acknowledged) {
                consola_1.default.error(chalk_1.default.red('Failed to update user password in database:', email));
                return {
                    status: 'error',
                    success: false,
                    message: 'Failed to update user password in database',
                    verified: false
                };
            }
            await cache.del(`verify:${email}`);
            consola_1.default.success(chalk_1.default.green('User password reset successfully:', email));
            return {
                user: {
                    ...userData,
                    password: hashedPassword,
                    resetPasswordToken: undefined,
                    resetPasswordExpires: undefined,
                    updatedAt: new Date()
                },
                status: 'success',
                success: true,
                message: 'Password reset successfully',
                verified: true
            };
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error resetting password:', error));
            return {
                status: 'error',
                success: false,
                message: error instanceof Error ? error.message : 'Failed to reset password',
                verified: false
            };
        }
    }
    async resendToken(email, type) {
        try {
            const cache = new redis_service_1.default(this.app, 'auth:');
            let userData = null;
            if (type === 'verification') {
                // Para verificação de email - busca no cache
                userData = await cache.get(`verify:${email}`);
                if (!userData) {
                    return {
                        status: 'error',
                        success: false,
                        message: 'User not found in cache. Please signup again.',
                        verified: false
                    };
                }
            }
            else if (type === 'reset') {
                // Para reset de senha - busca no banco
                const userFromDB = await this.app.mongo.db?.collection('users').findOne({ email });
                if (!userFromDB) {
                    return {
                        status: 'error',
                        success: false,
                        message: 'User not found',
                        verified: false
                    };
                }
                userData = userFromDB;
            }
            if (!userData) {
                return {
                    status: 'error',
                    success: false,
                    message: 'User data not found',
                    verified: false
                };
            }
            const tokenVerification = (0, generateVerificationToken_1.generateVerificationToken)();
            const sendEmail = await (0, email_1.sendVerificationToken)(tokenVerification, email);
            if (!sendEmail) {
                return {
                    status: 'error',
                    success: false,
                    message: 'Failed to send verification email',
                    verified: false
                };
            }
            // Preparar dados para o cache baseado no tipo
            const cacheData = type === 'verification'
                ? { ...userData, verificationToken: tokenVerification }
                : {
                    ...userData,
                    resetPasswordToken: tokenVerification,
                    resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hora
                };
            await cache.set(`verify:${email}`, cacheData, 300);
            const message = type === 'verification'
                ? 'Verification email resent successfully'
                : 'Password reset email resent successfully';
            consola_1.default.success(chalk_1.default.green(`${message} to:`, email));
            return {
                user: cacheData,
                token: tokenVerification,
                verified: false,
                status: 'pending',
                success: true,
                message
            };
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error resending token:', error));
            return {
                status: 'error',
                success: false,
                message: error instanceof Error ? error.message : 'Failed to resend token',
                verified: false
            };
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await this.app.mongo.db?.collection('users').findOne({ email });
            if (!user) {
                consola_1.default.warn(chalk_1.default.yellow('User not found by email:', email));
                return {
                    status: 'error',
                    success: false,
                    message: 'User not found',
                    verified: false
                };
            }
            const response = {
                user: user,
                status: 'success',
                success: true,
                message: 'User fetched successfully',
                verified: user.verified ?? false
            };
            return response;
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error fetching user by email:', error));
            return {
                status: 'error',
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch user by email',
                verified: false
            };
        }
    }
    async serverError() {
        try {
            const server_mmongo = this.app.mongo;
            if (!server_mmongo || !server_mmongo.db) {
                consola_1.default.error(chalk_1.default.red('MongoDB is not available on the server instance'));
                return {
                    status: 'error',
                    success: false,
                    message: 'Database connection error',
                    verified: false
                };
            }
            const response = {
                status: 'success',
                success: true,
                message: 'Server is running and MongoDB is connected',
                verified: false
            };
            return response;
        }
        catch (error) {
            consola_1.default.error(chalk_1.default.red('Error in server error:', error));
            return {
                status: 'error',
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
                verified: false
            };
        }
    }
}
exports.default = AuthService;
//colocar redis aqul
