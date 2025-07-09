"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = connectRedis;
const redis_1 = __importDefault(require("@fastify/redis"));
const consola_1 = __importDefault(require("consola"));
const chalk_1 = __importDefault(require("chalk"));
async function connectRedis(app) {
    try {
        await app.register(redis_1.default, {
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            connectTimeout: 500,
            maxRetriesPerRequest: 1
        });
        await app.redis.ping();
        consola_1.default.success(chalk_1.default.green('Conexão com Redis estabelecida com sucesso!'));
    }
    catch (error) {
        consola_1.default.error(chalk_1.default.red('Erro ao conectar ao Redis:', error));
        process.exit(1);
    }
}
