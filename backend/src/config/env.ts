import z from 'zod'
const envSchema = z.object({
    PORT:z.number().default(3000),
    PASSSWORD_CLUSTER:z.string() ,
    USERNAME_CLUSTER:z.string(),
    DATABASE_CONNECTION:z.string().url(),
    HOST:z.string().url().default("localhost:3000"),
    JWT_SECRET:z.string(),
    SMTP_USER:z.string().email(),
    SMTP_PASS:z.string(),
    NODE_ENV:z.enum(['development', 'production']).default('development'),
    SENDER_EMAIL:z.string().email(),
    REDIS_URL:z.string().url().optional(),
    RESEND_API_KEY:z.string().optional(),
    SENDER_EMAIL_FROM_GMAIL:z.string().email().optional(),
    SENHA_DE_APP:z.string().optional(),
    GOOGLE_CLIENT_ID:z.string().optional(),
    GOOGLE_CLIENT_SECRET:z.string().optional(),
    GOOGLE_REDIRECT_URI:z.string().url().optional(),
    CLOUNDINARY_NAME:z.string().optional(),
    CLOUNDINARY_API_KEY:z.string().optional(),
    CLOUNDINARY_API_SECRET:z.string().optional(),
    STRIPE_API_KEY:z.string(),
    STRIPE_SECRET_KEY:z.string(),
    BASE_URL:z.string().url().default("http://localhost:3000"),
    STRIPE_WEBHOOK_SECRET:z.string() 
})
type envSchema = z.infer<typeof envSchema>
declare global{
    namespace NodeJS{
        interface ProcessEnv extends envSchema{

        }
    }
}
const parseEnv = envSchema.parse(process.env)
process.env = Object.create({...process.env,...parseEnv})