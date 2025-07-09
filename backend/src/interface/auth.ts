import { ObjectId } from "mongodb";
type role = 'user' | 'host' | 'admin' 
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
  createdAt?: Date;
  updatedAt?: Date;
}