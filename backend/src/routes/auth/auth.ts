import { verifyEmail } from "../../controllers/auth/verifyEmail";
import { signupController } from "../../controllers/auth/signup";
import { defineRoutes } from "../../utils/utils";
import { loginController } from "../../controllers/auth/login";
import { logoutController } from "../../controllers/auth/logout";
export default defineRoutes(app =>{
    app.post('/signup',signupController),
    app.post('/verify-email',verifyEmail),
    app.post('/login',loginController),
    app.post('/logout',logoutController)
})