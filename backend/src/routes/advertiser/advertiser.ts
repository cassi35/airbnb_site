import { getProfileController } from "../../controllers/advertiser/profile/getProfile";
import { defineRoutes } from "#utils/utils.js";
import { verifyAuthMiddleware } from "middleware/auth.middeware";
import { updateProfileController } from "#controllers/advertiser/profile/updateProfile.js";
import { createAnnouncementController } from "#controllers/advertiser/announcement/createAnnouncement.js";
import { deleteAnnouncementController } from "#controllers/advertiser/announcement/deleteAnnouncement.js";
import { updateAnnouncementController } from "#controllers/advertiser/announcement/updateAnnouncement.js";
import { getAdvertiserAnnouncementsController } from "#controllers/advertiser/announcement/getAdvertiserAnnouncements.js";
import { getActiveAnnouncementsController } from "#controllers/advertiser/announcement/getActiveAnnouncements.js";
export default defineRoutes(app =>{
    app.post('/',{preHandler:verifyAuthMiddleware},getProfileController),
    app.patch('/',{preHandler:verifyAuthMiddleware},updateProfileController),
    app.post('/announcement', { preHandler: verifyAuthMiddleware }, createAnnouncementController),
    app.delete('/announcement/:id',{preHandler:verifyAuthMiddleware},deleteAnnouncementController),
    app.patch('/announcement/:id', { preHandler: verifyAuthMiddleware }, updateAnnouncementController),
    app.get('/announcement', { preHandler: verifyAuthMiddleware }, getAdvertiserAnnouncementsController),
    app.get('/announcement/active', { preHandler: verifyAuthMiddleware }, getActiveAnnouncementsController)
})