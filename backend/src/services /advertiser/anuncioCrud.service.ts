import cloudinary from "#config/cloudinary.js";
import { DeleteAnnouncementResponse } from "#controllers/advertiser/announcement/deleteAnnouncement.js";
import { Property } from "#database/schemas/property.schema.js";
import { GoogleUser } from "#interface/google.schema.js";
import { User } from "@sentry/node";
import { FastifyInstance } from "fastify";
import { ObjectId, PushOperator, UpdateResult } from "mongodb";
export interface createResponse{
    success: boolean;
    message: string;
    announcement?: Property;
};
export interface CreateImageResponse {
    success:boolean;
    message:string;
    imagesUrl?:Property['images'];
};
export interface DeleteImageResponse {
    success:boolean
    message:string
    imageUrl?:string
}
export interface GetAnnouncementsResponse{
    success: boolean;
    message: string;
    announcements?: Property[];
}
class Announcement{
    private app:FastifyInstance 
    private collection:string 
    constructor(app: FastifyInstance){
        this.app = app;
        this.collection = "announcements";
    }
    private connectDB():boolean{
          if(!this.app.mongo.db){
                this.app.log.error("MongoDB not connected");
                return false;
            }
            return true;   
    }
    private async createImage(images:Property['images']):Promise<CreateImageResponse>{
        try {
            let status:boolean = true;
            images.gallery.forEach(async (imageUrl,index)=>{
               const response = await cloudinary.uploader.upload(imageUrl,{folder:"announcements/pictures",resource_type:"image"})
               if(!response){
                status = false
               }else{
                const url:string = response.secure_url 
                images.gallery[index] = url
               }
            })
            if(!status){
                return {
                    success: false,
                    message: "Error uploading images"
                }
            }
            return {
                success:true,
                message: "Images uploaded successfully",
                imagesUrl:images
            }
        } catch (error) {
         const errorMessage:CreateImageResponse = {
            success: false,
            message: "Error uploading images"
         }
         return errorMessage;
        }
    }
    async createAnnouncement(data:Property):Promise<createResponse>{
        try {
            if(!this.connectDB()){
                return {
                    message: "Database connection error",
                    success: false
                }
            }
            const upload = await this.createImage(data.images)
            if(!upload.success){
                return {
                    message: upload.message,
                    success: false
                }
            }
            data.images = upload.imagesUrl || data.images;
            const result = await this.app.mongo.db?.collection<Property>(this.collection).insertOne(data);
            if(!result || !result.acknowledged){
                this.app.log.error("Failed to create announcement");
                return {
                    message: "Failed to create announcement",
                    success: false
                }
            }
            return {
                message: "Announcement created successfully",
                success: true,
                announcement: {
                    ...data,
                    _id: result.insertedId
                }
            }
        } catch (error) {
            this.app.log.error("Error creating announcement: " + error);
            return {
                message: "Error creating announcement",
                success: false
            }
        }
    }
    async getAnnouncements(userId:ObjectId,announcement:Property):Promise<GetAnnouncementsResponse>{
        try {
            const server = await this.connectDB()
            if(!server){
                return {
                    success: false,
                    message: "Database connection error",
                    announcements: []
                }

            }
         
            if(announcement._id){
                 const response = await this.app.mongo.db?.collection<GoogleUser | User>('advertiser').updateOne(
                { _id: userId },
                { $push: { "advertiserData.properties": announcement._id } } as unknown as PushOperator<Document>
            );
            if(!response?.acknowledged){
                this.app.log.error("Failed to update announcements for user: " + userId);
                return {
                    success: false,
                    message: "Failed to update announcements",
                    announcements: []
                }

            }
        }
           const annoucementUser = await this.app.mongo.db?.collection<GoogleUser | User>('advertiser').findOne(
               { _id: userId }
           )
            if(!annoucementUser){
                this.app.log.error("No announcements found for user: " + userId);
                return {
                    success: false,
                    message: "No announcements found",
                    announcements: []
                }

            }
            const sucessResponse:GetAnnouncementsResponse = {
                success: true,
                message: "Announcements fetched successfully",
                announcements: annoucementUser.advertiserData.properties || []
            }
            return sucessResponse
        } catch (error) {
            const errorMessage:GetAnnouncementsResponse = {
                success: false,
                message: "Error fetching announcements",
                announcements: []
            }
            return errorMessage
        }
    }
    async deleteImage(imageUrl:Property['images']['gallery']):Promise<DeleteImageResponse>{
        try {
            let status:boolean = true
            imageUrl.forEach(async (url,index)=>{
                const response = await cloudinary.uploader.destroy(`announcements/pictures/${url}`,{resource_type:"image"})
                if(!response){
                    status = false
                }
            })
            if(!status){
                return {
                    success: false,
                    message: "Error deleting images"
                }

            }
            return {
                success: true,
                message: "Images deleted successfully"
            }
            // const response = await cloudinary.uploader.destroy(imageUrl,{resource_type:"image"})
            /* 
             try {
            let status:boolean = true;
            images.gallery.forEach(async (imageUrl,index)=>{
               const response = await cloudinary.uploader.upload(imageUrl,{folder:"announcements/pictures",resource_type:"image"})
               if(!response){
                status = false
               }else{
                const url:string = response.secure_url 
                images.gallery[index] = url
               }
            })
            if(!status){
                return {
                    success: false,
                    message: "Error uploading images"
                }
            }
            return {
                success:true,
                message: "Images uploaded successfully",
                imagesUrl:images
            }
        } catch (error) {
         const errorMessage:CreateImageResponse = {
            success: false,
            message: "Error uploading images"
         }
         return errorMessage;
        }
            */
        } catch (error) {
            return {
                success: false,
                message: `Error deleting images: ${error}`
            }
        }
    }
    async deleteAnnouncement(id:ObjectId):Promise<DeleteAnnouncementResponse>{
        try {
            const server = this.connectDB()
            if(!server){
                return {
                    success: false,
                    message: "Database connection error"
                }
            }
            const result = await this.app.mongo.db?.collection<Property>('announcements').findOne(
                { _id: id }
            )
            if(!result){
                return {
                    success: false,
                    message: "Announcement not found"
                }
            }
            const deleteImage = await this.deleteImage(result.images.gallery)
            if(!deleteImage.success){
                return {
                    success: false,
                    message: deleteImage.message
                }
            }
            const deleteFromAdvertiser = await this.app.mongo.db?.collection<GoogleUser | User>('advertiser').updateMany(
                { "advertiserData.properties": id },
                { $pull: { "advertiserData.properties": id } } as any
            )
            if(!deleteFromAdvertiser || deleteFromAdvertiser.modifiedCount === 0){
                this.app.log.error("Failed to remove announcement from advertiser data");
                return {
                    success: false,
                    message: "Failed to remove announcement from advertiser data"
                }
            }
            const deleteResult = await this.app.mongo.db?.collection<Property>('announcements').deleteOne(
                { _id: id }
            )
            if(!deleteResult || deleteResult.deletedCount === 0){
                return {
                    success: false,
                    message: "Failed to delete announcement"
                }
            }
            return {
                success: true,
                message: "Announcement deleted successfully"
            }
        } catch (error) {
            return {
                message: `Internal error: ${error}`,
                success: false
            }
        }
    }
}
export default Announcement;