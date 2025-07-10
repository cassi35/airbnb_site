import { verifyEmail } from "../../controllers/auth/verifyEmail";
import { signupController } from "../../controllers/auth/signup";
import { defineRoutes } from "../../utils/utils";
export default defineRoutes(app =>{
    app.post('/signup',signupController),
    app.post('/verify-email',verifyEmail)
})