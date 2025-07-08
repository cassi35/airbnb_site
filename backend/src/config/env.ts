import z from 'zod'
const envSchema = z.object({
    PORT:z.number().default(3000),
    PASSSWORD_CLUSTER:z.string() ,
    USERNAME_CLUSTER:z.string(),
    DATABASE_CONNECTION:z.string().url(),
    HOST:z.string().url().default("localhost:3000"),
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