"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const envSchema = zod_1.default.object({
    PORT: zod_1.default.number().default(3000),
    PASSSWORD_CLUSTER: zod_1.default.string(),
    USERNAME_CLUSTER: zod_1.default.string(),
    DATABASE_CONNECTION: zod_1.default.string().url(),
    HOST: zod_1.default.string().url().default("localhost:3000"),
    JWT_SECRET: zod_1.default.string(),
    SMTP_USER: zod_1.default.string().email(),
    SMTP_PASS: zod_1.default.string(),
    NODE_ENV: zod_1.default.enum(['development', 'production']).default('development'),
    SENDER_EMAIL: zod_1.default.string().email(),
    REDIS_URL: zod_1.default.string().url().optional(),
    RESEND_API_KEY: zod_1.default.string().optional(),
    SENDER_EMAIL_FROM_GMAIL: zod_1.default.string().email().optional(),
    SENHA_DE_APP: zod_1.default.string().optional(),
    GOOGLE_CLIENT_ID: zod_1.default.string().optional(),
    GOOGLE_CLIENT_SECRET: zod_1.default.string().optional(),
    GOOGLE_REDIRECT_URI: zod_1.default.string().url().optional(),
    CLOUNDINARY_NAME: zod_1.default.string().optional(),
    CLOUNDINARY_API_KEY: zod_1.default.string().optional(),
    CLOUNDINARY_API_SECRET: zod_1.default.string().optional(),
    STRIPE_API_KEY: zod_1.default.string(),
    STRIPE_SECRET_KEY: zod_1.default.string(),
    BASE_URL: zod_1.default.string().url().default("http://localhost:3000"),
    STRIPE_WEBHOOK_SECRET: zod_1.default.string(),
    SENTRY_DSN: zod_1.default.string()
});
const parseEnv = envSchema.parse(process.env);
process.env = Object.create({ ...process.env, ...parseEnv });
