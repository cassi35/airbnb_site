import { createAnnouncementController } from "#controllers/advertiser/announcement/createAnnouncement.js";
import { deleteAnnouncementController } from "#controllers/advertiser/announcement/deleteAnnouncement.js";
import { getActiveAnnouncementsController } from "#controllers/advertiser/announcement/getActiveAnnouncements.js";
import { getAdvertiserAnnouncementsController } from "#controllers/advertiser/announcement/getAdvertiserAnnouncements.js";
import { updateAnnouncementController } from "#controllers/advertiser/announcement/updateAnnouncement.js";
import { defineRoutes } from "#utils/utils.js";
import { verifyAuthMiddleware } from "middleware/auth.middeware";
export default defineRoutes(app =>{
        app.post('/', { preHandler: verifyAuthMiddleware }, createAnnouncementController),
        app.delete('/:id', {preHandler:verifyAuthMiddleware}, deleteAnnouncementController),
        app.patch('/:id', { preHandler: verifyAuthMiddleware }, updateAnnouncementController),
        app.get('/', { preHandler: verifyAuthMiddleware }, getAdvertiserAnnouncementsController),
        app.get('/active', { preHandler: verifyAuthMiddleware }, getActiveAnnouncementsController),
        app.post('/create', { preHandler: verifyAuthMiddleware }, createAnnouncementController)
})
