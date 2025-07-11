
import { forgotPasswordController } from "#controllers/auth/forgotPassword.js";
import { loginController } from "#controllers/auth/login.js";
import { logoutController } from "#controllers/auth/logout.js";
import { resetPasswordController } from "#controllers/auth/resetPassword.js";
import { signupController } from "#controllers/auth/signup.js";
import { verifyEmailController } from "#controllers/auth/verifyEmail.js";
import { defineRoutes } from "#utils/utils.js";

export default defineRoutes(app =>{
    app.post('/signup',signupController),
    app.post('/verify-email',verifyEmailController),
    app.post('/login',loginController),
    app.post('/logout',logoutController),
    app.post('/forgot-password',forgotPasswordController),
    app.post('/reset-password',resetPasswordController)
})