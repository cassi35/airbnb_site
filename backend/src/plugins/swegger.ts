import {FastifyInstance} from 'fastify'
import fastifySwagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import ck from 'chalk'
import log from 'consola'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export const connectSwagger = async (app: FastifyInstance) => {
    try {
        await app.register(fastifySwagger, {
            openapi: {  // ⚠️ Usar openapi em vez de swagger
                info: {
                    title: "AirBnb API",
                    description: "API for AirBnb clone",
                    version: "1.0.0"
                },
                servers: [{
                    url: 'http://localhost:3000'
                }]
            },
            hideUntagged: false,  // ⚠️ MUITO IMPORTANTE! Mostra rotas sem tags
            transform: jsonSchemaTransform
        })

        await app.register(swaggerUi, {
            routePrefix: '/docs',
            uiConfig: {
                docExpansion: "list",
                deepLinking: true,
            }
        })

        console.log(`${ck.green("Swagger connected successfully")}`)
    } catch (error) {
        log.error(`${ck.red("Error connecting to Swagger")}`, error)
        process.exit(1)
    }
}