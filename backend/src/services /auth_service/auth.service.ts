import { FastifyInstance, FastifyReply } from "fastify";
import { User } from "interface/auth";
import log from 'consola'
import ck from 'chalk'
import CacheService from "./redis.service";
import { generateVerificationToken } from "token/generateVerificationToken";
import { sendVerificationToken, welcomeEmail } from "emails/email";
import type { StatusResponse } from "interface/responses";
import { generateToken, setTokenCookie } from "token/generateToken";
import { ObjectId } from "mongodb";

type  createUserResponse = StatusResponse
type verifyTokenResponse = StatusResponse
type LoginResponse = StatusResponse & { token?: string, user?: User }
type UserMongoDB = Omit<User,'id'> & {_id:ObjectId}
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
        role:userData.role,
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
     await cache.set(`verify:${userData.email}`, tempUser, 300) // Expira em 5 minutos
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
  async verifyToken(token:string,email:string):Promise<verifyTokenResponse>{
    try {
      const cache = new CacheService(this.app, 'auth:')
      const userData = await cache.get<User>(`verify:${email}`)
      if(!userData){
        log.warn(ck.yellow('User not found in cache:', email))
        const errorResponse:verifyTokenResponse = {
          status: 'error',
          success: false,
          message: 'User not found in cache',
          verified: false
        }
        return errorResponse
      }
      if(userData.verificationToken != token){
        log.warn(ck.yellow('Invalid verification token:', token))
      console.log('=== DEBUG REDIS ===')
      console.log('Email buscado:', email)
      console.log('Dados do cache:', userData)
      console.log('Token enviado:', token)
      console.log('Token no cache:', userData?.verificationToken)
      console.log('==================')
         const errorResponse:verifyTokenResponse = {
          status: 'error',
          success: false,
          message: 'Invalid verification token',
          verified: false
        }
        return errorResponse
      }
      // Atualizar o usuário no banco de dados
      const user = await cache.get<User>(`verify:${email}`)
    
      if(!user)
      {
        log.warn(ck.yellow('User not found in cache:', email))
        const errorResponse:verifyTokenResponse = {
          status: 'error',
          success: false,
          message: 'User not found in cache',
          verified: false
        }
        return errorResponse
      }
      const newUser:Omit<User, '_id'> = {
        ...user,
        verified: true,
        verificationToken: undefined, // Limpar o token de verificação
        updatedAt: new Date()
      }
     const result = await this.app.mongo.db?.collection('user').insertOne(newUser)
      if(!result?.acknowledged && !result?.insertedId){
        log.error(ck.red('Failed to update user in database:', email))
        const errorResponse:verifyTokenResponse = {
          status: 'error',
          success: false,
          message: 'error to insert user in database',
          verified: false
        }
        return errorResponse
      }
      //remove do cache 
      await cache.del(`verify:${email}`)
      const userDeleted  = await cache.get<User>(`user:${email}`)
      if(userDeleted){
        log.warn(ck.yellow('User still exists in cache after deletion:', email))
        const errorResponse:verifyTokenResponse = {
          status: 'error',
          success: false,
          message: 'User still exists in cache after deletion',
          verified: false
        }
        return errorResponse
      }
      const sendWelcomeEmail = await welcomeEmail(user.email)
      if(!sendWelcomeEmail){
        log.error(ck.red('Failed to send welcome email'))
        const errorResponse:verifyTokenResponse = {
          status: 'error',
          success: false,
          message: 'Failed to send welcome email',
          verified: false
        }
        return errorResponse
      }
      const tokenCookie = generateToken(this.app,result.insertedId.toString(),user.email)
     const responseSucess:verifyTokenResponse = {
        user: newUser,
        status: 'success',
        success: true,
        message: 'User verified successfully',
        verified: true,
        token: tokenCookie // Retorna o token JWT
      }
      return responseSucess
    } catch (error) {
      log.error(ck.red('Error verifying token:', error))
      const errorResponse:verifyTokenResponse = {
        status: 'error',
        success: false,
        message: 'Failed to verify token',
        verified: false
      }
      return errorResponse
    }
  }
 async loginUser(email:string,password:string,role:string):Promise<LoginResponse>{
  try {
    let exists = await this.app.mongo.db?.collection<User>('user').findOne({ email: email })
    if(!exists){
      log.warn(ck.yellow('User not found:', email))
      const errorResponse:LoginResponse = {
        status: 'error',
        success: false,
        message: 'User not found',
        verified: false
      }
      return errorResponse
    }
    let isMatch = await this.app.bcrypt.compare(password, exists.password)
    if(!isMatch){
      log.warn(ck.yellow('Password does not match for user:', email))
      const errorResponse:LoginResponse = {
        status: 'error',
        success: false,
        message: 'Password does not match',
        verified: false
      }
      return errorResponse
    }
    if(!exists.verified){
      log.warn(ck.yellow('User is not verified:', email))
      const errorResponse:LoginResponse = {
        status: 'error',
        success: false,
        message: 'User is not verified',
        verified: false
      }
      return errorResponse
    }
    const token = generateToken(this.app, exists._id.toString(),exists.email)
    const responseSuccess:LoginResponse = {
      user:exists,
      token: token,
      status: 'success',
      success: true,
      message: 'User logged in successfully',
      verified: true
    }
    return responseSuccess
  } catch (error) {
    log.error(ck.red('Error logging in user:', error))
    const errorResponse:LoginResponse = {
      status: 'error',
      success: false,
      message: error instanceof Error ? error.message : 'Failed to login user',
      verified: false
    }
    return errorResponse
  }
}
async logoutUser(reply:FastifyReply):Promise<StatusResponse>{
  try {
    reply.clearCookie('token',{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    const response:StatusResponse = {
      status: 'success',
      success: true,
      message: 'User logged out successfully',
      verified: false
    }
    return response
  } catch (error) {
    log.error(ck.red('Error logging out user:', error))
    const errorResponse:StatusResponse = {
      status: 'error',
      success: false,
      message: error instanceof Error ? error.message : 'Failed to logout user',
      verified: false
    }
    return errorResponse
  }
}
async forgotPassword(email:string):Promise<StatusResponse>{
  try {
    const user = await this.app.mongo.db?.collection<User>('users').findOne({ email: email })
    if(!user){
      log.warn(ck.yellow('User not found for forgot password:', email))
      const errorResponse:StatusResponse = {
        status: 'error',
        success: false,
        message: 'User not found',
        verified: false
      }
      return errorResponse
    }
      const cache = new CacheService(this.app, 'auth:')
     const userExistsInCache = await cache.get<User>(`verify:${email}`)
    if(userExistsInCache){
        log.warn(ck.yellow('User already exists in cache:',email))
        const errorResponse:createUserResponse  =  {
          status: 'error',
          success: false,
          message: 'User already exists in cache',
          verified: false
        }
        return errorResponse
      }
      const tokenVerification = generateVerificationToken()
      // Envio do email
      const teste = await sendVerificationToken(tokenVerification,email)
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
      await cache.set(`verify:${email}`, {
        ...user,
        resetPasswordToken: tokenVerification,
        resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hora
      }, 300) // Expira em 5 minutos
      log.success(ck.green('Verification token sent to:', email))
      const response:StatusResponse = {
        user: {
          ...user,
          resetPasswordToken: tokenVerification,
          resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hora
        },
        token: tokenVerification,
        verified: false,
        status: 'pending',
        success: true,
        message: 'Password reset token sent'
      }
      return response
  } catch (error) {
    log.error(ck.red('Error in forgot password:', error))
    const errorResponse:StatusResponse = {
      status: 'error',
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process forgot password',
      verified: false
    }
    return errorResponse
  }
}
async resetPassword(token: string, email: string, newPassword: string): Promise<StatusResponse> {
    try {
      const cache = new CacheService(this.app, 'auth:')
      
      // Usar o tipo específico do MongoDB
      const userData = await cache.get<UserMongoDB>(`verify:${email}`)
      if (!userData || userData.resetPasswordToken !== token || !userData.resetPasswordExpires || userData.resetPasswordExpires < new Date()) {
        log.warn(ck.yellow('Invalid or expired reset password token:', token))
        return {
          status: 'error',
          success: false,
          message: 'Invalid or expired reset password token',
          verified: false
        }
      }
      
      const hashedPassword = await this.app.bcrypt.hash(newPassword)
      
      // Fazer update apenas dos campos necessários
      const result = await this.app.mongo.db?.collection('users').updateOne(
        { email }, 
        { 
          $set: {
            password: hashedPassword,
            updatedAt: new Date()
          },
          $unset: {
            resetPasswordToken: "",
            resetPasswordExpires: ""
          }
        }
      )
      
      if (!result?.acknowledged) {
        log.error(ck.red('Failed to update user password in database:', email))
        return {
          status: 'error',
          success: false,
          message: 'Failed to update user password in database',
          verified: false
        }
      }
      
      await cache.del(`verify:${email}`)
      log.success(ck.green('User password reset successfully:', email))
      
      return {
        user: {
          ...userData,
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
          updatedAt: new Date()
        },
        status: 'success',
        success: true,
        message: 'Password reset successfully',
        verified: true
      }
    } catch (error) {
      log.error(ck.red('Error resetting password:', error))
      return {
        status: 'error',
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reset password',
        verified: false
      }
    }
  }
async resendToken(email: string, type: 'verification' | 'reset'): Promise<StatusResponse> {
  try {
    const cache = new CacheService(this.app, 'auth:')
    let userData: User | null = null
    
    if (type === 'verification') {
      // Para verificação de email - busca no cache
      userData = await cache.get<User>(`verify:${email}`)
      if (!userData) {
        return {
          status: 'error',
          success: false,
          message: 'User not found in cache. Please signup again.',
          verified: false
        }
      }
    } else if (type === 'reset') {
      // Para reset de senha - busca no banco
      const userFromDB = await this.app.mongo.db?.collection<User>('users').findOne({ email })
      if (!userFromDB) {
        return {
          status: 'error',
          success: false,
          message: 'User not found',
          verified: false
        }
      }
      userData = userFromDB
    }
    
    if (!userData) {
      return {
        status: 'error',
        success: false,
        message: 'User data not found',
        verified: false
      }
    }
    
    const tokenVerification = generateVerificationToken()
    const sendEmail = await sendVerificationToken(tokenVerification, email)
    
    if (!sendEmail) {
      return {
        status: 'error',
        success: false,
        message: 'Failed to send verification email',
        verified: false
      }
    }
    
    // Preparar dados para o cache baseado no tipo
    const cacheData = type === 'verification' 
      ? { ...userData, verificationToken: tokenVerification }
      : { 
          ...userData, 
          resetPasswordToken: tokenVerification,
          resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hora
        }
    
    await cache.set(`verify:${email}`, cacheData, 300)
    
    const message = type === 'verification' 
      ? 'Verification email resent successfully'
      : 'Password reset email resent successfully'
    
    log.success(ck.green(`${message} to:`, email))
    
    return {
      user: cacheData,
      token: tokenVerification,
      verified: false,
      status: 'pending',
      success: true,
      message
    }
  } catch (error) {
    log.error(ck.red('Error resending token:', error))
    return {
      status: 'error',
      success: false,
      message: error instanceof Error ? error.message : 'Failed to resend token',
      verified: false
    }
  }
}
async getUserByEmail(email: string): Promise<StatusResponse> {
    try {
    const user = await this.app.mongo.db?.collection<User>('users').findOne({ email }) 
    if(!user){
      log.warn(ck.yellow('User not found by email:', email))
      return {
        status: 'error',
        success: false,
        message: 'User not found',
        verified: false
      }

    } 
    const response: StatusResponse = {
      user: user,
      status: 'success',
      success: true,
      message: 'User fetched successfully',
      verified: user.verified ?? false
    }
    return response
    } catch (error) {
    log.error(ck.red('Error fetching user by email:', error))
    return{
      status: 'error',
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch user by email',
      verified: false
    }
    }
  }
 async serverError():Promise<StatusResponse>{
  try {
    const server_mmongo = this.app.mongo
    if(!server_mmongo || !server_mmongo.db){
      log.error(ck.red('MongoDB is not available on the server instance'))
      return {
        status: 'error',
        success: false,
        message: 'Database connection error',
        verified: false
      }
    }
    const response:StatusResponse = {
      status: 'success',
      success: true,
      message: 'Server is running and MongoDB is connected',
      verified: false
    }
    return response
  } catch (error) {
    log.error(ck.red('Error in server error:', error))
    return {
      status: 'error',
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      verified: false
    }
  }
 }
}
export default AuthService
//colocar redis aqul