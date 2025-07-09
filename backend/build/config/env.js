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
    REDIS_URL: zod_1.default.string().url().optional()
});
const parseEnv = envSchema.parse(process.env);
process.env = Object.create({ ...process.env, ...parseEnv });
