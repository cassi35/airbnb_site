import fastify from 'fastify'
import cors from '@fastify/cors'
import autoload from '@fastify/autoload'
import path from 'path'
import ck from 'chalk'
import log from 'consola'
import fastifyJwt from '@fastify/jwt'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { connectSwagger } from './plugins/swegger'
import { connectDB } from './database'  // Use caminho relativo aqui
import fastifyCookie from '@fastify/cookie'
import { connectRedis } from './plugins/redis'  // Use caminho relativo aqui
import fastifyBcrypt from 'fastify-bcrypt'
import { cloundinaryConnection } from '#config/cloudinary.js'
import { stripeConnection } from '#config/stripe.js'
import { initSentry } from '#config/sentry.js'
import { hooksFastify } from 'hooks/hook'

const app = fastify({logger:true}).withTypeProvider<ZodTypeProvider>()

// Função assíncrona para garantir a ordem correta de inicialização
async function startServer() {
    try {
        // 1. Registrar plugins básicos primeiro
        app.register(fastifyCookie, {
            secret: process.env.COOKIE_SECRET || 'meu-segredo-para-assinar-cookies',
            hook: 'onRequest',
            parseOptions: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            }
        });
        
        app.register(cors, {origin:"*"})
        app.register(fastifyJwt, {
            secret: process.env.JWT_SECRET
        })
        app.register(fastifyBcrypt, {saltWorkFactor:10})
        
        // 2. Conectar ao banco ANTES de registrar rotas
        await connectDB(app)
        await connectRedis(app)
        await cloundinaryConnection()
        await stripeConnection()  // Certifique-se de que a função stripeConnection está importada corretamente
        await initSentry()  // Inicializar o Sentry
        // 3. Registrar o swagger
        
        app.register(connectSwagger)
        // 4. Registrar as rotas DEPOIS da conexão ao banco
        app.register(autoload, {
            dir: path.join(__dirname, "routes"),
            routeParams: true,
        })
        // 5. Registrar hooks
        app.addHook("onRoute", ({method, path}) => {
            if(method == "HEAD" || method == "OPTIONS") {
                return
            }
            log.success(`Route registered: ${ck.yellow(method)} ${ck.blue(path)}`)
        })
        app.register(hooksFastify)
        // 6. Iniciar o servidor
        const PORT = Number(process.env.PORT) || 3000
        await app.listen({port: PORT, host: ""})
        console.log(`${ck.green("Servidor rodando na porta")} ${PORT} ${ck.blue("http://localhost:" + PORT)}`)
    } catch (error) {
        log.error(ck.red('Error starting server:', error))
        process.exit(1)
    }
}

startServer()