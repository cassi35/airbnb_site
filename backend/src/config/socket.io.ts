import { FastifyInstance } from 'fastify';
import {Server} from 'socket.io'
import ck from 'chalk';
import log from 'consola';
export async function socketIO(app:FastifyInstance):Promise<void>{
    try {
        const io = new Server(app.server,{
        cors:{
            origin: "*"  // Permite conexões de qualquer origem, ajuste conforme necessário
        }
    })
    app.io = io
    io.on("connection",(socket)=>{
        log.success(`${ck.green("Socket.IO conectado com sucesso!")}`);
    })
    } catch (error) {
        log.error(`${ck.red("Erro ao conectar ao Socket.IO:")}`, error);
        process.exit(1);

    }
}