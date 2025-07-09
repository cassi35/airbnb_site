import { ObjectId } from "mongodb";
type role = 'user' | 'host' | 'admin'
export interface User{
id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: role;
  verified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}