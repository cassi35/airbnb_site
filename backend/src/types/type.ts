import {FastifyInstance} from 'fastify'
export type DefineRoutesHandler = (app:FastifyInstance) => Promise<void> | void