import { ObjectId } from 'mongodb';
export interface Review{
    _id: ObjectId;
    bookingId: ObjectId; // Referência ao booking
    propertyId: ObjectId; // Referência à propriedade
    guestId: ObjectId; // Referência ao hóspede
    hostId: ObjectId; // Referência ao anfitrião
    rating:{
        cleanliness: number; // Avaliação de limpeza (1-5)
        communication: number; // Avaliação de comunicação (1-5)
        checkIn: number; // Avaliação de check-in (1-5)
        accuracy: number; // Avaliação de precisão (1-5)
        location: number; // Avaliação de localização (1-5)
        value: number; // Avaliação de valor (1-5)
    }
    comment: string; // Comentário do hóspede
    hostResponse?: string; // Resposta do anfitrião (opcional)
    //flags 
    isPublic: boolean; // Se a avaliação é pública
    isReported: boolean; // Se a avaliação foi reportada
    isVerified: boolean; // Se a avaliação foi verificada
    //datas 
    createdAt: Date; // Data de criação da avaliação
    updatedAt: Date; // Data da última atualização da avaliação
}