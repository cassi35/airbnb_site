"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consola_1 = __importDefault(require("consola"));
const chalk_1 = __importDefault(require("chalk"));
const redis_service_1 = __importDefault(require("../services /redis.service"));
const generateVerificationToken_1 = require("token/generateVerificationToken");
const email_1 = require("emails/email");
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
                role: 'user',
                provider: 'local'
            };
            const cache = new redis_service_1.default(this.app, 'auth:');
            await (0, email_1.sendVerificationToken)(tokenVerification, userData.email);
            await cache.set(`verify:${userData.email}`, //primeiro enviar email
            JSON.stringify(tempUser), 300); // 5 minutos de cache
            consola_1.default.success(chalk_1.default.green('Verification token sent to:', userData.email));
            const response = {
                status: 'pending',
                success: true,
                message: 'User created successfully, please verify your email',
                verified: false
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
}
exports.default = AuthService;
//colocar redis aqul
