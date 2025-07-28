import { deleteAnnouncementFromListResponse } from "#controllers/listing/deleteAnnouncementsFromList.js";
import { getAnnouncementListUserResponse } from "#controllers/listing/getAnnoucementLIstUser.js";
import { getAnnouncementResponseListing } from "#controllers/listing/getAnnouncementListing.js";
import { InsertListingResponse } from "#controllers/listing/insertListing.js";
import { Property } from "#database/schemas/property.schema.js";
import { GoogleUser } from "#interface/google.schema.js";
import { User } from "@sentry/node";
import { FastifyInstance } from "fastify";
import { ObjectId, PullOperator, PushOperator } from "mongodb";
import log from 'consola'
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
    async getAnnouncementOfUserList(userId:ObjectId,announcementId:ObjectId):Promise<getAnnouncementResponseListing>{
        try {
            const connect = await this.connectDB()
            if(!connect){
                return {
                    sucess: false,
                    message: "Database connection error"
                }
            }
            const user = await this.app.mongo.db?.collection<User | GoogleUser>('user').findOne({ _id: userId });
            if(!user){
                return {
                    sucess: false,
                    message: "User not found"
                }
            }
              const exists = user.listings?.some((announcement:ObjectId )=>announcement.equals(announcementId));
              if(!exists){
                return {
                    sucess: false,
                    message: "Announcement not found in the user's list"
                }
              }
            const announcement = await this.app.mongo.db?.collection<Property>('announcements').findOne({ _id: announcementId });
            if(!announcement){
                return {
                    sucess: false,
                    message: "Announcement not found in the list"
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
                message: `Error getting announcement from user list: ${error}`
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
            const user = await this.app.mongo.db?.collection<User | GoogleUser>('user').findOne({ _id: userId });
            if(!user){
                return {
                    success: false,
                    message: "User not found"
                }
            }
            const announcementExists = await this.getById(announcementId)
            if(!announcementExists.sucess){
                return {
                    success: false,
                    message: announcementExists.message
                }
            }
            const result = await this.app.mongo.db?.collection<User | GoogleUser>('user').updateOne(
                { _id: userId },
                { $pull: { listings: announcementId } } as any
            )
            if(!result || result.modifiedCount == 0){
                return {
                    success: false,
                    message: "Announcement not found in the user's list" + result
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
    async existsInList(userId:ObjectId,announcementId:ObjectId):Promise<{sucess:boolean,message:string}>{
        try {
            const connect = await this.connectDB()
            if(!connect){
                console.log("Falha ao conectar ao banco");
                return {
                    sucess: false,
                    message: "Database connection error"
                }
            }
            const user = await this.app.mongo.db?.collection<User | GoogleUser>('user').findOne({ _id: userId });
            if(!user){
                console.log("Usuário não encontrado");
                return {
                    sucess: false,
                    message: "User not found"
                }
            }
            const exists = user.listings?.some((announcement:ObjectId )=>announcement.equals(announcementId));
            if(exists){
                 console.log("Announcement já existe na lista do usuário");
                return {
                    sucess: false,
                    message: "Announcement already exists in the user's list"
                };
            }
            return {
                sucess: false,
                message:`announcment não existe na lista ${user.listings.includes('6882201bccb65f1dbf77478b')} \n ${announcementId}\n ${user.listings[0]}`
            };
        } catch (error) {
           const errorMessage = error instanceof Error?error.message :String(error)
           return {
                sucess: false,
                message: errorMessage
            };
        }
    }
    async insertingList(userId:ObjectId,announcementId:ObjectId):Promise<InsertListingResponse>{
        try {
            const connect = await this.connectDB()
            if(!connect){
                return {
                    sucess: false,
                    message: "Database connection error"
                }
            }
            const announcement = await this.getById(announcementId)
            if(!announcement.sucess){
                return {
                    sucess: false,
                    message: announcement.message
                }
            }
            const existsList = await this.existsInList(userId, announcementId);
            if(existsList.sucess){
                return {
                    sucess: false,
                    message: existsList.message 
                }
            }
            const result = await this.app.mongo.db?.collection<User| GoogleUser>('user').updateOne(
                { _id: userId },
                { $push: { listings: announcementId } } as any 
            )
            if(!result || result.modifiedCount == 0){
                return {
                    sucess: false,
                    message: "Announcement already exists in the user's list"+userId
                }
            }
            
            return {
                sucess:true ,
                message: "Announcement inserted successfully",
                announcement:announcement.announcement
            }
        } catch (error) {
            return {
                sucess:false,
                message: `Error inserting listing: ${error}`,
            }
        }
    }
}
export default Listing;