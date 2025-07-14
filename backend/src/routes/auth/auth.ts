
import { forgotPasswordController } from "#controllers/auth/forgotPassword.js";
import { getUserController } from "#controllers/auth/getUser.js";
import { loginController } from "#controllers/auth/login.js";
import { logoutController } from "#controllers/auth/logout.js";
import { resendVerificationTokenController } from "#controllers/auth/resendTokenVerification.js";
import { resetPasswordController } from "#controllers/auth/resetPassword.js";
import { signupController } from "#controllers/auth/signup.js";
import { verifyEmailController } from "#controllers/auth/verifyEmail.js";
import { callbackGoogle } from "#controllers/google/callbackGoogle.js";
import { redirectGoogle } from "#controllers/google/redirectGoogle.js";
import { defineRoutes } from "#utils/utils.js";

export default defineRoutes(app =>{
    app.post('/signup',signupController),
    app.post('/verify-email',verifyEmailController),
    app.post('/login',loginController),
    app.post('/logout',logoutController),
    app.post('/forgot-password',forgotPasswordController),
    app.post('/reset-password',resetPasswordController),
    app.post('/resend-verification-token',resendVerificationTokenController),
    app.post('/user',getUserController),
    app.get('/google',redirectGoogle),
    app.get('/google/callback',callbackGoogle)
})