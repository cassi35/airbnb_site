import { deleteAnnouncementFromListResponse } from "#controllers/listing/deleteAnnouncementsFromList.js";
import { getAnnouncementListUserResponse } from "#controllers/listing/getAnnoucementLIstUser.js";
import { getAnnouncementResponseListing } from "#controllers/listing/getAnnouncementListing.js";
import { Property } from "#database/schemas/property.schema.js";
import { GoogleUser } from "#interface/google.schema.js";
import { User } from "@sentry/node";
import { FastifyInstance } from "fastify";
import { ObjectId, PullOperator, PushOperator } from "mongodb";

class Listing{
    private app:FastifyInstance
    constructor(app:FastifyInstance){
        this.app = app;
    }
     private connectDB():boolean{
          if(!this.app.mongo.db){
                this.app.log.error("MongoDB not connected");
                return false;
            }
            return true;   
    }
   
    async getById(id:ObjectId):Promise<getAnnouncementResponseListing>{
        try {
            const connect = await this.connectDB()
            if(!connect){
                return {
                    sucess: false,
                    message: "Database connection error"
                }
            }
            const announcement = await this.app.mongo.db?.collection<Property>('announcements').findOne({_id: id});
            if(!announcement){
                return {
                    sucess: false,
                    message: "Announcement not found"
                }
            }
            return {
                sucess: true,
                message: "Announcement fetched successfully",
                announcement: announcement
            }
        } catch (error) {
            return {
                sucess: false,
                message:`error getting announcement ${error}`
            }
        }
    }
    async createListing(data:object):Promise<void>{

    }
    async updateListing(id:object,data:object):Promise<void>
    {

    }
    async deleteAll():Promise<void>{

    }
    async deleteById(id:object):Promise<void>{

    }
    async getActiveAnnouncements():Promise<void>{

    }
    async getAnnouncementListById(id:ObjectId):Promise<void>{

    }
    async getAllAnnouncementLists(userId:ObjectId):Promise<getAnnouncementListUserResponse>{
        try {
            const connect = await this.connectDB()
            if(!connect){
                return {
                    success: false,
                    message: "Database connection error"
                }
            }
            const announcements = await this.app.mongo.db?.collection<User | GoogleUser>('user').findOne({
                _id: userId
            })
            if(!announcements){
                return {
                    success: false,
                    message: "No announcements found for this user"
                }
            }
            return {
                success: true,
                message: "Announcements fetched successfully",
                announcements: announcements.listings || [] // Assuming 'listings' is the field containing the announcements
            }
        } catch (error) {
            return {
                success: false,
                message: `Error fetching announcements: ${error}`
            }
        }
    }
    async deleteAnnouncementFromList(userId:ObjectId,announcementId:ObjectId):Promise<deleteAnnouncementFromListResponse>{
        try {
            const connect = await this.connectDB()
            if(!connect){
                return {
                    success:false,
                    message:"error database connection"
                }
            }
            const result = await this.app.mongo.db?.collection<User | GoogleUser>('user').updateOne(
                { _id: userId },
                { $pull: { listings: { _id: announcementId } } } as any
            )
            if(!result || result.modifiedCount == 0){
                return {
                    success: false,
                    message: "Announcement not found in the user's list"
                }
            }
            const announcements = await this.getAllAnnouncementLists(userId);
            if(!announcements.success){
                return {
                    success: false,
                    message: announcements.message
                }
            }
            return {
                success: true,
                message: "Announcement deleted successfully",
                announcements: announcements.announcements
            }
        } catch (error) {
            return {
                success: false,
                message: `Error deleting announcement from list: ${error}`
            }
        }
    }   
}
export default Listing;