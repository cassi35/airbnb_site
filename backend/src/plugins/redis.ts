import { FastifyInstance } from 'fastify';
import fastifyRedis from '@fastify/redis';
import log from 'consola';
import ck from 'chalk';
export async function connectRedis(app:FastifyInstance):Promise<void>{
    try {
        await app.register(fastifyRedis,{
            url:process.env.REDIS_URL || 'redis://localhost:6379',
            connectTimeout:500,
            maxRetriesPerRequest:1 
        })
        await app.redis.ping()
        log.success(ck.green('Conexão com Redis estabelecida com sucesso!'));
    } catch (error) {
        log.error(ck.red('Erro ao conectar ao Redis:', error));
        process.exit(1);
    }
}