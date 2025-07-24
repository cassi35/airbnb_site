import { getProfileController } from "../../controllers/advertiser/profile/getProfile";
import { defineRoutes } from "#utils/utils.js";
import { verifyAuthMiddleware } from "middleware/auth.middeware";
import { updateProfileController } from "#controllers/advertiser/profile/updateProfile.js";
export default defineRoutes(app =>{
    app.post('/',{preHandler:verifyAuthMiddleware},getProfileController),
    app.patch('/',{preHandler:verifyAuthMiddleware},updateProfileController)
    
})