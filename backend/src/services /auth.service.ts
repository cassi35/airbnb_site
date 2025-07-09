import { FastifyInstance } from "fastify";
import { User } from "interface/auth";
import log from 'consola'
import ck from 'chalk'
import CacheService from "../services /redis.service";
import { generateVerificationToken } from "token/generateVerificationToken";
import { sendVerificationToken } from "emails/email";
export interface StatusResponse{
  status:string,
  success:boolean,
  message:string
  verified:boolean
}
class AuthService{
    private app:FastifyInstance
    private userCollection:any 
    private redis:any 
    constructor(fastify:FastifyInstance){
        this.app = fastify
        this.userCollection = this.app.mongo.db?.collection("users")
        this.redis = this.app.redis
      }
  async createUser(userData: Omit<User, '_id' | 'verified' | 'createdAt' | 'updatedAt'>): Promise<StatusResponse> {
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
     
      const teste = await sendVerificationToken(tokenVerification,userData.email)
      if(!teste){
        log.error(ck.red('Failed to send verification email'))
        return {
          status: 'error',
          success: false,
          message: 'Failed to send verification email',
          verified: false
        }
      }
      await cache.set(  `verify:${userData.email}`,  //primeiro enviar email
      JSON.stringify(tempUser),300) // 5 minutos de cache
      log.success(ck.green('Verification token sent to:', userData.email))
      const response:StatusResponse = {
        status: 'pending',
        success: true,
        message: 'User created successfully, please verify your email',
        verified: false
      } 
      return response as StatusResponse
      } catch (error) {
        const response:StatusResponse = {
          status: 'error',
          success: false,
          message: 'Failed to create user',
          verified: false
        }
        log.error(ck.red('Error creating user:', error))
        return response as StatusResponse
    }
  }
  async verifyEmail(token:string,email:string):Promise<StatusResponse>{
      try {
        
      } catch (error) {
        
      }
  }
  async resendVerificationEmail(email:string):Promise<StatusResponse>{
      try {
        
      } catch (error) {
        
      }
  }
  async login(email:string,password:string):Promise<StatusResponse>{
      try {
        
      } catch (error) {
        
      }
  }
  async resetPassword(email:string):Promise<StatusResponse>{
    try {
      
    } catch (error) {
      
    }
  }
  async updatePassword(email:string,newPassword:string):Promise<StatusResponse>{
      try {
        
      } catch (error) {
        
      }
  }
  async deleteUser(email:string):Promise<StatusResponse>{
      try {
        
      } catch (error) {
        
      }
  }
  async getUser(email:string):Promise<User | null>{
    try {
      
    } catch (error) {
      
    }
  }
  async updateUser(email:string,updateUser:Partial<User>):Promise<StatusResponse>{
    try {
      
    } catch (error) {
      
    }
  }

}
export default AuthService
//colocar redis aqul