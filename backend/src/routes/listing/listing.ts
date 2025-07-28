import { deleteAnnouncementFromListController } from "#controllers/listing/deleteAnnouncementsFromList.js";
import { getAnnouncementListUserController } from "#controllers/listing/getAnnoucementLIstUser.js";
import { getAnnouncementsController } from "#controllers/listing/getAnnouncementListing.js";
import { insertListController } from "#controllers/listing/insertListing.js";
import { defineRoutes } from "#utils/utils.js";
import { verifyAuthMiddleware } from "middleware/auth.middeware";

export default defineRoutes(app =>{
    app.get('/:id',{preHandler: verifyAuthMiddleware}, getAnnouncementsController),
    app.get('/', { preHandler: verifyAuthMiddleware }, getAnnouncementListUserController),
    app.post('/insert/:id', { preHandler: verifyAuthMiddleware }, insertListController),
    app.delete('/:id', { preHandler: verifyAuthMiddleware }, deleteAnnouncementFromListController)
})