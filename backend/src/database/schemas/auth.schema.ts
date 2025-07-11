export interface ResendTokenSchema {
    email: string;
    type: 'verification' | 'reset';
}
export interface SignUPSchema{
    email: string;
    password: string;
    name: string;
    role?: 'user' | 'host' | 'admin';
    provider?: 'local' | 'google' | 'facebook' | 'apple';
}
export interface LoginSchema{
    email: string;
    password: string;
}
export interface verifyEmailSchema {
    token: string;
    email: string;
}
export interface ResetPasswordSchema {
    token: string;
    email: string;
    newPassword: string;
}
export interface ForgotPasswordSchema{
    email: string;
}