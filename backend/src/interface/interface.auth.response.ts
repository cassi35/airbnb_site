//importar todas as interfaces de request aqui

import { User } from "./auth";

export interface UserBody{
    Body:{
        email:string
        role:'advertiser' | 'user' | 'admin'

    }
}
export interface UserBodyLogin{
    Body:{
        email:string,
        password:string,
        role?:string
    }
}
type verificationType = 'verification' | 'reset';
export interface ResendVerificationTokenBody{
    Body: {
        email: string;
        type: verificationType;
    };
} 
export interface ResetPasswordBody {
     Body: {
         token: string;
          email: string; 
          newPassword: string;
          role: 'advertiser' | 'user' | 'admin'; // Adicionando o campo role
        } 
    }
export interface UserBodySignup{
    Body: User
}
export interface UserBodyVerifyEmail {
    Body: User
}
export interface GetUserByEmailBody{
    Body: {
        email: string;
        role: 'advertiser' | 'user' | 'admin';
    };
}
//importar todas as interfaces de response aqui 
export interface ForgotPasswordResponse {
    status:string;
    success:boolean;
    message:string;
    verified:boolean;
}
export interface ResponseLogin{
    user?:User,
    token?:string,
    status:string,
    success:boolean,
    verified:boolean,
    cookie?:string
}
export interface ResendVerificationTokenResponse {
    status: string;
    success: boolean;
    message: string;
    verified: boolean;
}
export interface ResetPasswordResponse {
    user?: User;
    token?: string;
    status: string;
    success: boolean;
    message: string;
    verified: boolean;  
}
export interface ResponseSignup {
    user?: User,
    token?: string,
    status: string, // Alterado de StatusResponse['status'] para string
    success: boolean,
    message: string,
    verified: boolean
}
export interface ResponseVerifyEmail{
    user?:User
    token?:string
    status: string; // Alterado de StatusResponse['status'] para string
    success: boolean;
    message: string;
    verified: boolean;
    cookie?:string
}
export interface ResponseGetUserByEmail{
    user?: User;
    status: string; // Alterado de StatusResponse['status'] para string
    success: boolean;
    message: string;
    verified: boolean;
}
//exportar todas as interfaces de request e response aqui e mandar para a funcion auth
export type authRequest = UserBody | UserBodyLogin | ResendVerificationTokenBody | ResetPasswordBody | UserBodySignup | UserBodyVerifyEmail;
export type authResponse = ForgotPasswordResponse | ResponseLogin | ResendVerificationTokenResponse | ResetPasswordResponse | ResponseSignup | ResponseVerifyEmail;