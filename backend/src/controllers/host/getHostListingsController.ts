import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from "console";
import ck from "chalk";

// Interface para resposta da listagem de anúncios do host
interface getHostListingsResponse {
    // Exemplo: lista de anúncios, total, etc.
}

// Listar anúncios do host
export async function getHostListingsController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Chamar service: getHostListingsService
}
/*
Service sugerido: getHostListingsService
Responsável por buscar todos os anúncios do host autenticado.
*/
