import { FastifyInstance } from "fastify";
import ck from 'chalk';
import fastifyMongoDB from '@fastify/mongodb'
import log from 'consola'
export async function connectDB(app:FastifyInstance){
    try {
        const url = process.env.DATABASE_CONNECTION 
        app.register(fastifyMongoDB,{
            forceClose: true, // Fecha a conexão ao encerrar o servidor 
            url: url, // URL de conexão do MongoDB
            name: 'airbnb_project', // Nome da conexão, pode ser usado para referenciar
        })
        log.success(`${ck.green("MongoDB connected successfully")}`);
    } catch (error) {
        console.log(`${ck.red("Error connecting to the database")}`, error);
        process.exit(1);
    }
}