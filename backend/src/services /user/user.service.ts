import { SearchAnnouncementResponse, searchBody } from "#controllers/user/getSearchAnnouncement.js";
import { UserResponse } from "#controllers/user/getUserController.js";
import { Property } from "#database/schemas/property.schema.js";
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
 async searchAnnouncements(data: searchBody): Promise<SearchAnnouncementResponse> {
     try {
        type searchBodyTeste = {
    location: {
        address: string;
        city: string;
        state: string;
        country: string;
    };
    houseRules: {
        checkIn: string;
        checkOut: string;
        smokingAllowed: boolean;
        petsAllowed: boolean;
        partiesAllowed: boolean;
    };
    details: {
        bedrooms: number;
        bathrooms: number;
        beds: number;
        guests: number;
        amenities: string[];
    };
};
 type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<any>
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};


        type OptionSearchBody = DeepPartial<searchBodyTeste>
        const data = {
        location: {
            address: 'Rua XPTO'
            // os outros campos são opcionais
        },
        houseRules: {
            petsAllowed: true
            // o resto é opcional
        }
        } satisfies OptionSearchBody;
        const searchData:OptionSearchBody = {}
        const announcements = await this.app.mongo.db?.collection<Property>('announcements').find(data).toArray()
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
}
export default UserService