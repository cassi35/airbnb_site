import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from "console";
import ck from "chalk";

// Interface para resposta das reservas do host
interface getHostReservationsResponse {
    // Exemplo: lista de reservas, totais, etc.
}

// Listar reservas recebidas pelo host
export async function getHostReservationsController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Chamar service: getHostReservationsService
}
/*
Service sugerido: getHostReservationsService
Responsável por buscar todas as reservas recebidas pelo host autenticado.
*/
