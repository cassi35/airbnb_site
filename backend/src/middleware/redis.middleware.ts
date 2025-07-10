import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import CacheService from 'services /auth_service/redis.service';
export function createCacheMiddleware(app: any, ttl: number = 300) {
  const cacheService = new CacheService(app);
  
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Pular cache para métodos não-GET
    if (request.method !== 'GET') return;
    
    // Criar chave de cache baseada na URL e query params
    const cacheKey = `route:${request.url}`;
    
    // Verificar cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return reply.send(cached);
    }
    
    // Interceptar resposta para salvar no cache
    const send = reply.send;
    reply.send = function(payload) {
      // Salvar no cache
      cacheService.set(cacheKey, payload, ttl).catch(console.error);
      // Continuar com o envio normal
      return send.call(this, payload);
    };
  };
}