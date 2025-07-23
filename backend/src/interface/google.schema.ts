import { Property } from "#database/schemas/property.schema.js";
import { ObjectId } from "mongodb";
export interface GoogleUser{
id?: ObjectId;
  email: string;
  name: string;
  picture?: string;
  googleAccessToken?: string; // ✅ ADICIONAR
  role: 'user' | 'host' | 'admin'| 'advertiser';
  verified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
    // // ✅ Dados do Host (se for host)
    hostData?: {
        isHost: boolean;
        hostSince: Date;
        verificationStatus: 'pending' | 'verified' | 'rejected';
        hostDescription?: string;
        languages?: string[];
        responseRate?: number;
        responseTime?: string;
        superhost?: boolean;
        totalListings?: number;
        reviewsCount?: number;
        rating?: number;
    } | null; // ✅ Pode ser nulo se não for host
     // ✅ Dados do Advertiser (se for anunciante)
    advertiserData?: {
        isAdvertiser: boolean;
        companyName: string;
        contactEmail: string;
        phone: string;
        businessType: 'individual' | 'company' | 'agency';
        totalAnnouncements: number;
        activeAnnouncements: number;
        totalSpent: number;
        status: 'active' | 'suspended' | 'inactive';
        verificationStatus: 'pending' | 'verified' | 'rejected';
        createdAt: Date;
        updatedAt: Date;
        properties?:ObjectId[]
    } | null; // ✅ Pode ser nulo se não for anunciante
}