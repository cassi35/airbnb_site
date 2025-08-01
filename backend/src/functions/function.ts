import { SearchAnnouncementResponse, searchBody } from "#controllers/user/getSearchAnnouncement.js";
import { UserResponse } from "#controllers/user/getUserController.js";
import { ObjectId } from "mongodb";

export interface UserServiceFunction{
    getUserById(userId:ObjectId):Promise<UserResponse>,
    searchAnnouncements(data:searchBody):Promise<SearchAnnouncementResponse>
}