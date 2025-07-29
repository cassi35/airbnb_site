import { SearchAnnouncementResponse, searchBody } from "#controllers/user/getSearchAnnouncement.js";
import { UserResponse } from "#controllers/user/getUserController.js";
import { Property } from "#database/schemas/property.schema.js";
import { GoogleUser } from "#interface/google.schema.js";
import { User } from "@sentry/node";
import { FastifyInstance } from "fastify";
import { ObjectId } from "mongodb";

class UserService {
    private app: FastifyInstance;   
    constructor(app:FastifyInstance){
        this.app = app;
    }
    async getUserById(userId:ObjectId):Promise<UserResponse>{
    try {
        const user = await this.app.mongo.db?.collection<GoogleUser | User>("user").findOne({ _id: userId });
        if(!user) {
            return {
                message: `User with ID ${userId} not found`,
                success: false
            };
        }
        return {
            message: `User with ID ${userId} found`,
            success: true,
            user: user
        }
    } catch (error) {
        return {
            message: `Error fetching user with ID ${userId}`,
            success:false
        }
    }
    }
   async searchAnnouncements(data:searchBody):Promise<SearchAnnouncementResponse>{
    try {
        
    } catch (error) {
        return {
            success: false,
            message: "An error occurred while searching for announcements",
        }
    }
   }
}
export default UserService