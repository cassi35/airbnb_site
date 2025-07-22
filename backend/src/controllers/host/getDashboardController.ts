import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from "console";
import ck from "chalk";

// Interface para resposta do dashboard do host
interface getDashboardResponse {
    // Exemplo: totalListings, activeListings, totalRevenue, etc.
}

// Dashboard com métricas dos anúncios do host
export async function getDashboardController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Chamar service: getHostDashboardMetricsService
}
/*
Service sugerido: getHostDashboardMetricsService
Responsável por buscar métricas dos anúncios do host autenticado.
*/
