import fastify from 'fastify'
import cors from '@fastify/cors'
import autoload from '@fastify/autoload'
import path from 'path'
import ck from 'chalk'
import log from 'consola'
import fastifyJwt from '@fastify/jwt'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { connectSwagger } from './plugins/swegger'
import { connectDB } from 'database'
import cookie from '@fastify/cookie'
import { connectRedis } from 'plugins/redis'
const app = fastify({logger:true}).withTypeProvider<ZodTypeProvider>()
//registrando o plugin de cookie 
app.register(cookie, {
  secret: process.env.COOKIE_SECRET || 'my-secret', // para cookies assinados
  hook: 'onRequest', // opcional, define quando os cookies serão analisados
})
//swagger  
app.register(connectSwagger) 
//env 
const PORT = process.env.PORT || 3000

//middleware gobais 
app.register(cors,{origin:"*"})
app.register(autoload,{
    dir:path.join(__dirname,"routes")  ,
    routeParams:true 
})

// middleare de tratamento 

//conectando ao banco de dados 
app.register(connectDB)
app.register(connectRedis)
//middleware de autenticação
app.register(fastifyJwt,{
    secret: process.env.JWT_SECRET
})
//hooks 
app.addHook("onRoute",({method,path})=>{
    if(method == "HEAD" || method == "OPTIONS"){
        return
    }
    log.success(`Route registered: ${ck.yellow(method)} ${ck.blue(path)}`)
})
//rotas 
//inializacao do servidor 

app.listen({port:PORT,host:""})
.then(()=>{
    console.log(`${ck.green("Servidor rodando na porta 3000")} ${ck.blue("http://localhost:3000")}`)
}).catch(()=>{
    log.error(`${ck.red("Erro ao iniciar o servidor")}`)
    process.exit(1)
})