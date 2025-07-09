"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheMiddleware = createCacheMiddleware;
const redis_service_1 = __importDefault(require("services /redis.service"));
function createCacheMiddleware(app, ttl = 300) {
    const cacheService = new redis_service_1.default(app);
    return async (request, reply) => {
        // Pular cache para métodos não-GET
        if (request.method !== 'GET')
            return;
        // Criar chave de cache baseada na URL e query params
        const cacheKey = `route:${request.url}`;
        // Verificar cache
        const cached = await cacheService.get(cacheKey);
        if (cached) {
            return reply.send(cached);
        }
        // Interceptar resposta para salvar no cache
        const send = reply.send;
        reply.send = function (payload) {
            // Salvar no cache
            cacheService.set(cacheKey, payload, ttl).catch(console.error);
            // Continuar com o envio normal
            return send.call(this, payload);
        };
    };
}
