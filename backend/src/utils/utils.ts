import {DefineRoutesHandler} from '../types/type'
import { FastifyBaseLogger, RawReplyDefaultExpression, FastifyInstance,RawRequestDefaultExpression, RawServerDefault } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export type FastifyTypeInstance = FastifyInstance<
    RawServerDefault,
RawRequestDefaultExpression,
RawReplyDefaultExpression,
FastifyBaseLogger,
ZodTypeProvider
>
export function defineRoutes(handler:DefineRoutesHandler) {
    return function (app:FastifyTypeInstance,_:{},done:Function){
        handler(app)
        done()
    }
}