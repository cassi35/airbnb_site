import { ObjectId } from "mongodb";
type role = 'user' | 'host' | 'admin' | 'advertiser';
type provider = 'local' | 'google' | 'facebook' | 'apple'
export interface User{
id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role?: role;
  verified?: boolean;
  provider?:provider;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
    access_token?: string; // ✅ ADICIONAR
  createdAt?: Date;
  updatedAt?: Date;
  googleAccessToken?: string; // ✅ ADICIONAR
  picture?: string; // ✅ ADICIONAR

  // // ✅ Dados do Host (se for host)
    hostData?: {
        isHost: boolean;
        verificationStatus: 'pending' | 'verified' | 'rejected';
        hostDescription?: string;
        languages?: string[];
        responseRate?: number;
        responseTime?: string;
        superhost?: boolean;
        totalListings?: number;
        reviewsCount?: number;
        rating?: number;
    };
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
    };
    
}