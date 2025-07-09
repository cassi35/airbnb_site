import { FastifyInstance } from "fastify";
import ck from 'chalk';
import fastifyMongoDB from '@fastify/mongodb'
import log from 'consola'
export async function connectDB(app:FastifyInstance){
    try {
        const url = process.env.DATABASE_CONNECTION 
        log.info(`Tentando conectar ao MongoDB: ${url?.substring(0, 20)}...`);
        
        await app.register(fastifyMongoDB, {
            forceClose: true,
            url: url,
            name: 'airbnb_project',
        });
        
        // Teste a conexão explicitamente
        await app.mongo.client.connect();
        await app.mongo.db?.command({ ping: 1 });
        log.success(`${ck.green("MongoDB conectado com sucesso!")}`);
    } catch (error) {
        log.error(`${ck.red("Erro ao conectar ao MongoDB:")}`, error);
        process.exit(1);
    }
}