import { Message } from "#database/schemas/messages.schema.js";
import { FastifyInstance } from "fastify";
import { ResponseCreateMessage, ResponseDeleteMessage, ResponseGetConversations, ResponseGetMessages, ResponseMarkAsRead, WebSocketServiceFunctionProtocol } from "functions/function";
import { ObjectId } from "mongodb";

export class MensageService implements WebSocketServiceFunctionProtocol{
    private app : FastifyInstance
    constructor(app:FastifyInstance){
        this.app = app 
    }
     handleConnection(): void {
        
    }
    async createMessage(data: Message): Promise<ResponseCreateMessage> {
        
    }
    async deleteMessage(messageId: ObjectId): Promise<ResponseDeleteMessage> {
        
    }
    async getMessagesByRoom(roomId: string): Promise<ResponseGetMessages> {

    }
    async getUserConversations(userId: string): Promise<ResponseGetConversations> {

    }
    async markMessageAsRead(messageId: ObjectId): Promise<ResponseMarkAsRead> {
        
    }
}