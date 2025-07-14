import { ObjectId } from 'mongodb';
export interface Booking{
    _id: ObjectId;
    propertyId: ObjectId; // ID do imóvel reservado
    guestId: ObjectId; // ID do hóspede
    hostId: ObjectId; // ID do anfitrião
    dates:{
        checkIn: Date; // Data de check-in
        checkOut: Date; // Data de check-out
        nights: number; // Número de noites da reserva
    }
    guests:{
        adults: number; // Número de adultos
        children: number; // Número de crianças
        infants: number; // Número de bebês
    }
    pricing:{
        nightlyRate: number; // Preço por noite
        cleaningFee: number; // Taxa de limpeza
        securityDeposit: number; // Depósito de segurança
        total: number; // Total da reserva
        currency: string; // Moeda (USD, EUR, etc.)
    }
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; // Status da reserva
    payment:{
        method: 'credit_card' | 'paypal' | 'bank_transfer'; // Método de pagamento
        transactionId?: string; // ID da transação (se aplicável)
        paymentDate?: Date; // Data do pagamento
    }
    cancellationPolicy:{
        cancelledBy:'guest' | 'host' | 'admin'; // Quem cancelou a reserva
        reason?: string; // Motivo do cancelamento (opcional)
        cancellationDate?: Date; // Data do cancelamento (se aplicável)
    }
    specialRequests?: string; // Solicitações especiais do hóspede (opcional)
    createdAt: Date; // Data de criação da reserva
    updatedAt: Date; // Data da última atualização da reserva
}