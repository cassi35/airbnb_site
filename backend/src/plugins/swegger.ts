import {FastifyInstance} from 'fastify'
import fastifySwagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import ck from 'chalk'
import log from 'consola'
export const connectSwagger = async (app:FastifyInstance)=>{
    try {
        await app.register(fastifySwagger,{
       swagger:{
        info:{
            title:"AirBnb API",
            description:"API for AirBnb clone",
            version:"1.0.0"
        },
        host:process.env.HOST || "http://localhost:3000",
        schemes:["http"],
        consumes:["application/json"],
        produces:["application/json"],
       }
    })
    console.log(`${ck.green("Swagger connected successfully")}`)
    await app.register(swaggerUi,{
        routePrefix:'/docs',
        uiConfig:{
            docExpansion:"full",
            deepLinking:true,
        }
    })
    } catch (error) {
        log.error(`${ck.red("Error connecting to Swagger")}`, error)
        process.exit(1)
    }
 
}