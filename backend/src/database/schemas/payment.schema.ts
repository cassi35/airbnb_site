import { ObjectId } from 'mongodb';
export interface Payment{
    _id?: ObjectId;
    bookingId: ObjectId; // Referência ao booking
    guestId: ObjectId; // Referência ao hóspede
    hostId: ObjectId; // Referência ao anfitrião
    amount:{
        total:number // Valor total do pagamento
        hostAmount:number // Valor que vai para o anfitrião
        plataformFee:number // Taxa da plataforma
        currency:string // Moeda (USD, EUR, etc.)
    }
    method: 'credit_card' | 'paypal' | 'bank_transfer'; // Método de pagamento
    paymentGateway: 'stripe' | 'paypal' | 'bank'; // Gateway de pagamento utilizado
    transactionId?: string; // ID da transação (se aplicável)
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    refunded?:{
        amount:number // Valor reembolsado
        reason?: string // Motivo do reembolso (opcional)
        refundDate?: Date // Data do reembolso (se aplicável)
    }
    createdAt: Date; // Data de criação do pagamento
    updatedAt: Date; // Data da última atualização do pagamento
}