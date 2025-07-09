import { ObjectId } from "mongodb";
export interface GoogleUser{
id?: ObjectId;
  email: string;
  name: string;
  role: 'user' | 'host' | 'admin';
  verified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}