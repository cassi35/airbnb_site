import { getProfileController } from "../../controllers/advertiser/profile/getProfile";
import { defineRoutes } from "#utils/utils.js";
import { verifyAuthMiddleware } from "middleware/auth.middeware";
export default defineRoutes(app =>{
    app.post('/profile',{preHandler:verifyAuthMiddleware},getProfileController)
})