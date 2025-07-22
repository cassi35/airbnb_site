import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from "console";
import ck from "chalk";

// Interface para resposta das avaliações do host
interface getHostReviewsResponse {
    // Exemplo: lista de avaliações, média, etc.
}

// Listar avaliações recebidas pelo host
export async function getHostReviewsController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Chamar service: getHostReviewsService
}
/*
Service sugerido: getHostReviewsService
Responsável por buscar todas as avaliações recebidas pelo host autenticado.
*/
