import { ObjectId } from 'mongodb';
export interface Announcement{
    _id?: ObjectId;
    title: string;
    content: string; // Conteúdo do anúncio
    type:'promotion' | 'news' | 'update'; // Tipo de anúncio
    target:{
        audience: 'all' | 'users' | 'hosts' | 'admins'; // Público-alvo do anúncio
        locations:string[] // Localizações geográficas (se aplicável)
    }
    display:{
        isActive: boolean; // Se o anúncio está ativo
        startDate?: Date; // Data de início da exibição (opcional)
        endDate?: Date; // Data de término da exibição (opcional)
        priority: number; // Prioridade do anúncio (1-5)
    }
    media?:{
        images?: string[]; // URLs de imagens (opcional)
        videos?: string[]; // URLs de vídeos (opcional)
    }
    metrics:{
        views: number; // Número de visualizações do anúncio
        clicks: number; // Número de cliques no anúncio
        engagementRate: number; // Taxa de engajamento (cliques/visualizações)
    }
    author:ObjectId
    createdAt: Date; // Data de criação do anúncio
    updatedAt: Date; // Data da última atualização do anúncio
}