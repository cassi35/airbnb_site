import { SearchAnnouncementResponse, searchBody } from "#controllers/user/getSearchAnnouncement.js";
import { UserResponse } from "#controllers/user/getUserController.js";
import { Message } from "#database/schemas/messages.schema.js";
import { ObjectId } from "mongodb";

export interface ResponseCreateMessage {
    success: boolean;
    message: Message | null;
    error?: string;
}

export interface ResponseGetMessages {
    success: boolean;
    messages: Message[];
    error?: string;
}

export interface ResponseDeleteMessage {
    success: boolean;
    message: string;
    error?: string;
}

export interface ResponseMarkAsRead {
    success: boolean;
    message: string;
    error?: string;
}

export interface ResponseGetConversations {
    success: boolean;
    conversations: {
        roomId: string;
        participants: string[];
        lastMessage?: Message;
    }[];
    error?: string;
}

export interface UserServiceFunction {
    getUserById(userId: ObjectId): Promise<UserResponse>;
    searchAnnouncements(data: searchBody): Promise<SearchAnnouncementResponse>;
}

export interface WebSocketServiceFunctionProtocol {
    handleConnection(): void;
    createMessage(data: Message): Promise<ResponseCreateMessage>;
    getMessagesByRoom(roomId: string): Promise<ResponseGetMessages>;
    getUserConversations(userId: string): Promise<ResponseGetConversations>;
    deleteMessage(messageId: ObjectId): Promise<ResponseDeleteMessage>;
    markMessageAsRead(messageId: ObjectId): Promise<ResponseMarkAsRead>;
}