import { FastifyInstance } from "fastify";
import { User } from "interface/auth";
import log from 'consola'
import ck from 'chalk'
class AuthService{
    private app:FastifyInstance
    private userCollection:any 
    constructor(fastify:FastifyInstance){
        this.app = fastify
        this.userCollection = this.app.mongo.db?.collection("users")
    }
  async createUser(userData:User){
    try {
        
    } catch (error) {
        log.error(ck.red('Error creating user:', error))
        throw new Error('Failed to create user')
    }
  }
   
}