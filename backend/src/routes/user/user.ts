import { getUserProfileController } from "#controllers/user/getUserController.js";
import { getSearchListingAnnouncementsController } from "#controllers/user/getSearchAnnouncement.js";
import { defineRoutes } from "#utils/utils.js";
import { verifyAuthMiddleware } from "middleware/auth.middeware";

export default defineRoutes(app=>{
    app.get('/', { preHandler: verifyAuthMiddleware }, getUserProfileController),
    app.post('/search', { preHandler: verifyAuthMiddleware }, getSearchListingAnnouncementsController)
})