export interface GoogleUserData {
    id: string;
    token: string;
    accessToken?: string;
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
}
