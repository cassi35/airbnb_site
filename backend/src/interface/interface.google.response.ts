import { GoogleUser } from "./google.schema";

export interface GoogleCompleteSignupBody {
    Body:{
        role:GoogleUser['role'];
        user?:GoogleUser;
        email:string
    }
}