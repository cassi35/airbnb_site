import { User } from "#interface/auth.js";
import { ObjectId } from "mongodb";
import z from "zod";
export const userSchema = z.object({
  id: z.any().optional(), // ObjectId, pode ser validado com z.string() se for string
  email: z.string().email("invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be at most 100 characters long"),
  name: z.string(),
  role: z.enum(['user', 'host', 'admin', 'advertiser']).optional(),
  verified: z.boolean().optional(),
  provider: z.enum(['local', 'google', 'facebook', 'apple']).optional(),
  verificationToken: z.string().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  access_token: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  googleAccessToken: z.string().optional(),
  picture: z.string().optional(),
  hostData: z.object({
  isHost: z.boolean(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']),
  hostDescription: z.string().max(500).optional(),
  languages: z.array(z.string()).optional(),
  responseRate: z.number().min(0).max(100).optional(), // porcentagem
  responseTime: z.string().optional(), // ex: "within an hour"
  superhost: z.boolean().optional(),
  totalListings: z.number().int().min(0).optional(),
  reviewsCount: z.number().int().min(0).optional(),
  rating: z.number().min(0).max(5).optional(), // nota média
  }).optional(),
  advertiserData: z.object({
    isAdvertiser: z.boolean(),
    companyName: z.string(),
    contactEmail: z.string(),
    phone: z.string(),
    businessType: z.enum(['individual', 'company', 'agency']),
    totalAnnouncements: z.number(),
    activeAnnouncements: z.number(),
    totalSpent: z.number(),
    status: z.enum(['active', 'suspended', 'inactive']),
    verificationStatus: z.enum(['pending', 'verified', 'rejected']),
  }).optional(),
    properties: z.array(z.instanceof(ObjectId)).default([]).optional()
}) satisfies z.ZodType<User>;

export const verifyEmailSchema = z.object({
  email: z.string().email("invalid email format"),
  verificationToken: z.string().min(1, "Verification token is required")
});

export const loginSchema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("invalid email format"),
  role: z.enum(['advertiser', 'user', 'admin']).optional() // Adicionando o campo role
});

export const resetPasswordSchema = z.object({
  email: z.string().email("invalid email format"),
  resetPasswordToken: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(['advertiser', 'user', 'admin'])
});

export const resendVerificationTokenSchema = z.object({
  email: z.string().email("invalid email format"),
  type:z.enum(['verification', 'reset'])
});

export const getUserSchema = z.object({
  email: z.string().email("invalid email format"),
  role: z.enum(['advertiser', 'user', 'admin']).optional() // Adicionando o campo role
});

export const googleCompleteSignupSchema = z.object({
  role:z.enum(['user', 'host', 'admin', 'advertiser']),
  user:z.object({
  id: z.any().optional(), // ObjectId, pode ser validado com z.string() se for string
  email: z.string().email("invalid email format"),
  name: z.string(),
  picture: z.string().optional(),
  googleAccessToken: z.string().optional(),
  role: z.enum(['user', 'host', 'admin', 'advertiser']),
  verified: z.boolean(),
  verificationToken: z.string().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  hostData: z.object({
   isHost: z.boolean(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']),
  hostDescription: z.string().max(500).optional(),
  languages: z.array(z.string()).optional(),
  responseRate: z.number().min(0).max(100).optional(), // porcentagem
  responseTime: z.string().optional(), // ex: "within an hour"
  superhost: z.boolean().optional(),
  totalListings: z.number().int().min(0).optional(),
  reviewsCount: z.number().int().min(0).optional(),
  rating: z.number().min(0).max(5).optional(), // nota média
  }).nullable().optional(),
  advertiserData: z.object({
    isAdvertiser: z.boolean(),
    companyName: z.string(),
    contactEmail: z.string(),
    phone: z.string(),
    businessType: z.enum(['individual', 'company', 'agency']),
    totalAnnouncements: z.number(),
    activeAnnouncements: z.number(),
    totalSpent: z.number(),
    status: z.enum(['active', 'suspended', 'inactive']),
    verificationStatus: z.enum(['pending', 'verified', 'rejected']),
    createdAt: z.date(),
    updatedAt: z.date(),
  }).nullable().optional()
}),
  email: z.string().email("invalid email format"),
    properties: z.array(z.instanceof(ObjectId)).default([]).optional()
});