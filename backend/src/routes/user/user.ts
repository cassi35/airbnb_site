import { getUserProfileController } from "#controllers/user/getUserController.js";
import { getSearchListingAnnouncementsController } from "#controllers/user/getSearchAnnouncement.js";
import { defineRoutes } from "#utils/utils.js";
import { verifyAuthMiddleware } from "middleware/auth.middeware";
import { updateUserController } from "#controllers/user/updateUserController.js";

export default defineRoutes(app=>{
    app.get('/', { preHandler: verifyAuthMiddleware }, getUserProfileController),
    app.post('/search', { preHandler: verifyAuthMiddleware }, getSearchListingAnnouncementsController),
    app.patch('/update',{preHandler:verifyAuthMiddleware},updateUserController)
})