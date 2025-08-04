import { DeepPartial, OptionSearchBody, SearchAnnouncementResponse, searchBody } from "#controllers/user/getSearchAnnouncement.js";
import { UserResponse } from "#controllers/user/getUserController.js";
import { UpdateUserResponse, UpdateUserSchema } from "#controllers/user/updateUserController.js";
import { Property } from "#database/schemas/property.schema.js";
import { GoogleUserData } from "#interface/google.js";
import { GoogleUser } from "#interface/google.schema.js";
import { User } from "@sentry/node";
import { FastifyInstance } from "fastify";
import { UserServiceFunction } from "functions/function";
import { ObjectId } from "mongodb";

class UserService implements UserServiceFunction {
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
    buildMongoFilter(obj: Record<string, any>, prefix = ""): Record<string, any> {
    const filter: Record<string, any> = {};
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            const path = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                Object.assign(filter, this.buildMongoFilter(obj[key], path));
            } else {
                filter[path] = obj[key];
            }
        }
    }
    return filter;
}
 async searchAnnouncements(data: OptionSearchBody): Promise<SearchAnnouncementResponse> {
     try {
//         type searchBodyTeste = {
//     location: {
//         address: string;
//         city: string;
//         state: string;
//         country: string;
//     };
//     houseRules: {
//         checkIn: string;
//         checkOut: string;
//         smokingAllowed: boolean;
//         petsAllowed: boolean;
//         partiesAllowed: boolean;
//     };
//     details: {
//         bedrooms: number;
//         bathrooms: number;
//         beds: number;
//         guests: number;
//         amenities: string[];
//     };
// };

        const filter = this.buildMongoFilter(data);
        const announcements = await this.app.mongo.db?.collection<Property>('announcements').find(filter).toArray()
        if (!announcements || announcements.length === 0) {
            return {
                success: false,
                message: "No announcements found",
            };
        }
        return {
            success:true,
            message: "Announcements found",
            announcements: announcements
        }
     } catch (error) {
        const errorMessage = {
            success:false,
            message: "Error searching announcements",
        } satisfies SearchAnnouncementResponse
        return errorMessage
     }
 }
flattenForDotNotation(obj: any, prefix = ''): any {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, this.flattenForDotNotation(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {} as any);
}
 async updateUserProfile(dataUpdated:object,userId:ObjectId):Promise<UpdateUserResponse>{
    try {
        const updateData = this.flattenForDotNotation(dataUpdated);
        const user = await this.app.mongo.db?.collection<GoogleUser | User | GoogleUserData>('user').updateOne(
            { _id: userId },
            { $set: updateData }
        )
        if(!user || user.modifiedCount == 0){
            return {
                sucess: false,
                message: "User not found or no changes made"
            }
        }
        const profile = await this.app.mongo.db?.collection<GoogleUser | User>("user").findOne({ _id: userId });
        if(!profile){
            return {
                sucess: false,
                message: "User not found after update"
            }
        }
        return {
            sucess:true,
            message: "Profile updated successfully",
            user: profile
        }
    } catch (error) {
        const errorMessage = {
             sucess:false,
             message:"error updating profile"
        } satisfies UpdateUserResponse
        return errorMessage;
    }
 }
}
export default UserService