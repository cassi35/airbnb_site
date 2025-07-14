import { ObjectId, PropertyType } from "mongodb";
type propertiesType = 'apartment' | 'house' | 'condominium' | 'cottage' | 'farm' | 'chalet' | 'studio' | 'loft';
type categoriesType = 'beach' | 'mountain' | 'city' | 'countryside' | 'rural' | 'urban';
type statusTye =  'active' | 'inactive' | 'archived'
export interface Property{
    _id?: ObjectId;
    hostId: ObjectId; // ID do usuário que é o anfitrião
    title: string; // Título do anúncio
    description: string; // Descrição do anúncio
    type:propertiesType 
    category:categoriesType
    location:{
        address: string; // Endereço completo
        city: string; // Cidade
        state: string; // Estado
        country: string; // País
        latitude: number; // Latitude
        longitude: number; // Longitude
    }
    details:{
        bedrooms: number; // Número de quartos
        bathrooms: number; // Número de banheiros
        beds: number; // Número de camas
        guests: number; // Capacidade máxima de hóspedes
        amenities: string[]; // Lista de comodidades (Wi-Fi, ar-condicionado, etc.)
    }
    pricing:{
        nightlyRate: number; // Preço por noite
        cleaningFee: number; // Taxa de limpeza
        securityDeposit: number; // Depósito de segurança
        currency: string; // Moeda (USD, EUR, etc.)
    }
    images:{
        mainImage: string; // URL da imagem principal
        gallery: string[]; // URLs das imagens da galeria
    }
    avaliability:{
        availableFrom: Date; // Data de início da disponibilidade
        availableTo: Date; // Data de término da disponibilidade
        minimumStay: number; // Estadia mínima em noites
        maximumStay: number; // Estadia máxima em noites
    }
    houseRules:{
        checkIn: string; // Horário de check-in
        checkOut: string; // Horário de check-out
        smokingAllowed: boolean; // Se fumar é permitido
        petsAllowed: boolean; // Se animais de estimação são permitidos
        partiesAllowed: boolean; // Se festas são permitidas
    }
    status:statusTye; // Status do anúncio
    verified: boolean; // Se o anúncio foi verificado
    rating:number; // Avaliação média do anúncio
    reviewsCount: number; // Número de avaliações recebidas
    createdAt: Date; // Data de criação do anúncio
    updatedAt: Date; // Data da última atualização do anúncio
}