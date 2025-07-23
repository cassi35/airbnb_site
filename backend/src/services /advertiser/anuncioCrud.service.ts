import cloudinary from "#config/cloudinary.js";
import { Property } from "#database/schemas/property.schema.js";
import { GoogleUser } from "#interface/google.schema.js";
import { User } from "@sentry/node";
import { FastifyInstance } from "fastify";
import { ObjectId } from "mongodb";
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
            const response = await this.app.mongo.db?.collection<GoogleUser | User>('advertiser').updateOne(
                { _id: userId },
                { $set: { properties: [announcement._id] } }
            )
            if(!response?.acknowledged){
                this.app.log.error("Failed to update announcements for user: " + userId);
                return {
                    success: false,
                    message: "Failed to update announcements",
                    announcements: []
                }

            } 
           const annoucementUser = await this.app.mongo.db?.collection<GoogleUser | User>('advertiser').findOne(
                { _id: userId },
                { projection: { properties: 1 } }
            );
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
}
export default Announcement;