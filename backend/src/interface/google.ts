export interface GoogleUserData {
    id: string;
    token: string;
    access_token?: string;
    email: string;
    verified_email?: boolean;
    name: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
    role?: 'user' | 'admin' | 'advertiser';
    createdAt?: Date;
    updatedAt?: Date;
    provider?: 'google' | 'local' | 'facebook' | 'apple';
       // // ✅ Dados do Host (se for host)
    hostData?: {
        isHost: boolean;
        hostSince: Date;
        verificationStatus: 'pending' | 'verified' | 'rejected';
        // ... outros dados do host
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
        createdAt: Date;
        updatedAt: Date;
    };
}
