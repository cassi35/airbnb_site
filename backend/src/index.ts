import fastify from 'fastify'
import cors from '@fastify/cors'
import autoload from '@fastify/autoload'
import path from 'path'
import ck from 'chalk'
import log from 'consola'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { connectSwagger } from './plugins/swegger'
const app = fastify({logger:true}).withTypeProvider<ZodTypeProvider>()
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