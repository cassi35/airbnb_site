import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import log from "console";
import ck from "chalk";

// Interface para resposta do perfil do host
interface getHostProfileResponse {
    // Exemplo: dados pessoais, hostData, etc.
}

// Buscar perfil do host
export async function getHostProfileController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    // Chamar service: getHostProfileService
}
/*
Service sugerido: getHostProfileService
Responsável por buscar o perfil do host autenticado.
*/
