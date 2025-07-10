import { FastifyInstance } from "fastify";
import { User } from "interface/auth";
import log from 'consola'
import ck from 'chalk'
import CacheService from "../services /redis.service";
import { generateVerificationToken } from "token/generateVerificationToken";
import { sendVerificationToken } from "emails/email";
import type { StatusResponse } from "interface/responses";

type  createUserResponse = StatusResponse
class AuthService{
    private app:FastifyInstance
    private userCollection:any 
    private redis:any 
    constructor(fastify:FastifyInstance){
        this.app = fastify
        this.userCollection = this.app.mongo.db?.collection("users")
        this.redis = this.app.redis
      }
  async createUser(userData: Omit<User, '_id' | 'verified' | 'createdAt' | 'updatedAt'>): Promise<createUserResponse> {
    try {
        const existsUser = await this.userCollection.find({ email: userData.email })
        .toArray()
        if(existsUser.length > 0){
            log.warn(ck.yellow('User already exists:', userData.email))
            throw new Error('User already exists')
        }
      const haskPassword = await this.app.bcrypt.hash(userData.password)
      const tokenVerification = generateVerificationToken()
      const tempUser:Omit<User,'_id'> = {
        ...userData,
        password:haskPassword,
        verified:false,
        createdAt: new Date(),
        updatedAt: new Date(),
        verificationToken: tokenVerification,
        role:'user',
        provider:'local'
      }
      const cache = new CacheService(this.app, 'auth:')
      // Verificação do cache
      const userExistsInCache = await cache.get<User>(`verify:${userData.email}`)
     if(userExistsInCache){
        log.warn(ck.yellow('User already exists in cache:', userData.email))
        const errorResponse:createUserResponse  =  {
          status: 'error',
          success: false,
          message: 'User already exists in cache',
          verified: false
        }
        return errorResponse
      }
      // Envio do email
      const teste = await sendVerificationToken(tokenVerification,userData.email)
      if(!teste){
        log.error(ck.red('Failed to send verification email'))
        const errorResponse:createUserResponse  =  {
          status: 'error',
          success: false,
          message: 'Failed to send verification email',
          verified: false
        }
        return errorResponse
      }
      // Salvar no cache
      await cache.set(  `verify:${userData.email}`,  //primeiro enviar email
      JSON.stringify(tempUser),300) // 5 minutos de cache
      log.success(ck.green('Verification token sent to:', userData.email))
     const response:StatusResponse = {
        user: tempUser,
        token: tokenVerification,
        verified: false,
        status: 'pending',
        success: true,
        message: 'User created'
     }
      return response 
      } catch (error) {
        const response:StatusResponse = {
          status: 'error',
          success: false,
          message: 'Failed to create user',
          verified: false
        }
        log.error(ck.red('Error creating user:', error))
        return response 
    }
  }
 

}
export default AuthService
//colocar redis aqul