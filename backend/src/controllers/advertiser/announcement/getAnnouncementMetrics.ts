import { FastifyRequest, FastifyReply } from "fastify";
// Controller responsável por retornar métricas de um anúncio
export async function getAnnouncementMetricsController(request:FastifyRequest,reply:FastifyReply):Promise<void>{
}


/* Essas métricas geralmente incluem:

Número de visualizações do anúncio
Número de cliques
Taxa de engajamento (cliques/visualizações)
Outras estatísticas relevantes (ex: reservas originadas pelo anúncio, favoritos, etc.)
Essas informações ajudam o anunciante a acompanhar o desempenho de cada anúncio publicado na plataforma.
O frontend faz uma requisição para /advertiser/announcement/:id/metrics.
O controller busca o anúncio pelo ID e retorna o objeto metrics do anúncio, que pode estar assim no banco:
 */