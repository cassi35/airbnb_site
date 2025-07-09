import z from 'zod'
const envSchema = z.object({
    PORT:z.number().default(3000),
    PASSSWORD_CLUSTER:z.string() ,
    USERNAME_CLUSTER:z.string(),
    DATABASE_CONNECTION:z.string().url(),
    HOST:z.string().url().default("localhost:3000"),
    JWT_SECRET:z.string(),
    STMP_USER:z.string().email(),
    STMP_PASS:z.string(),
    NODE_ENV:z.enum(['development', 'production']).default('development'),
    SENDER_EMAIL:z.string().email()
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