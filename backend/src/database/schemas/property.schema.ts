import { ObjectId, PropertyType } from "mongodb";
import z from "zod";
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
export const propertiesTypeEnum = z.enum([
  "apartment", "house", "condominium", "cottage", "farm", "chalet", "studio", "loft"
]);
export const categoriesTypeEnum = z.enum([
  "beach", "mountain", "city", "countryside", "rural", "urban"
]);
export const statusTypeEnum = z.enum([
  "active", "inactive", "archived"
]);

export const propertySchema: z.ZodType<Property> = z.object({
  _id: z.instanceof(ObjectId).optional(),
  hostId: z.instanceof(ObjectId),
  title: z.string({ required_error: "O título é obrigatório" })
    .min(1, { message: "O título é obrigatório" })
    .max(200, { message: "O título deve ter no máximo 200 caracteres" }),
  description: z.string({ required_error: "A descrição é obrigatória" })
    .min(1, { message: "A descrição é obrigatória" })
    .max(2000, { message: "A descrição deve ter no máximo 2000 caracteres" }),
  type: propertiesTypeEnum,
  category: categoriesTypeEnum,
  location: z.object({
    address: z.string({ required_error: "Endereço é obrigatório" }).min(1),
    city: z.string({ required_error: "Cidade é obrigatória" }).min(1),
    state: z.string({ required_error: "Estado é obrigatório" }).min(1),
    country: z.string({ required_error: "País é obrigatório" }).min(1),
  }),
  details: z.object({
    bedrooms: z.number({ required_error: "Número de quartos é obrigatório" }).int().min(0),
    bathrooms: z.number({ required_error: "Número de banheiros é obrigatório" }).int().min(0),
    beds: z.number({ required_error: "Número de camas é obrigatório" }).int().min(0),
    guests: z.number({ required_error: "Capacidade de hóspedes é obrigatória" }).int().min(1),
    amenities: z.array(z.string(), { required_error: "Comodidades são obrigatórias" }),
  }),
  pricing: z.object({
    nightlyRate: z.number({ required_error: "Preço por noite é obrigatório" }).min(0),
    cleaningFee: z.number({ required_error: "Taxa de limpeza é obrigatória" }).min(0),
    securityDeposit: z.number({ required_error: "Depósito de segurança é obrigatório" }).min(0),
    currency: z.string({ required_error: "Moeda é obrigatória" }).min(1).max(10),
  }),
  images: z.object({
    mainImage: z.string({ required_error: "Imagem principal é obrigatória" }).url({ message: "URL da imagem principal inválida" }),
    gallery: z.array(z.string().url({ message: "URL da galeria inválida" })),
  }),
  avaliability: z.object({
    availableFrom: z.coerce.date({ required_error: "Data de início é obrigatória" }),
    availableTo: z.coerce.date({ required_error: "Data de término é obrigatória" }),
    minimumStay: z.number({ required_error: "Estadia mínima é obrigatória" }).int().min(1),
    maximumStay: z.number({ required_error: "Estadia máxima é obrigatória" }).int().min(1),
  }),
  houseRules: z.object({
    checkIn: z.string({ required_error: "Horário de check-in é obrigatório" }).min(1).max(20),
    checkOut: z.string({ required_error: "Horário de check-out é obrigatório" }).min(1).max(20),
    smokingAllowed: z.boolean({ required_error: "Campo fumar permitido é obrigatório" }),
    petsAllowed: z.boolean({ required_error: "Campo pets permitido é obrigatório" }),
    partiesAllowed: z.boolean({ required_error: "Campo festas permitido é obrigatório" }),
  }),
  status: statusTypeEnum,
  verified: z.boolean({ required_error: "Campo verificado é obrigatório" }),
  rating: z.number({ required_error: "Avaliação é obrigatória" }).min(0).max(5),
  reviewsCount: z.number({ required_error: "Número de avaliações é obrigatório" }).int().min(0),
  createdAt: z.coerce.date({ required_error: "Data de criação é obrigatória" }),
  updatedAt: z.coerce.date({ required_error: "Data de atualização é obrigatória" }),
});
