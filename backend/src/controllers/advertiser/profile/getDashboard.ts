import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from "console";
import ck from "chalk";
interface getDashboardResponse {
    
}
//  // Dashboard com métricas dos anúncios
export async function getDashboardController(request:FastifyRequest,reply:FastifyReply):Promise<void>{
    
}
/* 
nesse getDashboardController, você pode buscar as métricas dos anúncios do usuário autenticado.
Por exemplo, você pode buscar o total de anúncios, anúncios ativos, total gasto, etc.,
e retornar esses dados no formato esperado pelo frontend.
*/